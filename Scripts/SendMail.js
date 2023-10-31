function onFormSubmit(e) {
  var responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1"); // Replace with the actual name of your response sheet
  var lastRow = responseSheet.getLastRow();
  var responses = responseSheet.getRange(lastRow, 1, 1, responseSheet.getLastColumn()).getValues()[0];

  var emailAddresses = ["thismail.raja@gmail.com"];
  // Fetch the HTML template content from a URL
  var templateUrl = "https://fmbmississauga.github.io/fmb/template1.html";
  var response = UrlFetchApp.fetch(templateUrl);

  if (response.getResponseCode() == 200) {
    var htmlTemplate = response.getContentText();
  } else {
    Logger.log("Failed to fetch the HTML template from the URL.");
    return;
  }


  // Sending Email
  for (var i = 0; i < emailAddresses.length; i++) {
    var emailAddress = emailAddresses[i];
    var subject = "Registration for Moula (TUS) Milaad Niyaaz Thaali";

    // Create an email message
    var message = {
      to: emailAddress,
      subject: subject,
      htmlBody: htmlTemplate
    };

    // Send the email
    GmailApp.sendEmail(message);

    // You can use GmailApp.sendEmail to send emails from your Gmail account.
    // If you want to send from another email address, you'll need to configure
    // the "Send mail as" feature in your Gmail settings.

    // If you want to send emails from another email service (not Gmail), you may need to
    // use a different method like MailApp.sendEmail and set up the SMTP details.

  }

}

