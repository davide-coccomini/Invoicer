
chrome.storage.sync.get("invoiceData", function (data) {
    var invoiceData = data["invoiceData"];
    var addRowButton = document.getElementsByName("addRow")[0];

    var rows = document.getElementsByClassName("invoice-entry");
    if(rows.length < invoiceData.length){
        addRowButton.click();
    }
    
    var datePickers = document.getElementsByClassName("date-picker hasDatepicker");
    var j = 0;
    for(var i=0; i<invoiceData.length; i++){

        console.log("i",i);
        console.log("j",j);
        // Set project
        var selectName = '#selected-project-'+i;
        var select = document.querySelector(selectName);
        if(select == undefined){
            continue;
        }
        var optionToClick = select.children[1]; 
        optionToClick.selected = true;

        optionToClick.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true}));
        optionToClick.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
        optionToClick.dispatchEvent(new PointerEvent('pointerup', {bubbles: true}));
        optionToClick.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
        optionToClick.dispatchEvent(new MouseEvent('mouseout', {bubbles: true}));
        optionToClick.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        optionToClick.dispatchEvent(new Event('change', {bubbles: true}));


        // Compile Dates
        var splittedDate = invoiceData[j]["date"].split("/");
        var day = (splittedDate[0]<10)?"0"+splittedDate[0]:splittedDate[1];
        var month = (splittedDate[1]<10)?"0"+splittedDate[1]:splittedDate[1];
        var year = "20"+splittedDate[2];
        var date = day+"/"+month+"/"+year;
        datePickers[j].value = date;


        // Set time
        rows[i].children[4].children[0].disabled = false;
        rows[i].children[4].children[0].value = invoiceData[j]["hours"]
        rows[i].children[4].children[1].disabled = false;
        rows[i].children[4].children[1].value = invoiceData[j]["minutes"].replace(/^0+/, '');
        j++;
    }
});


