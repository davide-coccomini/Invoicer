for(var i=1; i<=rows.length; i++){
    console.log("start for ", i)
    var cal = document.getElementsByClassName("invoice-entry alt")[i].children[0].children[1]
    cal.focus();
    openPicker(cal);

    var datePicker = document.getElementsByClassName("ui-datepicker-calendar")[0]

    var date = invoiceData[i-1]["date"].split("/");
    var day = date[0];

    
    console.log("get first row")
    var firstRow = datePicker.children[1].children[0];
    var j = 0;
    for(; j <= 10; j++){
        
    console.log("get children of first row ")
        if(!firstRow.children[j].className.includes("disabled")){
            break;
        }
    }
    var offset = 7 - j;
    var r = (day <= offset)?0:(day > offset && day <= offset + 7)?1:(day > offset + 7 && day <= offset + 14)?2:(day > offset + 14 && day <= offset + 21)?3:4;

    
    if(r == 0){
        c = day + (offset - 1);
    }else{
        c = (day - 1) - ((7*r) - offset) 
    }
    
    console.log("end for ")
    datePicker.children[1].children[r].children[c].click()
    
    
}
function openPicker(inputDateElem) {
    var ev = document.createEvent('KeyboardEvent');
    ev.initKeyboardEvent('keydown', true, true, document.defaultView, 'F4', 0);
    inputDateElem.dispatchEvent(ev);
}
