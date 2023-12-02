function doGet(request) {
    try {
        var sheetname = "Form Responses 1";
        var doc = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("id"));
        var sheet = doc.getSheetByName(sheetname);

        if (!sheet) {
            throw new Error("Sheet not found");
        }

        var identifier = request.parameter.identifier; // Assuming identifier is provided as the datetime string

        if (!identifier) {
            throw new Error("Identifier parameter missing");
        }

        var data = sheet.getDataRange().getValues();

        for (var i = 1; i < data.length; i++) {
            var row = data[i];
            var cellValue = row[0]; // Assuming the datetime is in the first column (index 0)

            // Assuming the datetime format in the sheet is MM/DD/YYYY HH:mm:ss
            var formattedCellValue = Utilities.formatDate(cellValue, Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm:ss');

            if (formattedCellValue === identifier) {
                var rowNum = i + 1;
                var status = request.parameter.status;

                if (!status) {
                    throw new Error("Status parameter missing");
                }

                sheet.getRange(rowNum, 11).setValue(status === "Approved" ? "Approved" : "Denied");

                var response = {
                    success: true,
                    message: "Status updated successfully"
                };
                return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
            }
        }

        var notFoundResponse = {
            success: false,
            message: "Identifier not found"
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


function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    PropertiesService.getScriptProperties().setProperty("id", doc.getId());
}