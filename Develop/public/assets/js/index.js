// 
var noteTitle = $(".note-title");
var noteText = $(".note-textarea");
var saveNoteBtn = $(".save-note");
var newNoteBtn = $(".new-note");
var noteList = $(".list-container .list-group");

// currentNote is used to keep track of the note in the textarea
var currentNote = {};

//Grabs all notes from the db
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

//Saves note to db
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

//Deletes note from db
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  })
};

//Renders current note, else renders nothing
var rendercurrentNote = function() {
  saveNoteBtn.hide();

  if (typeof currentNote.id === "number") {
    noteTitle.attr("readonly", true);
    noteText.attr("readonly", true);
    noteTitle.val(currentNote.title);
    noteText.val(currentNote.text);
  } else {
    noteTitle.attr("readonly", false);
    noteText.attr("readonly", false);
    noteTitle.val("");
    noteText.val("");
  }
};

// Get note data from the inputs, save it to db and update the view
var handleNoteSave = function() {
  var newNote = {
    title: noteTitle.val(),
    text: noteText.val()
  };

  saveNote(newNote);
    getAndRenderNotes();
    rendercurrentNote();
};

// Delete the clicked note
var handleNoteDelete = function(event) {
  event.stopPropagation();

  var note = $(this).data('id');

  if (currentNote.id === note) {
    currentNote = {};
  }

  deleteNote(note);
  getAndRenderNotes();
  rendercurrentNote();
};

// Sets the currentNote and displays it
var handleNoteView = function() {
  currentNote = $(this).data();
  rendercurrentNote();
};

// Sets the currentNote to and empty object and allows the user to enter a new note
var handleNewNoteView = function() {
  currentNote = {};
  rendercurrentNote();
};

// Will not allow the user to save a note with empty title or text field
var handleRenderSaveBtn = function() {
  if (!noteTitle.val().trim() || !noteText.val().trim()) {
    saveNoteBtn.hide();
  } else {
    saveNoteBtn.show();
  }
};

// Render's the list of note titles
var renderNoteList = function(notes) {
  noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var li = $("<li class='list-group-item'>").data(note);
    li.data('id',i);

    var span = $("<span>").text(note.title);
    var delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note' data-id="+i+">"
    );

    li.append(span, delBtn);
    noteListItems.push(li);
  }

noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

saveNoteBtn.on("click", handleNoteSave);
noteList.on("click", ".list-group-item", handleNoteView);
newNoteBtn.on("click", handleNewNoteView);
noteList.on("click", ".delete-note", handleNoteDelete);
noteTitle.on("keyup", handleRenderSaveBtn);
noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();