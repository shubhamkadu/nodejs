/*
const express = require("express");
const app = express();
const port = 5000;
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient
const dburl =  'mongodb://127.0.0.1:27017'
app.use(express.json())


//open connections
//select the db
//select the collections
//perform db operation
//close connections



app.get("/", (req, res) => {
  res.status(200).send("wellcome");
});
//get requist can accept by default
app.get("/user", (req, res) => {
  console.log("user");
  res.status(200).send("users Route");
});
// //post req. cannot accept by default we have set some functionality
// app.post("/stu", (req, res) => {
//   res.status(200).send("wellcome to stu");
// });

const students = [];
app.post("/students", (req, res) => {
  students.push({
    name: `student-${students.length + 1}`,
    id: students.length + 1,
  });
  res.status(200).json({ meassage: "wellcome to stu" });
});
app.get("/students", (req, res) => {
  if(students[req.params.id-1]){
    res.json({student:students[req.params.id-1]})
  }else{
    res.json('No record available')
  }
  //res.status(200).json({ students });
});

app.put('/student/:id',(req,res)=>{
  if (students[req.params.id - 1]) {
    student[req.params.id-1].name=req.body.name
    res.json({meassage:'record updated'});
  } else {
    res.json("No record available");
  }
})

app.listen(port, () => {
  console.log(`listening${port}`);
});

*/

// const express = require("express");
// const app = express();
// const port = 5000;
// const mongodb = require("mongodb");
// const mongoClient = mongodb.MongoClient;
// // const dburl = "mongodb://127.0.0.1:27017";
// const dburl =
//   "mongodb+srv://shubham:001110@cluster0.nynuy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// app.use(express.json());

// //open connections
// //select the db
// //select the collections
// //perform db operation
// //close connections

// app.get("/", (req, res) => {
//   res.status(200).send("wellcome");
// });
// //get requist can accept by default
// app.get("/user", (req, res) => {
//   console.log("user");
//   res.status(200).send("users Route");
// });
// // //post req. cannot accept by default we have set some functionality
// // app.post("/stu", (req, res) => {
// //   res.status(200).send("wellcome to stu");
// // });

// const students = [];
// app.post("/students", async (req, res) => {
//   //open connections
//   let client = await mongoClient.connect(dburl);
//   try {
//     //select the db
//     let db = client.db("nodedb");
//     //select the collections and perform the operation
//     const data = db.collection("users").insertOne(req.body);
//     //close connections
//     res.json({ message: "record created" });
//   } catch (err) {
//     console.log(err);
//     res.json({ message: "something went wrong" });
//   } finally {
//     client.close();
//   }
// });

// app.get("/students", (req, res) => {
//   if (students[req.params.id - 1]) {
//     res.json({ student: students[req.params.id - 1] });
//   } else {
//     res.json("No record available");
//   }
//   //res.status(200).json({ students });
// });

// app.put("/student/:id", (req, res) => {
//   if (students[req.params.id - 1]) {
//     student[req.params.id - 1].name = req.body.name;
//     res.json({ meassage: "record updated" });
//   } else {
//     res.json("No record available");
//   }
// });

// app.listen(port, () => {
//   console.log(`listening${port}`);
// });

const express = require("express");
const app = express();
const port = process.env.PORT || 5000
const mongodb = require("mongodb")
const { hashing, hashCompare, createJWT, authorize } = require("./helper/auth")
const mongoClient = mongodb.MongoClient;
// const dburl = "mongodb://127.0.0.1:27017";
const dburl =
  "mongodb+srv://shubham:001110@cluster0.nynuy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
app.use(express.json());

//open connections
//select the db
//select the collections
//perform db operation
//close connections

const students = [];
app.post("/students", async (req, res) => {
  //open connections
  let client = await mongoClient.connect(dburl);
  try {
    //select the db
    let db = client.db("nodedb");
    //select the collections and perform the operation
    const data = db.collection("users").insertOne(req.body);
    //close connections
    res.json({ message: "record created" });
  } catch (err) {
    console.log(err);
    res.json({ message: "something went wrong" });
  } finally {
    client.close();
  }
});

// to get the data

app.get("/students", async (req, res) => {
  //open connections
  let client = await mongoClient.connect(dburl);
  try {
    //select the db
    let db = client.db("nodedb");
    //select the collections and perform the operation
    const data = await db.collection("users").find().toArray();
    //close connections
    res.json({ message: "success", data });
  } catch (err) {
    console.log(err);
    res.json({ message: "something went wrong" });
  } finally {
    client.close();
  }
});

app.get("/students/:id", async (req, res) => {
  //open connections
  let client = await mongoClient.connect(dburl);
  const objid = mongodb.ObjectID(req.params.id);
  try {
    let db = client.db("nodedb");
    const data = await db.collection("users").findOne({ _id: objid });
    res.json({ message: "success", data });
  } catch (err) {
    console.log(err);
    res.json({ message: "something went wrong" });
  } finally {
    client.close();
  }
});

app.put("/student-update/:id", async (req, res) => {
  let client = await mongoClient.connect(dburl);

  const objid = mongodb.ObjectID(req.params.id);
  try {
    let db = client.db("nodedb");
    const data = await db.collection("users").findOne({ _id: objid });
    if (data) {
      const update = await db
        .collection("users")
        .findOneAndUpdate({ _id: objid }, { $set: { phone: req.body.phone } });
      res.json({ message: "success" });
    } else res.json({ message: "no users available" });
  } catch (err) {
    console.log(err);

    res.json({ message: "something went wrong" });
  } finally {
    client.close();
  }
});



app.delete("/delete-student/:id", async (req, res) => {
  let client = await mongoClient.connect(dburl);
  const objid = mongodb.ObjectID(req.params.id);
  try {
    let db = client.db("nodedb");
    const data = await db.collection("users").findOne({ _id: objid });
    if (data) {
      const update = await db
        .collection("users")
        .findOneAndDelete({ _id: objid }, { $set: { phone: req.body.phone } });
      res.json({ message: "success" });
    } else res.json({ message: "no users available" });
  } catch (err) {
    console.log(err);

    res.json({ message: "something went wrong" });
  } finally {
    client.close();
  }
});





app.get("/users",authorize, async (req, res) => {
  //open connections
  let client = await mongoClient.connect(dburl);
  try {
    //select the db
    let db = client.db("nodedb");
    //select the collections and perform the operation
    const data = await db.collection("users").find().toArray();
    //close connections
    res.json({ message: "success", data });
  } catch (err) {
    console.log(err);
    res.json({ message: "something went wrong" });
  } finally {
    client.close();
  }
});







app.post("/register",authorize, async (req, res) => {
  //open connections
  let client = await mongoClient.connect(dburl);
  try {
    //select the db
    let db = client.db("nodedb");
    //select the collections and perform the operation
    const data = db.collection("users").insertOne(req.body);
    //close connections
    res.json({ message: "record created" });
  } catch (err) {
    console.log(err);
    res.json({ message: "something went wrong" });
  } finally {
    client.close();
  }
});





app.listen(port, () => {
  console.log(`listening${port}`);
});

