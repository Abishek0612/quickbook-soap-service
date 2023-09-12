const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs');
const soap = require('soap');
const path = require('path');

const server = http.createServer(function (req, res) {
    res.end('404: Not Found: ' + req.url);
});

const soapPort = process.env.QB_SOAP_PORT || 8000; // Port for SOAP server
const expressPort = process.env.EXPRESS_PORT || 3000; // Port for Express server

app.use(express.static('invoice'));

app.get('/invoice.csv', (req, res) => {
  const csvFilePath = path.join(__dirname, 'invoice', 'invoice.csv');
  if (fs.existsSync(csvFilePath)) {
    res.download(csvFilePath);
  } else {
    generateMissingInvoiceData((invoiceData) => {
      if (invoiceData) {
        writeInvoiceCsvFile(invoiceData, () => {
          res.download(csvFilePath);
        });
      } else {
        res.status(404).send('Invoice CSV file not found');
      }
    });
  }
});

app.get('/purchase.csv', (req, res) => {
  const csvFilePath = path.join(__dirname, 'purchase', 'purchase.csv');
  if (fs.existsSync(csvFilePath)) {
    res.download(csvFilePath);
  } else {
    generateMissingPurchaseData((purchaseData) => {
      if (purchaseData) {
        writePurchaseCsvFile(purchaseData, () => {
          res.download(csvFilePath);
        });
      } else {
        res.status(404).send('Purchase CSV file not found');
      }
    });
  }
});

const WSDL_FILENAME = '/qbws.wsdl';

function buildWsdl() {
  const wsdl = fs.readFileSync(__dirname + WSDL_FILENAME, 'utf8');
  return wsdl;
}

module.exports = Server;

function Server() {
  this.wsdl = buildWsdl();
  this.webService = require('./web-service');
}

Server.prototype.run = function () {
  const soapServer = soap.listen(server, '/wsdl', this.webService.service, this.wsdl);
  server.listen(soapPort, () => {
    console.log('Quickbooks SOAP Server listening on port ' + soapPort);
  });

  app.listen(expressPort, () => {
    console.log('Express server listening on port ' + expressPort);
  });
};

Server.prototype.setQBXMLHandler = function (qbXMLHandler) {
  this.webService.setQBXMLHandler(qbXMLHandler);
};

function generateMissingInvoiceData(callback) {
  // Code to generate missing invoice data
  const invoiceData = [
    // ... generate the invoice data
  ];
  callback(invoiceData);
}

function generateMissingPurchaseData(callback) {
  // Code to generate missing purchase data
  const purchaseData = [
    // ... generate the purchase data
  ];
  callback(purchaseData);
}

function writeInvoiceCsvFile(invoiceData, callback) {
  const invoiceCsvFilePath = path.join(invoiceDir, 'invoice.csv');
  const invoiceCsvWriter = createCsvWriter({
    path: invoiceCsvFilePath,
    header: Object.keys(invoiceData[0]).map((key) => ({ id: key, title: key })),
  });

  invoiceCsvWriter
    .writeRecords(invoiceData)
    .then(() => {
      console.log('The invoice CSV file was written successfully');
      callback();
    })
    .catch((error) => {
      console.error('Error writing invoice CSV:', error);
      callback();
    });
}

function writePurchaseCsvFile(purchaseData, callback) {
  const purchaseCsvFilePath = path.join(purchaseDir, 'purchase.csv');
  const purchaseCsvWriter = createCsvWriter({
    path: purchaseCsvFilePath,
    header: Object.keys(purchaseData[0]).map((key) => ({ id: key, title: key })),
  });

  purchaseCsvWriter
    .writeRecords(purchaseData)
    .then(() => {
      console.log('The purchase CSV file was written successfully');
      callback();
    })
    .catch((error) => {
      console.error('Error writing purchase CSV:', error);
      callback();
    });
}