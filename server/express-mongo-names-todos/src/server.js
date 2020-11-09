console.log("app is loading ...");

const express = require("express"); // third party module
const path = require("path"); // node core module
const mongodb = require("mongodb");

// --- show all documents from collection names in db personsDB
const MongoClient = mongodb.MongoClient,
  url = "mongodb://localhost:27017/",
  dbName = "personsDB",
  collectionName = "names";

const app = express();

// ---- work correctly with body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

const PORT = 8080;

let todos = [],
  // --- add events page and add event form page (form)
  events = ["course open in 21/12/2020", "Mom borthday 1/1/2021"];
// --- use view engine for dynamic data
app.set("view engine", "hbs");
const publicPath = path.join(__dirname, "..", "public");
// --- middleware : app.use
// --- routing agreement : / -> index.html
// --- routing agreement : /about.html -> about.html
console.log(`publicPath : ${publicPath}`);
app.use(express.static(publicPath));

app.get("/names", (req, res) => {
  // --- connect to the database
  MongoClient.connect(url, function (err, db) {
    if (err) throw err; // --- throw exception
    const dbo = db.db(dbName); // --- dbo is an object that represnt personsDB database

    dbo
      .collection(collectionName)
      .find({}) // --- find all documents
      .toArray(function (err, names) {
        if (err) throw err; // --- throw exception

        console.log(names); // --- all documents in names collections
        db.close(); // -- close connection
        res.render("names", { names: names });
      });
  });

  // --- write the array to names.hbs
});

app.get("/todos", (req, res) => {
  res.render("todos", { todos: todos });
});

// --- expect an http get request with route of /server-date
app.get("/server-date", (req, res) => {
  const date = new Date();
  // --- first argument : view file name , second argument : dynamic info
  res.render("server-date", { serverDate: date.toString() });
});

// --- /add-name-form is the same as action in add-name-form.html
// --- app.post is used because method="post" is used in add-name-form.html
app.post("/add-name-form", (req, res) => {
  // --- req.body is used because post request patss info via body
  console.log(req.body);
  console.log("form info arrive");

  // --- name is used in req.body.name because the name in the form in add-name-form.html is name
  const newName = req.body.name;
  // ****************************************

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db(dbName);
    const nameObj = { name: newName };
    dbo.collection(collectionName).insertOne(nameObj, function (err, result) {
      if (err) throw err;
      console.log("1 document inserted");

      db.close(); // -- close connection
      res.redirect('/names'); 
    });
  });
});

// --- /add-todo-form is the same as action in add-todo-form.html
// --- app.post is used because method="post" is used in add-todo-form.html
app.post("/add-todo-form", (req, res) => {
  // --- req.body is used because post request patss info via body
  console.log(req.body);

  // --- todo is used in req.body.todo because the name in the form in add-todo-form.html is todo
  const newTodo = req.body.todo;

  // --- todos is the name of the array
  todos.push(newTodo);
  console.log("form info arrive");

  // // --- pass todos to todos.hbs
  // res.render("todos", { todos: todos });
  res.redirect("/todos")
});

// ---- get names from personsDB and pass to names.hbs

app.listen(PORT, () => {
  console.log(`server listens on localhost:${PORT}`);
});
