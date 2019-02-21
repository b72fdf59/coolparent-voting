// @flow
const express = require("express");

// bodyParser, parses the request body to be a readable json format

const app = express();

app.get("/coolparent", (_, res) => {
  const maxInt = 30;
  const people = [
    "Kevin Durant",
    "David Beckham",
    "Queen Elizabeth",
    "Mo",
    "Sia",
    "Jason Kidd",
    "Michael Jordan",
    "Bill Gates",
    "Dr. Strange",
    "Hula Hoop",
    "Cixin Liu",
    "Isaac Newton",
    "Albert Einstein",
    "花木兰",
    "San Zhang",
    "Si Li"
  ];
  const data = people.map(p => {
    return { _id: p, value: Math.floor(Math.random() * maxInt) + 1 };
  });
  return res.json({ success: true, data: data });
});

app.listen(process.env.PORT || 8080);
