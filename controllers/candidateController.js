const csv = require('csvtojson');
const Candidate = require('../models/candidateModel');

exports.uploadCandidates = (req, res) => {
  // Use csvtojson to convert the uploaded file to JSON
  csv()
    .fromFile(req.file.path)
    .then((jsonObj) => {
      let candidatesToAdd = [];
      let candidatesToUpdate = [];

      // Loop through each candidate in the JSON array
      jsonObj.forEach((candidate) => {
        // Check if candidate with same email already exists in the database
        Candidate.findOne({ email: candidate.email }, (err, existingCandidate) => {
          if (err) {
            console.log(err);
            return res.status(500).send('Server Error');
          }

          // If candidate doesn't exist, add to candidatesToAdd array
          if (!existingCandidate) {
            candidatesToAdd.push(candidate);
          } else {
            // If candidate exists, add to candidatesToUpdate array
            candidatesToUpdate.push(candidate);
          }

          // If this is the last candidate, perform database operations
          if (jsonObj.indexOf(candidate) === jsonObj.length - 1) {
            // Add new candidates to database
            if (candidatesToAdd.length > 0) {
              Candidate.insertMany(candidatesToAdd, (err) => {
                if (err) {
                  console.log(err);
                  return res.status(500).send('Server Error');
                }
              });
            }

            // Update existing candidates in database
            if (candidatesToUpdate.length > 0) {
              candidatesToUpdate.forEach((candidate) => {
                Candidate.updateOne({ email: candidate.email }, candidate, (err) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).send('Server Error');
                  }
                });
              });
            }

            // Send success response
            res.send('Success');
          }
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Server Error');
    });
};
