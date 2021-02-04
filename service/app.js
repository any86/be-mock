const mongoose = require('mongoose');
const express = require('express');
const lodash = require('lodash');
const app = express();
const TreeModel = require('./model/Tree');
const ProjectModel = require('./model/Project');

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
})


app.get('/project', (req, res) => {
  const { id: _id } = req.query;
  if (_id) {
    ProjectModel.findOne({ _id }, (err, document) => {
      if (err) res.sendStatus(404);
      res.send(document);
    });
  } else {
    ProjectModel.find((err, document) => {
      if (err) res.sendStatus(404);
      res.send(document);
    });
  }
});


app.post('/project', async (req, res) => {
  try {
    const document = await ProjectModel.create({...req.body,createAt:Date.now()});
    res.json({id:document._id});
  } catch (error) {
    res.send(error);
  }
});


app.delete('/project', async (req, res) => {
  const { id: _id } = req.query;
  await ProjectModel.remove({ _id });
  res.json({message:'ok'});
});



app.get('/tree', (req, res) => {
  const { id: _id } = req.query;
  if (_id) {
    TreeModel.findOne({ _id }, (err, document) => {
      if (err) res.sendStatus(404);
      res.send(document);
    });
  } else {
    TreeModel.find((err, document) => {
      if (err) res.sendStatus(404);
      res.send(document);
    });
  }
});

app.post('/tree', async (req, res) => {
  try {
    const document = await TreeModel.create({ tree: req.body.tree });
    res.json({id:document._id});
  } catch (error) {
    res.send(error);
  }
});

app.put('/tree', async (req, res) => {
  const { id: _id } = req.query;
  const document = await TreeModel.updateOne({ _id }, { tree: req.body.tree });
  res.json(document._id);
});

app.delete('/tree', async (req, res) => {
  const { id: _id } = req.query;
  const document = await TreeModel.remove({ _id });
  res.json(document);
});

app.get('/testTree', async (req, res) => {
  // const document = await TreeModel.updateOne({ _id: '601b4b43068e3e578cc118d7' }, { 'tree.a.b.c.0':111  });
  const document = await TreeModel.updateOne({ _id: '601b4b43068e3e578cc118d7' }, {
    $push: {
      'tree.a.b.c': { $each: [9999], $position: 0 }
    }
  });
  res.json(document);
});

// const tree = {a:{b:{id:2,c:{id:3}}},id:1}


