const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpxgr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpxgr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const xcourses = client.db("todoapp").collection("xcourses");

    // creating a course

    app.post("/api/course/add", async (req, res) => {
      const newCourse = req.body;
      console.log(newCourse);
      const result = await xcourses.insertOne(newCourse);
      res.send("The course has been added successfully");
    });

    // Display Course List

    app.get("/api/course/allcourses", async (req, res) => {
      const query = {};
      const cursor = xcourses.find(query);
      const allCourses = await cursor.toArray();
      res.send(allCourses);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Running.....");
});

app.listen(port, () => {
  console.log("Listening  @Port:", port);
});

module.exports = app;
