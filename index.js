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
    const coursesCollection = client.db("todoapp").collection("xcourses");

    // creating a course

    app.post("/api/course/add", async (req, res) => {
      const newCourse = req.body;
      console.log(newCourse);
      const result = await coursesCollection.insertOne(newCourse);
      res.send("The course has been added successfully");
    });

    // Display Course List

    app.get("/api/course/allcourses", async (req, res) => {
      const query = {};
      const cursor = coursesCollection.find(query);
      const allCourses = await cursor.toArray();
      res.send(allCourses);
    });

    // Find Course By ID

    app.get("/api/course/findbyid/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const course = await coursesCollection.findOne(query);
      res.send(course);
    });

    //Deleting a course

    app.delete("/api/course/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coursesCollection.deleteOne(query);
      res.send("Course Deleted" + result);
    });

    // updating a course

    app.put("/api/course/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateCourseDetails = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = {
        upsert: true,
      };
      const updateDoc = {
        $set: {
          name: updateCourseDetails.nameUpdate,
          description: updateCourseDetails.descriptionUpdate,
          price: updateCourseDetails.priceUpdate,
          duration: updateCourseDetails.durationUpdate,
        },
      };
      const result = await coursesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
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
