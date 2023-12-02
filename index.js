const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");

app.use(express.json());

const data = fs.readFileSync("./users.json", "utf8");
const users = JSON.parse(data);

//get all users
app.get("/users", (req, res) => {
  res.send(users);
});
//get first user
app.get("/users/first", (req, res) => {
  let firstUser = users[0];
  res.send(firstUser);
});
//get last user
app.get("/users/last", (req, res) => {
  let lastUser = users[users.length - 1];
  res.send(lastUser);
});
//get user by id
app.get("/users/:id", (req, res) => {
  let id = req.params.id;
  let user = users.find((el) => el.id === parseInt(id));
  res.send(user);
});
// get user by city
app.get("/users/city/:city", (req, res) => {
  let city = req.params.city;
  let usersInCity = users.filter((el) => el.address && el.address.city === city);
  res.send(usersInCity);
});
// get street by id
app.get("/users/:id/street", (req, res) => {
  let id = req.params.id;
  let user = users.find((el) => el.id === parseInt(id));
  res.send(user.address.street);
});
// add new user
app.post("/users", (req, res) => {
  let name = req.body.name;
  let age = req.body.age;

  let newUser = { name, age };
  users.push(newUser);

  fs.writeFileSync("./users.json", JSON.stringify(users));
  res.send({ success: true });
});
// update user
app.put("/users/:id", (req, res) => {
  let id = req.params.id;
  let name = req.body.name;
  let age = req.body.age;

  let user = users.find((el) => el.id === parseInt(id));
  user.name = name;
  user.age = age;

  fs.writeFileSync("./users.json", JSON.stringify(users));
  res.send({ success: true });
});
// delete user
app.delete("/users/:id", (req, res) => {
  let id = req.params.id;

  // Find the index of the user with the given id
  let index = users.findIndex((el) => el.id === parseInt(id));

  if (index !== -1) {
    // Remove the user from the array
    users.splice(index, 1);

    // Save the updated array to the file
    fs.writeFileSync("./users.json", JSON.stringify(users));

    res.send({ success: true });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
