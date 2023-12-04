function onFormSubmit(e) {
  var responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 5"); // Replace with the actual name of your response sheet
  var lastRow = responseSheet.getLastRow();
  var questionsRange = responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn());
  var questions = questionsRange.getValues()[0];
  var responses = responseSheet.getRange(lastRow, 1, 1, responseSheet.getLastColumn()).getValues()[0];
  // var pdfBlob = createPDF(questions, responses);
  var userEmailAddress = responses[1];
  // Create an HTML representation of the table
  var htmlTable = "<table style='width: 100%; color: rgb(5, 107, 240); font-family: Calibri, sans-serif; border-collapse: collapse; border: 2px solid rgb(236, 142, 65);'><tbody><tr><th style='width: 50%; border: 2px solid rgb(236, 142, 65);'>Question</th><th style='width: 50%; border: 2px solid rgb(236, 142, 65);'>Response</th></tr>";

  for (var i = 0; i < questions.length; i++) {
    htmlTable += "<tr><td style='width: 50%; border: 2px solid rgb(236, 142, 65);'>" + questions[i] + "</td><td style='width: 50%; border: 2px solid rgb(236, 142, 65);'>" + responses[i] + "</td></tr>";
  }
  htmlTable += "</tbody></table>";
  var emailAddresses = ["fmbit@mississaugajamaat.com", "thismail.raja@gmail.com"];
  sendInternalEmail(emailAddresses, htmlTable, responses);
  // sendSubmitterEmail(userEmailAddress, htmlTable, "template.html");

}


function sendInternalEmail(emailAddresses, htmlTable, responses) {
  // Email the PDF to a set of email addresses.
  // var emailAddresses = ["fmbaccounts@mississaugajamaat.com", "fmbgrocery@mississaugajamaat.com","fmbpurchase@mississaugajamaat.com", "fmbsecretary@mississaugajamaat.com", "fmbit@mississaugajamaat.com" ];
  var subject = "Fateha Request Form Response PDF";
  var senderName = "FMB-Mississauga"
  var senderEmail = "fmb@mississaugjamaat.com"
  var apiUrl = "https://script.google.com/a/macros/mississaugajamaat.com/s/AKfycbzfDIHMXITk2M3HpKsMSQ22d8N2_ztPjRHTjX7tyk4/dev"

  for (var i = 0; i < emailAddresses.length; i++) {
    var htmlBody = "";
    htmlBody = "<p>Please find the attached the a New Fateha form responses.</p>";
    htmlBody += htmlTable;
    if (emailAddresses[i] == "fmbit@mississaugajamaat.com") {
      htmlBody += "<a href='" + apiUrl + "?identifier=" + convertToSimpleDateFormat(responses[0]) + "&status=Approved' style='text-decoration: none;'><button style='background-color: #008CBA; border: none; color: white; padding: 10px 20px; text-align: center; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;'>Approve</button></a>";
      htmlBody += "<a href='" + apiUrl + "?identifier=" + convertToSimpleDateFormat(responses[0]) + "&status=Denied' style='text-decoration: none;'><button style='background-color: #f44336; border: none; color: white; padding: 10px 20px; text-align: center; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;'>Deny</button></a>";
    }
    htmlBody += "<p>Shukran</p> FMB Mississauga";
    var emailData = {
      to: emailAddresses[i],
      subject: "New Fateha form responses: " + responses[0],
      body: htmlBody,
      // name: senderName + " <" + senderEmail + ">",
      // attachments: [pdfBlob]
    };
    var htmlOutput = HtmlService.createHtmlOutput(emailData.body).getContent();
    MailApp.sendEmail(emailData.to, emailData.subject, emailData.body, { htmlBody: htmlOutput, name: "FMB-Mississauga" });

  }
}


function sendSubmitterEmail(userEmailAddress, htmlTable, template) {
  var emailAddresses = [userEmailAddress, "fmbit@mississaugajamaat.com"];
  // var emailAddresses = ["thismail.raja@gmail.com","hasanalid@gmail.com"];

  var folderHTML = DriveApp.getFoldersByName("HTML");
  while (folderHTML.hasNext()) {
    var folder = folderHTML.next();
  }

  // Get the HTML template file by its name within the specified folder
  var templateName = template;
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
