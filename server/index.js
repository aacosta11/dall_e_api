// environment variable config
require('dotenv').config();

// imports
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// middleware
app.use(express.json(), express.urlencoded({extended:true}));
app.use(cors());

// api routes
require("./api")(app);

// start server
app.listen(PORT, () => console.log(`listening on port ${PORT}`));