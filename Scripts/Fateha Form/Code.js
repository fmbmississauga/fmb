function onFormSubmit(e) {
  var responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1"); // Replace with the actual name of your response sheet
  var lastRow = responseSheet.getLastRow();
  var questionsRange = responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn());
  var questions = questionsRange.getValues()[0];
  var responses = responseSheet.getRange(lastRow, 1, 1, responseSheet.getLastColumn()).getValues()[0];
  // var pdfBlob = createPDF(questions, responses);
  var userEmailAddress = responses[questions.length - 1];
  // Create an HTML representation of the table
  var htmlTable = "<table style='width: 100%; color: rgb(5, 107, 240); font-family: Calibri, sans-serif; border-collapse: collapse; border: 2px solid rgb(236, 142, 65);'><tbody><tr><th style='width: 50%; border: 2px solid rgb(236, 142, 65);'>Question</th><th style='width: 50%; border: 2px solid rgb(236, 142, 65);'>Response</th></tr>";

  for (var i = 0; i < questions.length; i++) {
    htmlTable += "<tr><td style='width: 50%; border: 2px solid rgb(236, 142, 65);'>" + questions[i] + "</td><td style='width: 50%; border: 2px solid rgb(236, 142, 65);'>" + responses[i] + "</td></tr>";
  }
  htmlTable += "</tbody></table>";

  sendInternalEmail(htmlTable);
  sendSubmitterEmail(userEmailAddress, htmlTable);

}


function sendInternalEmail(htmlTable) {
  // Email the PDF to a set of email addresses.
  var emailAddresses = ["fmbpayments@mississaugajamaat.com", "fmbgrocery@mississaugajamaat.com", "fmbpurchase@mississaugajamaat.com", "fmbsecretary@mississaugajamaat.com", "fmbit@mississaugajamaat.com"];
  // var emailAddresses = ["thismail.raja@gmail.com","hasanalid@gmail.com"];
  var subject = "Fateha Request Form Response PDF";
  var senderName = "FMB-Mississauga"
  var senderEmail = "fmb@mississaugjamaat.com"
  var htmlBody = "<p>Please find the attached the a New Fateha form responses.</p>";
  htmlBody += htmlTable;
  htmlBody += "<p>Shukran</p> FMB Mississauga";


  for (var i = 0; i < emailAddresses.length; i++) {
    var emailData = {
      to: emailAddresses[i],
      subject: "Thank you for Submitting the form",
      body: htmlBody,
      // name: senderName + " <" + senderEmail + ">",
      // attachments: [pdfBlob]
    };
    var htmlOutput = HtmlService.createHtmlOutput(emailData.body).getContent();
    MailApp.sendEmail(emailData.to, emailData.subject, emailData.body, { htmlBody: htmlOutput, name: "FMB-Mississauga" });

  }
}


function sendSubmitterEmail(userEmailAddress, htmlTable) {
  var emailAddresses = [userEmailAddress, "fmbit@mississaugajamaat.com"];
  // var emailAddresses = ["thismail.raja@gmail.com","hasanalid@gmail.com"];

  var folderHTML = DriveApp.getFoldersByName("HTML");
  while (folderHTML.hasNext()) {
    var folder = folderHTML.next();
  }

  // Get the HTML template file by its name within the specified folder
  var templateName = "template.html";
  var templateFile = folder.getFilesByName(templateName).next();

  // Read the HTML template file
  var htmlTemplate = templateFile.getBlob().getDataAsString();
  htmlTemplate = htmlTemplate.replace('<div id="tablePlaceholder"></div>', htmlTable);

  //Sending Email
  for (var i = 0; i < emailAddresses.length; i++) {
    var emailData = {
      to: emailAddresses[i],
      subject: "Thank you for Submitting the form",
      // body: htmlBody,
      body: htmlTemplate,
      // attachments: [pdfBlob]
    };
    var htmlOutput = HtmlService.createHtmlOutput(emailData.body).getContent();
    // MailApp.sendEmail(emailData.to, emailData.subject, emailData.body, { htmlBody: htmlOutput, attachments: emailData.attachments });
    MailApp.sendEmail(emailData.to, emailData.subject, emailData.body, { htmlBody: htmlOutput, name: "FMB-Mississauga" });
  }
}

// function createPDF(questions, responses) {
//   // Customize the PDF content as needed.
//   var pdf = DocumentApp.create("Fateha Form Response PDF");
//   var body = pdf.getBody();
//   var table = body.appendTable();
//   // Create a header row for the table
//   var headerRow = table.appendTableRow();

//   headerRow.appendTableCell("Question").setBold(true);
//   headerRow.appendTableCell("Response").setBold(true);

//   // Add questions and responses to the table
//   for (var i = 0; i < questions.length; i++) {
//     var row = table.appendTableRow();
//     row.appendTableCell(String(questions[i]));
//     row.appendTableCell(String(responses[i]));
//   }

//   pdf.saveAndClose();

//   return DriveApp.getFileById(pdf.getId()).getBlob();
// }

// To run the script manually from the Google Sheet, create a custom menu to trigger the function.
// function onOpen() {
//   var ui = SpreadsheetApp.getUi();
//   ui.createMenu('Custom Menu')
//     .addItem('Generate PDF and Email', 'generatePDFAndEmail')
//     .addToUi();
// }
