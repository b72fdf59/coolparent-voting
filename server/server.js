const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") });
const express = require("express");
const typeform = require("@typeform/api-client");
const typeformAPI = typeform.createClient({
  token: process.env.TYPEFORM_TOKEN
});

const app = express();
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth"
  );
  res.header("Access-Control-Expose-Headers", "x-auth");
  next();
});

app.get("/api", (_, res) => {
  // will retrieve all forms
  typeformAPI.responses.list({ uid: process.env.FORM_ID }).then(data => {
    res.json({ success: true, data: scoring(data) });
  }).catch(e => {
    console.log(e);
  });
});

function scoring(data) {
  // input: response data from typeform API
  // output calculated scores for each parent
  let students = [],
    parents = [],
    questions;
  for (let individual of data.items) {
    if (!individual.hasOwnProperty("answers")) {
      continue;
    }
    for (let question of individual.answers) {
      if (question.field.id === process.env.FIELD_ROLE_ID) {
        if (question.choice.label === "Student") {
          students.push(individual.answers);
        } else if (question.choice.label === "Parent") {
          parents.push(individual.answers);
        }
      }
      if (!questions) {
        // get a list of question ids, excluding questions such as those asking name/email
        questions = individual.answers.filter(
          a =>
            [
              process.env.FIELD_NAME_ID,
              process.env.FIELD_EMAIL_ID,
              process.env.FIELD_ROLE_ID
            ].indexOf(a.field.id) === -1
        );
      }
    }
  }
  // get value of each choice for a question from students. if the choice is not there, means 0
  let answer_values = {};
  for (let student of students) {
    for (let question of student) {
      if (
        [
          process.env.FIELD_NAME_ID,
          process.env.FIELD_EMAIL_ID,
          process.env.FIELD_ROLE_ID
        ].indexOf(question.field.id) === -1
      ) {
        if (!answer_values.hasOwnProperty(question.field.id)) {
          answer_values[question.field.id] = {};
        }
        // the answer might be an array
        if (question.hasOwnProperty("choice")) {
          // not an array
          answer_values[question.field.id][question.choice.label] =
            1 + (answer_values[question.field.id][question.choice.label] || 0);
        } else if (question.hasOwnProperty("choices")) {
          // an array
          for (let label of question.choices.labels) {
            answer_values[question.field.id][label] =
              1 + (answer_values[question.field.id][label] || 0);
          }
        }
      }
    }
  }
  // normalise answer_values, so that each choice has a value of [0, 1]
  let norm_answer_values = {};
  Object.entries(answer_values).map(entry => {
    const sum = Object.values(entry[1]).reduce((a, b) => a + b, 0);
    norm_answer_values[entry[0]] = {};
    Object.entries(entry[1]).map(choice => {
      norm_answer_values[entry[0]][choice[0]] = choice[1] / sum;
    });
  });
  // get parent scores
  const parent_scores = parents.map(parent => {
    let value = 0,
      _id,
      _email;
    for (let question of parent) {
      if (question.field.id === process.env.FIELD_NAME_ID) {
        _id = question.text;
      } else if (question.field.id === process.env.FIELD_EMAIL_ID) {
        _email = question.email;
      } else if (norm_answer_values.hasOwnProperty(question.field.id)) {
        // the answer might be an array
        if (question.hasOwnProperty("choice")) {
          // not an array
          value +=
            norm_answer_values[question.field.id][question.choice.label] || 0;
        } else if (question.hasOwnProperty("choices")) {
          // an array
          for (let label of question.choices.labels) {
            value += norm_answer_values[question.field.id][label] || 0;
          }
        }
      }
    }
    return { _id, _email, value };
  });
  return parent_scores;
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

app.listen(process.env.SERVER_PORT || 8080);
