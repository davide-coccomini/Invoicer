let button = document.getElementById('button');

button.onclick = function(element) {
        var fileUpload = document.getElementById("fileUpload");
        var dateColumn = document.getElementById('dateColumn').value;
        var timeColumn = document.getElementById('timeColumn').value;
     
        if(dateColumn==timeColumn && dateColumn != ""){
            alert("Le due colonne devono essere diverse");
            return;
        }

        // Validate whether File is valid Excel file.
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
        if (regex.test(fileUpload.value.toLowerCase())) {
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
 
                // For Browsers other than IE.
                if (reader.readAsBinaryString) {
                    reader.onload = function (e) {
                        ProcessExcel(e.target.result,dateColumn,timeColumn);
                    };
                    reader.readAsBinaryString(fileUpload.files[0]);
                } else {
                    // For IE Browser.
                    reader.onload = function (e) {
                        var data = "";
                        var bytes = new Uint8Array(e.target.result);
                        for (var i = 0; i < bytes.byteLength; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }
                        ProcessExcel(data,dateColumn,timeColumn);
                    };
                    reader.readAsArrayBuffer(fileUpload.files[0]);
                }
            } else {
                alert("HTML5 non supportato dal browser");
            }
        } else {
            alert("Carica un file Excel valido");
        }
    };
let storedDiv = document.getElementById("stored");
storedDiv.onclick = function(element){
    chrome.storage.sync.remove("invoiceData", function() {
        
        var storedDiv = document.getElementById("stored");
            storedDiv.style.display = "none";
        }); 
}
function ProcessExcel(data,dateColumn,timeColumn) {
        // Accepted names for date and time
        var dateNames = ["data", "date", "giorno"]
        var timeNames = ["totale(ore)","totale (ore)", "ore", "totale orario", "tot ore", "total hours"]

        //Read the Excel File data.
        var workbook = XLSX.read(data, {
            type: 'binary'
        });
        //Fetch the name of First Sheet.
        var firstSheet = workbook.SheetNames[0];
 
        //Read all rows from First Sheet into an JSON array.
        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
 
        //Create a HTML Table element.
        var table = document.createElement("table");
        table.border = "1";
 
        //Add the header row.
        var row = table.insertRow(-1);
 
        //Add the header cells.
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = "Data";
        row.appendChild(headerCell);
 
        headerCell = document.createElement("TH");
        headerCell.innerHTML = "Ore";
        row.appendChild(headerCell);
 
        headerCell = document.createElement("TH");
        headerCell.innerHTML = "Minuti";
        row.appendChild(headerCell);
        var timeID = "";
        var dateID = "";
        
        var header = excelRows[0];
        if(dateColumn == "" || timeColumn == ""){
            jQuery.each(header, function(i, value) {
                if(dateNames.includes(value.toLowerCase())){
                    dateID = i;
                }
                if(timeNames.includes(value.toLowerCase())){
                    timeID = i;
                }
            })
        }else{
            j = 0;
            
            jQuery.each(header,function(i, value) {
                if(j == dateColumn){
                    dateID = i;
                }
                if(j == timeColumn){
                    timeID = i;
                }
                j++;
            })
        }
        invoiceData = [];
        //Add the data rows from Excel file.
        for (var i = 1; i < excelRows.length; i++) {
            var rowArray = {};
            
            //Add the data row.
            var row = table.insertRow(-1);
            var dateValue = excelRows[i][dateID];
            var timeValue = excelRows[i][timeID];
            var hours, minutes;
            if(timeValue != undefined){     
               hours = timeValue.split(":")[0];
               minutes = timeValue.split(":")[1];
            }else{
                hours = 0;
                minutes = 0;
            }
            //Add the data to the global array
            rowArray["date"] = dateValue;
            rowArray["hours"] = hours;
            rowArray["minutes"] = minutes;
            if(hours != 0 || minutes != 0)
                invoiceData.push(rowArray);

            //Add the data cells.
            var cell = row.insertCell(-1);            
            cell.innerHTML = dateValue;

            cell = row.insertCell(-1);
            cell.innerHTML = hours
 
            cell = row.insertCell(-1);
            cell.innerHTML = minutes;
        }
 
        var dvExcel = document.getElementById("dvExcel");
        dvExcel.innerHTML = "";
        dvExcel.appendChild(table);

        chrome.storage.sync.set({
            "invoiceData": invoiceData
        },function () {
            console.log("Invoice pronto per l'inserimento",invoiceData);
        })
};

chrome.storage.sync.get("invoiceData", function (data) {
    var storedDiv = document.getElementById("stored");
    if(data["invoiceData"] != undefined){
        storedDiv.style.display = "block";;
    }
})


function completeInvoice() {
    chrome.tabs.executeScript({
      file: 'content.js'
    }); 
  }
  
  document.getElementById('buttonInvoice').addEventListener('click', completeInvoice);