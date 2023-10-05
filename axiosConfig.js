const axios = require('axios');
require('dotenv').config();

axios.defaults.baseURL = process.env.API || "http://localhost:3002";

module.exports = axios;