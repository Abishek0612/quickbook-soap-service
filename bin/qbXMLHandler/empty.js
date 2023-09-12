// var data2xml = require("data2xml");
// var fs = require("fs");
// var xml2js = require("xml2js");
// const createCsvWriter = require("csv-writer").createObjectCsvWriter;
// const path = require("path");
// // Require AWS SDK clients
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// const invoiceDir = path.join(__dirname, "invoice");
// const purchaseDir = path.join(__dirname, "purchase");

// fs.mkdirSync(invoiceDir, { recursive: true }); // Create the invoice directory if it doesn't exist
// fs.mkdirSync(purchaseDir, { recursive: true }); // Create the purchase directory if it doesn't exist

// const invoiceCsvFilePath = path.join(invoiceDir, "invoice.csv");
// const purchaseCsvFilePath = path.join(purchaseDir, "purchase.csv");


// const AWS = require('aws-sdk');

// AWS.config.logger = console;

// // Configure S3 client
// const s3 = new S3Client({
//   region: "ap-south-1",
//   credentials: {
//     accessKeyId: "AKIAUC6GCDFMFITZCQ2V",
//     secretAccessKey: "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",
//   },
// });

// // S3 bucket name
// const bucketName = "purchasebucketcsv";

// // Function to upload CSV file to S3
// async function uploadToS3(fileName, fileData) {
//   try {
//     // Set S3 parameters
//     const params = {
//       Bucket: bucketName,
//       Key: fileName,
//       Body: fileData,
//     };

//     // Create S3 upload command
//     const command = new PutObjectCommand(params);

//     const response = await s3.send(command);
//     console.log("Upload response:", response);

//     if (response.$metadata.httpStatusCode === 200) {
//       console.log("Upload successful!");
//     } else {
//       console.log("Upload failed with response:", response);
//     }
//   } catch (error) {
//     console.error("Error uploading to S3:", error);
//   }
// }

// // In convertXmlToCsv function

// function convertXmlToCsv(xmlData) {
//   xml2js.parseString(xmlData, async (err, result) => {
//     if (err) {
//       console.error("Error parsing XML:", err);
//       return;
//     }

//     // Extract data from the parsed result and populate the 'data' arrays
//     var invoiceData = extractInvoiceDataFromXml(result);
//     var purchaseData = extractPurchaseDataFromXml(result);

//     // Create CSV Writers instances
//     const invoiceCsvWriter = createCsvWriter({
//       path: invoiceCsvFilePath,
//       header: Object.keys(invoiceData[0]).map((key) => ({
//         id: key,
//         title: key,
//       })),
//     });

//     const purchaseCsvWriter = createCsvWriter({
//       path: purchaseCsvFilePath,
//       header: Object.keys(purchaseData[0]).map((key) => ({
//         id: key,
//         title: key,
//       })),
//     });

//     // Write CSV data to the files
//     try {
//       await invoiceCsvWriter.writeRecords(invoiceData);
//       console.log("The invoice CSV file was written successfully");
//       const invoiceCsv = fs.readFileSync(invoiceCsvFilePath);
//       await uploadToS3("invoice.csv", invoiceCsv);
//     } catch (error) {
//       console.error("Error writing/uploading invoice CSV:", error);
//     }

//     try {
//       await purchaseCsvWriter.writeRecords(purchaseData);
//       console.log("The purchase CSV file was written successfully");
//       const purchaseCsv = fs.readFileSync(purchaseCsvFilePath);
//       await uploadToS3("purchase.csv", purchaseCsv);
//     } catch (error) {
//       console.error("Error writing/uploading purchase CSV:", error);
//     }
//   });
// }

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
//   console.log("convertXmlToCsv function called with data:", xmlData);
//   xml2js.parseString(xmlData, (err, result) => {
//     if (err) {
//       console.error("Error parsing XML:", err);
//       return;
//     }

//     // Extract data from the parsed result and populate the 'data' arrays
//     var invoiceData = extractInvoiceDataFromXml(result);
//     var purchaseData = extractPurchaseDataFromXml(result);

//     // Create CSV Writers instances
//     const invoiceCsvWriter = createCsvWriter({
//       path: invoiceCsvFilePath,
//       header: Object.keys(invoiceData[0]).map((key) => ({
//         id: key,
//         title: key,
//       })),
//     });

//     const purchaseCsvWriter = createCsvWriter({
//       path: purchaseCsvFilePath,
//       header: Object.keys(purchaseData[0]).map((key) => ({
//         id: key,
//         title: key,
//       })),
//     });

//     // Write CSV data to the files
//     invoiceCsvWriter
//       .writeRecords(invoiceData)
//       .then(() => {
//         console.log("The invoice CSV file was written successfully");
//         console.log("Data to be written to invoice CSV:", invoiceData);
//         console.log("Invoice CSV Writer created", invoiceCsvWriter);
//         console.log("Invoice CSV File Path:", invoiceCsvFilePath);
//         console.log(
//           "Invoice CSV Download Link: http://localhost:3000/invoice.csv"
//         );
//         const invoiceCsv = fs.readFileSync(invoiceCsvFilePath);
//         uploadToS3("invoice.csv", invoiceCsv);
//       })
//       .catch((error) => {
//         console.error("Error writing invoice CSV:", error);
//       });

//     purchaseCsvWriter
//       .writeRecords(purchaseData)
//       .then(() => {
//         console.log("The purchase CSV file was written successfully");
//         console.log("Data to be written to purchase CSV:", purchaseData);
//         console.log("Purchase CSV Writer created", purchaseCsvWriter);
//         console.log("Purchase CSV File Path:", purchaseCsvFilePath);
//         console.log(
//           "Purchase CSV Download Link: http://localhost:3000/purchase.csv"
//         );
//         const purchaseCsv = fs.readFileSync(purchaseCsvFilePath);
//         uploadToS3("purchase.csv", purchaseCsv);
//       })
//       .catch((error) => {
//         console.error("Error writing purchase CSV:", error);
//       });
//   });
// }

// function extractInvoiceDataFromXml(xmlResult) {
//   const qbxmlMsgsRs = xmlResult.QBXML.QBXMLMsgsRs[0];
//   const invoiceQueryRs = qbxmlMsgsRs.InvoiceQueryRs[0];

//   if (!invoiceQueryRs.InvoiceRet) {
//     console.log("No InvoiceRet in InvoiceQueryRs");
//     return [];
//   }

//   const invoices = invoiceQueryRs.InvoiceRet;

//   // Extracting specific fields from invoice data
//   const invoiceData = invoices.map((invoice) => ({
//     termsRefListID:
//       invoice.TermsRef && invoice.TermsRef[0].ListID
//         ? invoice.TermsRef[0].ListID[0]
//         : null,
//     termsRefFullName:
//       invoice.TermsRef && invoice.TermsRef[0].FullName
//         ? invoice.TermsRef[0].FullName[0]
//         : null,
//     itemSalesTaxRefListID:
//       invoice.ItemSalesTaxRef && invoice.ItemSalesTaxRef[0].ListID
//         ? invoice.ItemSalesTaxRef[0].ListID[0]
//         : null,
//     itemSalesTaxRefFullName:
//       invoice.ItemSalesTaxRef && invoice.ItemSalesTaxRef[0].FullName
//         ? invoice.ItemSalesTaxRef[0].FullName[0]
//         : null,
//     dueDate: invoice.DueDate ? invoice.DueDate[0] : null,
//     shipDate: invoice.ShipDate ? invoice.ShipDate[0] : null,
//     subtotal: invoice.Subtotal ? invoice.Subtotal[0] : null,
//   }));

//   return invoiceData;
// }

// function extractPurchaseDataFromXml(xmlResult) {
//   const qbxmlMsgsRs = xmlResult.QBXML.QBXMLMsgsRs[0];
//   const purchaseOrderQueryRs = qbxmlMsgsRs.PurchaseOrderQueryRs[0];

//   if (!purchaseOrderQueryRs.PurchaseOrderRet) {
//     console.log("No PurchaseOrderRet in PurchaseOrderQueryRs");
//     return [];
//   }

//   const purchaseOrders = purchaseOrderQueryRs.PurchaseOrderRet;

//   // Extracting specific fields from purchase order data
//   const purchaseData = purchaseOrders.map((purchaseOrder) => {
//     const vendorAddressBlock =
//       purchaseOrder.VendorAddressBlock && purchaseOrder.VendorAddressBlock[0];
//     const shipAddress =
//       purchaseOrder.ShipAddress && purchaseOrder.ShipAddress[0];
//     const shipAddressBlock =
//       purchaseOrder.ShipAddressBlock && purchaseOrder.ShipAddressBlock[0];
//     const fullName =
//       purchaseOrder.VendorRef && purchaseOrder.VendorRef[0].FullName
//         ? purchaseOrder.VendorRef[0].FullName[0]
//         : null;

//     return {
//       fullName: fullName,
//       vendorAddr1:
//         vendorAddressBlock && vendorAddressBlock.Addr1
//           ? vendorAddressBlock.Addr1[0]
//           : null,
//       vendorAddr2:
//         vendorAddressBlock && vendorAddressBlock.Addr2
//           ? vendorAddressBlock.Addr2[0]
//           : null,
//       vendorAddr3:
//         vendorAddressBlock && vendorAddressBlock.Addr3
//           ? vendorAddressBlock.Addr3[0]
//           : null,
//       shipAddr1: shipAddress && shipAddress.Addr1 ? shipAddress.Addr1[0] : null,
//       shipAddr2: shipAddress && shipAddress.Addr2 ? shipAddress.Addr2[0] : null,
//       shipCity: shipAddress && shipAddress.City ? shipAddress.City[0] : null,
//       shipState: shipAddress && shipAddress.State ? shipAddress.State[0] : null,
//       shipPostalCode:
//         shipAddress && shipAddress.PostalCode
//           ? shipAddress.PostalCode[0]
//           : null,
//       shipAddrBlock1:
//         shipAddressBlock && shipAddressBlock.Addr1
//           ? shipAddressBlock.Addr1[0]
//           : null,
//       shipAddrBlock2:
//         shipAddressBlock && shipAddressBlock.Addr2
//           ? shipAddressBlock.Addr2[0]
//           : null,
//       shipAddrBlock3:
//         shipAddressBlock && shipAddressBlock.Addr3
//           ? shipAddressBlock.Addr3[0]
//           : null,
//       dueDate: purchaseOrder.DueDate ? purchaseOrder.DueDate[0] : null,
//       expectedDate: purchaseOrder.ExpectedDate
//         ? purchaseOrder.ExpectedDate[0]
//         : null,
//       totalAmount: purchaseOrder.TotalAmount
//         ? purchaseOrder.TotalAmount[0]
//         : null,
//       isManuallyClosed: purchaseOrder.IsManuallyClosed
//         ? purchaseOrder.IsManuallyClosed[0]
//         : null,
//       isFullyReceived: purchaseOrder.IsFullyReceived
//         ? purchaseOrder.IsFullyReceived[0]
//         : null,
//       isToBePrinted: purchaseOrder.IsToBePrinted
//         ? purchaseOrder.IsToBePrinted[0]
//         : null,
//       isToBeEmailed: purchaseOrder.IsToBeEmailed
//         ? purchaseOrder.IsToBeEmailed[0]
//         : null,
//     };
//   });

//   return purchaseData;
// }

// function buildRequests(callback) {
//   var requests = [];

//   var xml = convert("QBXML", {
//     QBXMLMsgsRq: {
//       _attr: { onError: "stopOnError" },
//       InvoiceQueryRq: {},
//       PurchaseOrderQueryRq: {},
//     },
//   });
//   requests.push(xml);

//   return callback(null, requests);
// }
