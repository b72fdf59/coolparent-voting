require("dotenv").config();
const express = require("express");
const typeform = require("@typeform/api-client");
const typeformAPI = typeform.createClient({
  token: process.env.TYPEFORM_TOKEN
});

const app = express();

app.get("/api", (_, res) => {
  // will retrieve all forms
  typeformAPI.responses.list({ uid: process.env.FORM_ID }).then(data => {
    res.json({ success: true, data });
  });
});

function scoring(data) {
  // input: response data from typeform API
  // output calculated scores for each parent
  let students, parents;
  for (let individual of data.items) {
  }
}
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

app.listen(process.env.PORT || 8081);
