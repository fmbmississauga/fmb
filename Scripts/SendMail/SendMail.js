function onFormSubmit(e) {
  var responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1"); // Replace with the actual name of your response sheet
  var lastRow = responseSheet.getLastRow();
  var responses = responseSheet.getRange(lastRow, 1, 1, responseSheet.getLastColumn()).getValues()[0];

  // var emailAddresses = ["thismail.raja@gmail.com"];
  // var emailAddresses = ["thismail.raja@gmail.com", "hasanalid@gmail.com", "fmbsecretary@mississaugajamaat.com"];
  var emailAddresses = ["fmb-r@googlegroups.com", "fmb-nr@googlegroups.com"];

  // Fetch the HTML template content from a URL
  Logger.log(responses[2]);
  var templateUrl = responses[2];
  var response = UrlFetchApp.fetch(templateUrl);

  if (response.getResponseCode() == 200) {
    var htmlTemplate = response.getContentText();
  } else {
    Logger.log("Failed to fetch the HTML template from the URL.");
    return;
  }

  //Sending Email
  for (var i = 0; i < emailAddresses.length; i++) {
    var emailData = {
      to: emailAddresses[i],
      subject: "Registration for Moula (TUS) Milaad Niyaaz Thaali",
      body: htmlTemplate,
    };
    var htmlOutput = HtmlService.createHtmlOutput(emailData.body).getContent();
    MailApp.sendEmail(emailData.to, emailData.subject, emailData.body, {
      htmlBody: htmlOutput, name: "FMB Mississauga",
    });
  }
}

