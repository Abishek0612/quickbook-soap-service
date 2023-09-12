// this is index.js                                                                                    var data2xml = require("data2xml");
// var fs = require("fs");
// var xml2js = require("xml2js");
// const createCsvWriter = require("csv-writer").createObjectCsvWriter;
// const path = require('path');
// const invoiceDir = path.join(__dirname, "invoice");
// fs.mkdirSync(invoiceDir, { recursive: true }); // Create the directory if it doesn't exist
// const csvFilePath = path.resolve(__dirname, "invoice.csv");


// var convert = data2xml({
//   xmlHeader:
//     '<?xml version="1.0" encoding="utf-8"?>\n<?qbxml version="13.0"?>\n',
// });



// module.exports = {
//   fetchRequests: function (callback) {
//     buildRequests(callback);
//   },

//   handleResponse: function (response) {
//     console.log(response);

//     convertXmlToCsv(response);
//   },

//   didReceiveError: function (error) {
//     console.log(error);
//   },
// };

// function convertXmlToCsv(xmlData) {
//   xml2js.parseString(xmlData, (err, result) => {
//     if (err) {
//       console.error("Error parsing XML:", err);
//       return;
//     }

//     // Extract data from the parsed result and populate the 'data' array
//     var data = extractDataFromXml(result);

//     // Create CSV Writer instance
//     const csvWriter = createCsvWriter({
//       path: path.join(invoiceDir, "invoice.csv"),
//       header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
//     });

//     // Write CSV data to the file
//     csvWriter
//     .writeRecords(data)
    
//     .then(() => {
//       console.log('The CSV file was written successfully');
//       console.log("Data to be written to CSV:", data);
//         console.log("CSV Writer created", csvWriter);
//         const invoicePath = path.join(__dirname, 'invoice.csv');
//         console.log("CSV File Path:", invoicePath);


//         console.log("CSV File Path:", __dirname + "/invoice.csv");

//         // After writing CSV, provide a link to download the file
//         console.log("CSV Download Link: http://localhost:3000/invoice.csv");
//       })
//       .catch((error) => {
//         console.error("Error writing CSV:", error);
//       });
//   });
// }



// function extractDataFromXml(xmlResult) {
//   const qbxmlMsgsRs = xmlResult.QBXML.QBXMLMsgsRs[0];

//   // Empty array to hold the invoice data
//   const data = [];

//   const invoiceQueryRs = qbxmlMsgsRs.InvoiceQueryRs[0];

//   if (!invoiceQueryRs.InvoiceRet) {
//     console.log('No InvoiceRet in InvoiceQueryRs');
//     return data;
//   }

//   const invoices = invoiceQueryRs.InvoiceRet;

//   for (let invoice of invoices) {
//     // Extracting some specific fields (replace these with the fields you're interested in)
//     const termsRefListID = invoice.TermsRef && invoice.TermsRef[0].ListID ? invoice.TermsRef[0].ListID[0] : null;
//     const termsRefFullName = invoice.TermsRef && invoice.TermsRef[0].FullName ? invoice.TermsRef[0].FullName[0] : null;
//     const itemSalesTaxRefListID = invoice.ItemSalesTaxRef && invoice.ItemSalesTaxRef[0].ListID ? invoice.ItemSalesTaxRef[0].ListID[0] : null;
//     const itemSalesTaxRefFullName = invoice.ItemSalesTaxRef && invoice.ItemSalesTaxRef[0].FullName ? invoice.ItemSalesTaxRef[0].FullName[0] : null;
//     const dueDate = invoice.DueDate ? invoice.DueDate[0] : null;
//     const shipDate = invoice.ShipDate ? invoice.ShipDate[0] : null;
//     const subtotal = invoice.Subtotal ? invoice.Subtotal[0] : null;

//     // Add the extracted data to the 'data' array
//     data.push({
//       termsRefListID,
//       termsRefFullName,
//       itemSalesTaxRefListID,
//       itemSalesTaxRefFullName,
//       dueDate,
//       shipDate,
//       subtotal
//     });
//   }

//   return data;
// }


// function buildRequests(callback) {
//   var requests = [];
//   // var requests = [];

//   // var today = new Date();
//   // var fiveDaysAgo = new Date();
//   // fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

//   // var fromDate = formatDate(fiveDaysAgo);
//   // var toDate = formatDate(today);
//   //job->[JobTypeQueryRq],SalesOrder->[SalesOrderQueryRq],Invoice-> [InvoiceQueryRq],Item ->[ItemQueryRq] ,PurchaseOrder[PurchaseOrderQueryRq]
//   var xml = convert("QBXML", {
//     QBXMLMsgsRq: {
//       _attr: { onError: "stopOnError" },
//       // ItemQueryRq: {
//       InvoiceQueryRq: {
//         // MaxReturned: 1000,
//         ModifiedDateRangeFilter: {
//           // FromModifiedDate: "2024-12-15T20:22:03+05:30"
//         },
//         // FromModifiedDate: "2024-12-15 T20:22:03+05:30",  // fromDate
//         // ToModifiedDate: "2024-12-15T14:04:46+05:30"    //toDate
//         // Invoive->2023-12-16T10:34:13+05:30
//         // TimeCreated: "2024-12-15T14:04:46+05:30",
//       },
//     },
//   });
//   requests.push(xml);

//   return callback(null, requests);
// }


// this is server.js                                                                                     var http = require('http');
// const express = require('express');
// const app = express();
// var colors = require('colors');
// var fs = require('fs');
// var soap = require('soap');
// const path = require('path');
// var server = http.createServer(function (req, res) {
//     res.end('404: Not Found: ' + req.url);
// });
// var soapPort = process.env.QB_SOAP_PORT || 8000; // Port for SOAP server
// var expressPort = process.env.EXPRESS_PORT || 3000; // Port for Express server

// app.use(express.static('invoice'));

// app.get('/invoice.csv', (req, res) => {
//   setTimeout(() => {
//       const csvFilePath = path.join(__dirname, 'invoice', 'invoice.csv');
//       if (fs.existsSync(csvFilePath)) {
//           res.download(csvFilePath);
//       } else {
//           res.status(404).send('File not found');
//       }
//   }, 1000);  
// });

// var WSDL_FILENAME = '/qbws.wsdl';
// function buildWsdl() {
//     var wsdl = fs.readFileSync(__dirname + WSDL_FILENAME, 'utf8');
//     return wsdl;
// }

// module.exports = Server;
// function Server() {
//     this.wsdl = buildWsdl();
//     this.webService = require('./web-service');
// }

// Server.prototype.run = function () {
//     var soapServer;
//     server.listen(soapPort);
//     soapServer = soap.listen(server, '/wsdl', this.webService.service, this.wsdl);
//     console.log('Quickbooks SOAP Server listening on port '.red + soapPort);

//     app.listen(expressPort, () => {
//         console.log('Express server listening on port '.green + expressPort);
//     });
// };

// Server.prototype.setQBXMLHandler = function (qbXMLHandler) {
//     this.webService.setQBXMLHandler(qbXMLHandler);
// };                                                                                                                this is server.js                                                                                      this code is working only invoiceQueryRq data is being fetched and converted into csv. i want purchaseOrderQueryRq to be fetched and converted into csv....invoiceQueryRq   data are  termsRefListID
//     termsRefFullName
//     itemSalesTaxRefListID
//     itemSalesTaxRefFullName
//     dueDate
//     shipDate
//     subtotal                                                                                              purchaseOrderQueryRq data are FullName, . ListID, TxnDate    i want both purchaseOrder data should be extracted and stored in purchase.csv file and invoice data should be extracted and stored  in invoice.csv file seperately..... give me the complete code after modification from scratch i want the code