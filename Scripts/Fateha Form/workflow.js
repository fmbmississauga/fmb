function doGet(request) {
    try {
        var sheetname = "Form Responses 5";
        var doc = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("id"));
        var sheet = doc.getSheetByName(sheetname);

        if (!sheet) {
            throw new Error("Sheet not found");
        }

        var identifier = request.parameter.identifier;

        if (!identifier) {
            throw new Error("Identifier parameter missing");
        }

        var data = sheet.getDataRange().getValues();
        var headerCol = data[0];
        var row;
        var status = request.parameter.status;
        for (var i = 1; i < data.length; i++) {
            row = data[i];
            var cellValue = row[0];    // Assuming the datetime format in the sheet is MM/DD/YYYY HH:mm:ss
            var simpleDate = convertToSimpleDateFormat(cellValue);
            Logger.log(simpleDate); // This will log "12/1/2023"

            if (simpleDate == identifier) {
                var rowNum = i + 1;

                sheet.getRange(rowNum, 12).setValue(status === "Approved" ? "Approved" : "Denied");
                // Create an HTML representation of the table
                var htmlTable = "<table style='width: 100%; color: rgb(5, 107, 240); font-family: Calibri, sans-serif; border-collapse: collapse; border: 2px solid rgb(236, 142, 65);'><tbody><tr><th style='width: 50%; border: 2px solid rgb(236, 142, 65);'>Question</th><th style='width: 50%; border: 2px solid rgb(236, 142, 65);'>Response</th></tr>";

                for (var i = 0; i < row.length - 1; i++) {
                    htmlTable += "<tr><td style='width: 50%; border: 2px solid rgb(236, 142, 65);'>" + headerCol[i] + "</td><td style='width: 50%; border: 2px solid rgb(236, 142, 65);'>" + row[i] + "</td></tr>";
                }
                htmlTable += "</tbody></table>";

                if (status == "Approved") {
                    sendSubmitterEmail(row[1], htmlTable, "template_fateha_approval.html")
                }

                var response = {
                    success: true,
                    message: "Status updated successfully"
                };
                return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
            }


        }


        var notFoundResponse = {
            success: false,
            message: identifier + "|" + simpleDate + "Identifier not found"
        };
        return ContentService.createTextOutput(JSON.stringify(notFoundResponse)).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        var errorResponse = {
            success: false,
            message: "Error: " + error.message
        };
        return ContentService.createTextOutput(JSON.stringify(errorResponse)).setMimeType(ContentService.MimeType.JSON);
    }
}

function convertToSimpleDateFormat(dateString) {
    var date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
    }

    var month = (date.getMonth() + 1).toString(); // Months are zero-based
    var day = date.getDate().toString();
    var year = date.getFullYear();

    var formattedDate = month + '/' + day + '/' + year;

    return formattedDate;
}

function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    PropertiesService.getScriptProperties().setProperty("id", doc.getId());
}