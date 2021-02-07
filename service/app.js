const mongoose = require('mongoose');
const express = require('express');
const lodash = require('lodash');
const app = express();
const Doc = require('./controller/Doc');
const Project = require('./controller/Project');
const Mock = require('./controller/Mock');


const project = new Project();
const mock = new Mock();
const doc = new Doc();

const URL = "mongodb://81.70.214.186:27017/bmock";
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(d => {

});
app.use(express.json())

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header('Access-Control-Allow-Headers', 'token,Content-Type');
  // res.header('Access-Control-Max-Age', 60);
  next();
});

app.listen(3000, () => {
  console.log('success')
});

app.get('/', (req, res) => {
  res.send('hello')
})


app.get('/login', (req, res) => {
  res.send('login')
});


const map = {
  '/project': project,
  '/doc':doc,
  '/mock':mock,
}

for (const path in map) {
  const controller = map[path];
  app.get(path, controller.get.bind(controller));
  app.post(path, controller.post.bind(controller));
  app.put(path, controller.put.bind(controller));
  app.delete(path, controller.delete.bind(controller));
}


