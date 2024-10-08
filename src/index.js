/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright IBM Corporation 2020
*/

const express = require('express');
const http = require('http');
const https = require('https');
const cors = require('cors');

// Build config from params
const config = require('./config');
const { https: { key, cert }, port, isHttps, serviceName } = config;
const credentials = { key, cert };

// Setup app & its routes
const app = express();
app.use(cors());

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Import routes
const routes = require('./routes/index.route');
app.use(routes);

// Start HTTP server
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`[${serviceName}] HTTP server listening at port ${port}`);
});

// Start HTTPS server
if (isHttps) {
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port + 1, () => {
    console.log(`[${serviceName}] HTTPS server listening at port ${port + 1}`);
  });
}

module.exports = { app };
