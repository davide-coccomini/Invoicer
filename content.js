

chrome.storage.sync.get("invoiceData", function (data) {
    var invoiceData = data["invoiceData"];
    var addRowButton = document.getElementsByName("addRow")[0];

    var rows = document.getElementsByClassName("invoice-entry");
    if(rows.length < invoiceData.length){
        addRowButton.click();
    }
    
    var datePickers = document.getElementsByClassName("date-picker hasDatepicker");
    for(var i=0; i<rows.length; i++){
        // Compile Dates
        var splittedDate = invoiceData[i]["date"].split("/");
        var day = (splittedDate[0]<10)?"0"+splittedDate[0]:splittedDate[1];
        var month = (splittedDate[1]<10)?"0"+splittedDate[1]:splittedDate[1];
        var year = "20"+splittedDate[2];
        var date = day+"/"+month+"/"+year;
        datePickers[i].value = date;


        // Set time
        rows[i].children[4].children[0].disabled = false;
        rows[i].children[4].children[0].value = invoiceData[i]["hours"]
        rows[i].children[4].children[1].disabled = false;
        rows[i].children[4].children[1].value = invoiceData[i]["minutes"]
    }
});


