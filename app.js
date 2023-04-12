const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const csvtojson = require('csvtojson');
const mongoose = require('mongoose');
const Candidate = require('./models/candidateModel');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// MongoDB Connection
mongoose.connect( 'mongodb+srv://Mayank15:ehhBE1BKPIJKpAMM@cluster0.segojsa.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('MongoDB connected');
});

// Enable CORS for all routes
app.use(cors());

// API Routes
app.post('/candidates/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const filePath = path.join(__dirname, '/uploads/', file.name);

  file.mv(filePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Convert CSV to JSON and save to database
    csvtojson()
      .fromFile(filePath)
      .then((candidates) => {
        Candidate.insertMany(candidates, (err) => {
          if (err) {
            return res.status(500).send(err);
          }

          return res.send(`${candidates.length} candidates uploaded successfully.`);
        });
      });
  });
});

app.post('/candidates/upload', (req, res) => {
  Candidate.find((err, candidates) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.json(candidates);
  });
});

// Handles any requests that don't match the ones above
app.post('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server started on port `);
});
