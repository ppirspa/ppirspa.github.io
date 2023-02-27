var hhInputValue = {}

function ResetHHInput(){
    var today = new Date()
    Elem("hh-input-bulan").value = today.getMonth() + 1
    Elem("hh-input-tahun").value = today.getFullYear()
}



