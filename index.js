const express = require("express");
const path = require("path");
const fs = require("fs");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const app = express();
const port = process.env.PORT || "8887";

var dom, libraries;
const libraryNS = "http://www.opengis.net/kml/2.2";

loadLibraryData();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//set up static path (for use with CSS, client-side JS, and image files)
app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//   res.render("index", { title: "Home" });
// });
app.get("/", (req, res) => {
  let list = listLibraries();
  res.render("index", { title: "Libraries", libraries: list });
});
// "/libraries/1"
app.get('/libraries', (req, res) => {
  let id = req.query.libraries;
  let library = getLibraryById(id);
  let title = library.querySelector("name").textContent;

  res.render("library", { title: title, library: library });
});


//server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

function loadLibraryData() {
  fs.readFile(
    "./data/library-data.kml", 
    "utf-8",
    (err, data) => {
      dom = new JSDOM(data, { contentType: "application/xml" });
      libraries = dom.window.document; //DOM document
    }
  )
};

function listLibraries() {
  return libraries.querySelectorAll("Placemark");
};

function getLibraryById(id) {
//   let query = `//Placemark[@id/text()=${id}]`;
  let query = `//Placemark[@id='${id}']`;
//   let id = library.getAttribute("id");
//   let query = "/Placemark/"+id;
  //4 = XPathResult.UNORDERED_NODE_ITERATOR_TYPE
  let lib = libraries.evaluate(query, libraries, libraryNS, 4, null).iterateNext();
  return lib;
};




