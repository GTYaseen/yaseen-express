const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const { Client } = require("pg");

app.use(express.json());

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "yaseen",
  password: "77565155",
  port: "5432",
});
client.connect();

//welcome
app.get("/", (req, res) => {
  res.send(
    "Welcome to yaseen-express\n you can do alot of things with yaseen-express\n /users \n /users/first \n /users/last \n /users/:id \n /users/:id/street \n /users/city/:city \n update user \n delete user \n create user"
  );
});
//get all users
app.get("/users", (req, res) => {
  client.query("SELECT * FROM users", (err, users) => {
    res.send(users.rows);
  });
});
//get first user
app.get("/users/first", (req, res) => {
  client.query("SELECT * FROM users ORDER BY id ASC LIMIT 1", (err, users) => {
    res.send(users.rows);
  });
});
//get last user
app.get("/users/last", (req, res) => {
  client.query("SELECT * FROM users ORDER BY id DESC LIMIT 1", (err, users) => {
    res.send(users.rows);
  });
});
//get user by id
app.get("/users/:id", (req, res) => {
  let id = req.params.id;
  client.query(`SELECT * FROM users WHERE id = ${id}`, (err, users) => {
    res.send(users.rows);
  });
});
// get user by city
app.get("/users/city/:city", (req, res) => {
  let city = req.params.city;
  client.query(
    `SELECT * FROM users WHERE address->>'city' = '${city}'`,
    (err, users) => {
      res.send(users.rows);
    }
  );
});
//get user by company
app.get("/users/company/:company", (req, res) => {
  let company = req.params.company;
  client.query(
    `	SELECT * FROM users WHERE company->>'name' = '${company}'`,
    (err, users) => {
      res.send(users.rows);
    }
  );
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
  let username=req.body.username;
  let email = req.body.email;
  let street = req.body.address.street;
  let suite = req.body.address.suite;
  let city = req.body.address.city;
  let zipcode = req.body.address.zipcode;
  let phone = req.body.phone;
  let website = req.body.website;
  let cname = req.body.company.name;
  let ccatchPhrase = req.body.company.catchPhrase;
  let cbs = req.body.company.bs;
  client.query(
    `insert into users(name,username,email,address,phone,website,company) values (
      '${name}',
      '${username}',
      '${email}',
      '{
        "street": "${street}",
        "suite": "${suite}",
        "city": "${city}",
        "zipcode": "${zipcode}",
      }',
      '${phone}',
      '${website}',
      '{
        "name": "${cname}",
        "catchPhrase": "${ccatchPhrase}",
        "bs": "${cbs}",
      }'
    )`
  )
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
