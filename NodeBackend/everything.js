//Use Express and create the 'app' constant
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get request for Patient IDs
router.get('/patients', function (req, res) {
  res.send({patients});
})

// $everything implementation from documentation 
router.get('/patients/:patientid/everything', async function (req, res) {
  const everythingEndpoint = "https://api.1up.health/fhir/dstu2/Patient/" + req.params.PATIENT_ID + "/$everything";
  const accessToken = req.query.access_token;
  if (!accessToken) {
    res.sendStatus(403);
  }

  axios.get(everythingEndpoint, {
    headers: {
      "Authorization": "Bearer " + accessToken
    }
  })
    .then(res.console.log(res))
    .catch(error => {
      console.log(error)
      res.sendStatus(404)
    })
});

module.exports = router;