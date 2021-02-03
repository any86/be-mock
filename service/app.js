const mongoose = require('mongoose');
const express = require('express');
const lodash = require('lodash');
const app = express();
const TreeModel = require('./model/Tree');
const URL = "mongodb://81.70.214.186:27017/bmock";
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(d => {
});
app.use(express.json())
app.listen(3000, () => {
  console.log('success')
});

app.get('/', (req, res) => {
  res.send('hello')
})


app.get('/login', (req, res) => {
  res.send('login')
})

app.get('/tree', (req, res) => {
  const { id: _id } = req.query;
  if (_id) {
    TreeModel.findOne({ _id }, (err, document) => {
      if (err) res.sendStatus(404);
      res.send(document);
    });
  } else {
    res.sendStatus(404);
  }
});

app.post('/tree', async (req, res) => {
  try {
    const document = await TreeModel.create({ tree: req.body.tree });
    res.json(document._id);
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


