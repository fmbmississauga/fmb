var emailpdfBlob;
function onFormSubmit(e) {
    combineImagesIntoPDF(function () {
        var responseSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1"); // Replace with the actual name of your response sheet
        var lastRow = responseSheet.getLastRow();
        var questionsRange = responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn());
        var questions = questionsRange.getValues()[0];
        var responses = responseSheet.getRange(lastRow, 1, 1, responseSheet.getLastColumn()).getValues()[0];
        // Create an HTML representation of the table
        var htmlTable = "<table style='width: 100%; color: rgb(5, 107, 240); font-family: Calibri, sans-serif; border-collapse: collapse; border: 2px solid rgb(236, 142, 65);'><tbody><tr><th style='width: 50%; border: 2px solid rgb(236, 142, 65);'>Question</th><th style='width: 50%; border: 2px solid rgb(236, 142, 65);'>Response</th></tr>";
        for (var i = 0; i < questions.length; i++) {
            switch (responses[i]) {
                case "Munira Ezzi":
                    responseSheet.getRange(lastRow, 13).setValue("Moonz Catering Inc.");
                    break;
                case "Nasim Kaiser":
                    responseSheet.getRange(lastRow, 13).setValue("Nasim Kaiser");
                    break;
                case "Tasneem Palida":
                    responseSheet.getRange(lastRow, 13).setValue("Mohammed Hussain");
                    break;
                case "Insiya Motiwala":
                    responseSheet.getRange(lastRow, 13).setValue("Insiyah Motiwala");
                    break;
                case "Lubainah Vasi":
                    responseSheet.getRange(lastRow, 13).setValue("Lubeinah Vasi");
                    break;
                case "Other":
                    if (responseSheet.getRange(lastRow, 13).getValue() == "") {
                        responseSheet.getRange(lastRow, 13).setValue(responseSheet.getRange(lastRow, 8).getValue());
                    }
                    break;
                // Add more cases as needed
                default:
                    // Handle other cases if needed
                    break;
            }
            htmlTable += "<tr><td style='width: 50%; border: 2px solid rgb(236, 142, 65);'>" + questions[i] + "</td><td style='width: 50%; border: 2px solid rgb(236, 142, 65);'>" + responses[i] + "</td></tr>";
        }
        htmlTable += "</tbody></table>";
        sendInternalEmail(htmlTable);
    });
}
function sendInternalEmail(htmlTable) {
    var emailAddresses = ["fmbpayments@mississaugajamaat.com", "fmbsecretary@mississaugajamaat.com", "fmbit@mississaugajamaat.com"];
    // var emailAddresses = ["fmbit@mississaugajamaat.com"];
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
async function combineImagesIntoPDF(callback) {
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
        try {
            const pdfBlob = await createPDFFromFormImages(images, data[0]);
            console.log(pdfBlob);
            emailpdfBlob = pdfBlob;
            var pdfFile = folder.createFile(pdfBlob);
            // Get the URL of the newly created PDF file and update the sheet
            var pdfUrl = pdfFile.getUrl();
            responseSheet.getRange(lastRow, 14).setValue(pdfUrl); // Adjust the column as needed
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }
    callback();
}
async function createPDFFromFormImages(images, fileprefix) {
    var pdfBlobArray = [];
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
        var mimeType = imageBlob.getContentType();
        // console.log(mimeType);
        if (mimeType.indexOf('image') !== -1) {
            // Add the image to the page
            var image = body.appendImage(imageBlob);
            image.setWidth(pageWidth - leftMargin - rightMargin);
            image.setHeight(pageHeight - topMargin - bottomMargin);
        } else if (mimeType === 'application/pdf') {
            // Add individual PDFs to the PDF blob array
            pdfBlobArray.push(imageBlob);
        }
    }
    // Save and close the document
    document.saveAndClose();

    // Convert the document to PDF
    pdfBlobArray.push(DriveApp.getFileById(document.getId()).getBlob());
    // Delete the temporary document
    DriveApp.getFileById(document.getId()).setTrashed(true);
    // Merge PDFs asynchronously and wait for the result
    try {
        const pdfBlob = await PDFApp.mergePDFs(pdfBlobArray);
        // console.log(pdfBlob); // This will log the merged PDF blob
        return pdfBlob; // Return the merged PDF blob
    } catch (error) {
        console.error('Error occurred during merging:', error);
        return null; // Return null or handle the error as needed
    }
}