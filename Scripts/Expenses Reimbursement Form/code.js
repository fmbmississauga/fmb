var emailpdfBlob;
function onFormSubmit(e) {
    var responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1"); // Replace with the actual name of your response sheet
    var lastRow = responseSheet.getLastRow();
    var questionsRange = responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn());
    var questions = questionsRange.getValues()[0];
    var responses = responseSheet.getRange(lastRow, 1, 1, responseSheet.getLastColumn()).getValues()[0];
    // Create an HTML representation of the table
    var htmlTable = "<table style='width: 100%; color: rgb(5, 107, 240); font-family: Calibri, sans-serif; border-collapse: collapse; border: 2px solid rgb(236, 142, 65);'><tbody><tr><th style='width: 50%; border: 2px solid rgb(236, 142, 65);'>Question</th><th style='width: 50%; border: 2px solid rgb(236, 142, 65);'>Response</th></tr>";

    for (var i = 0; i < questions.length; i++) {
        htmlTable += "<tr><td style='width: 50%; border: 2px solid rgb(236, 142, 65);'>" + questions[i] + "</td><td style='width: 50%; border: 2px solid rgb(236, 142, 65);'>" + responses[i] + "</td></tr>";
    }
    htmlTable += "</tbody></table>";

    combineImagesIntoPDF();
    sendInternalEmail(htmlTable);
}

function sendInternalEmail(htmlTable) {
    // var emailAddresses = ["fmbpayments@mississaugajamaat.com", "fmbgrocery@mississaugajamaat.com","fmbpurchase@mississaugajamaat.com", "fmbsecretary@mississaugajamaat.com", "fmbit@mississaugajamaat.com" ];
    var emailAddresses = ["thismail.raja@gmail.com", "fmbsecretary@mississaugajamaat.com", "fmbit@mississaugajamaat.com"];
    var subject = "FMB Expenses Reimbusement Form";
    var senderName = "FMB-Mississauga"
    var senderEmail = "fmb@mississaugjamaat.com"
    var htmlBody = "<p>Salaam un Jameel</p><br><p>Please find the details of an expense submitted.</p>";
    htmlBody += htmlTable;
    htmlBody += "<p>Shukran</p> <p>FMB Mississauga</p>";

    for (var i = 0; i < emailAddresses.length; i++) {
        var emailData = {
            to: emailAddresses[i],
            subject: "A new FMB Expenses Reimbursement Form has been submitted.",
            body: htmlBody,
            // name: senderName + " <" + senderEmail + ">",
            // attachments: [pdfBlob]
        };
        var htmlOutput = HtmlService.createHtmlOutput(emailData.body).getContent();
        MailApp.sendEmail(emailData.to, emailData.subject, emailData.body, { htmlBody: htmlOutput, name: "FMB-Mississauga", attachments: [emailpdfBlob] });
    }
}

function combineImagesIntoPDF() {
    var responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
    var folderSearch = DriveApp.getFoldersByName("Expenses_Upload_Folder");
    while (folderSearch.hasNext()) {
        var folder = folderSearch.next();
    }

    var lastRow = responseSheet.getLastRow();
    var data = responseSheet.getRange(lastRow, 1, 1, responseSheet.getLastColumn()).getValues()[0];

    var imageLinks = data[11].split(',');
    if (imageLinks.length > 0) {
        var images = [];

        for (var j = 0; j < imageLinks.length; j++) {
            images.push(imageLinks[j]);
        }
        // Logger.log(images);
        // var pdfBlob = createPDF(images, data[0]);
        // var pdfBlob = createPDFWithCustomSizePages(images, data[0]);
        var pdfBlob = createPDFFromFormImages(images, data[0]);
        emailpdfBlob = pdfBlob;

        var pdfFile = folder.createFile(pdfBlob);

        // Get the URL of the newly created PDF file and update the sheet
        var pdfUrl = pdfFile.getUrl();
        responseSheet.getRange(lastRow, 13).setValue(pdfUrl); // Adjust the column as needed
    }
}

function createPDFFromFormImages(images, fileprefix) {
    // Create a new Google Doc
    var document = DocumentApp.create('Images Document');
    var body = document.getBody();

    // Set custom page width and height
    var pageWidth = 595; // Page width in points (8.27 inches)
    var pageHeight = 842; // Page height in points (11.69 inches)

    // Set custom margins (0.5 inches in this example)
    var leftMargin = 36; // 0.5 inch = 36 points
    var rightMargin = 36;
    var topMargin = 36;
    var bottomMargin = 36;

    // Set the page size and margins
    document.getBody().setMarginLeft(leftMargin);
    document.getBody().setMarginRight(rightMargin);
    document.getBody().setMarginTop(topMargin);
    document.getBody().setMarginBottom(bottomMargin);

    for (var i = 0; i < images.length; i++) {
        var imageID = images[i].replace("https://drive.google.com/open?id=", "").trim();
        var imageBlob = DriveApp.getFileById(imageID).getBlob();

        // Add the image to the page
        var image = body.appendImage(imageBlob);
        image.setWidth(pageWidth - leftMargin - rightMargin);
        image.setHeight(pageHeight - topMargin - bottomMargin);
    }

    // Save and close the document
    document.saveAndClose();

    // Convert the document to PDF
    var pdfBlob = DriveApp.getFileById(document.getId()).getAs(MimeType.PDF);
    pdfBlob.setName('ImagesPDF ' + fileprefix + '.pdf');

    // Delete the temporary document
    DriveApp.getFileById(document.getId()).setTrashed(true);

    return pdfBlob;
}
