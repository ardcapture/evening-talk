import { MongoClient } from "mongodb";

const name = "learn-react";

console.log("Setting up mongo client");

(async function () {
  const client = new MongoClient("mongodb://127.0.0.1:27017");

  try {
    console.log("Connecting to database ...");

    await client.connect();

    console.log("Connected Successfully!");

    const database = client.db("react-blog-db");

    const article = await database.collection("articles").findOne({ name });

    console.log(article);
  } catch (err) {
    console.log(err.stack);
  }

  await client.close();
})();
