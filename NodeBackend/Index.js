//Use Express and create the 'app' constant
const express = require('express');
const app = express();
const axios = require('axios');
const everything = require('./everything.js')

//Require Enviroment Variables
require('dotenv').config();

//Middleware
const cors = require('cors');
const bodyParser = require('body-parser');
app.use((req, res, next)=> {
  console.log(req.method + " " + req.url);
  next();
})
app.use('./everything', everything);

//Use Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Env port or default to 8000
const port = process.env.port || 8000;

//Receive Authorization Token
app.get('/auth', async (req, res) => {
  try {
    const accessCode = await receiveAccessCode();
    const code = accessCode.data.code;
    const tokenResponse = await receiveAccessToken(code);
    console.log(tokenResponse.data)
    res.send(tokenResponse.data)
  }
  catch (error) { 
    console.error(error);
    res.sendStatus(404)
  }

});

//Generate access code from enviroment variables
async function receiveAccessCode() {
  const accessURL = 'https://api.1up.health/user-management/v1/user/auth-code'
  const query = "app_user_id=12345&client_id="+process.env.CLIENT_ID+"&client_secret="+process.env.CLIENT_SECRET
  return axios.post(`${accessURL}?${query}`)
};

//Generate token from access code
async function receiveAccessToken(accessCode) {
  const url = `https://api.1up.health/fhir/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${accessCode}&grant_type=authorization_code`;
  return axios.post(url);
};

//Log get request to console

app.get(port, (req, res) => {
  res.console.log(res)
});

app.listen(port, () => console.log(`The Server is listening at http://localhost:${port}`))