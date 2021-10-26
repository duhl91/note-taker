const fs = require("fs");
const path = require("path");

module.exports = (app) => {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    var notes = JSON.parse(data);
    // - - - API Routes - - -
    //GET notes
    app.get("/api/notes", function (req, res) {
      res.json(notes);
    });
    // POST notes
    app.post("/api/notes", function (req, res) {
      let newNote = req.body;
      notes.push(newNote);
      updateDb();
      return console.log("Added new note: " + newNote.title);
    });
    //GET note by ID
    app.get("/api/notes/:id", function (req, res) {
      res.json(notes[req.params.id]);
    });
    //DELETE note by ID
    app.delete("/api/notes/:id", function (req, res) {
      notes.splice(req.params.id, 1);
      updateDb();
      console.log("Deleted note with id " + req.params.id);
    });
    // - - - Views - - -
    app.get("/notes", function (req, res) {
      res.sendFile(path.join(__dirname, "../public/notes.html"));
    });

    app.get("*", function (req, res) {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });
    //updates the db.json file when a note is added or deleted
    function updateDb() {
      fs.writeFile("db/db.json", JSON.stringify(notes, "\t"), (err) => {
        if (err) throw err;
        return true;
      });
    }
  });
};
