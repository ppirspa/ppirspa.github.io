var hhInputValue = {}


function ResetHHInput(){
    var today = new Date()
    Elem("hh-input-bulan").value = today.getMonth() + 1
    Elem("hh-input-tahun").value = today.getFullYear()
}

function hhInputChange(elem){
        if (elem.id == "hh-input-nama"){
            if(!(elem.value == "") && 
                database.staffData.map((p)=>{return p.name}).includes(Elem("hh-input-nama").value)){
                Elem("hh-input-nama").classList.remove("is-invalid")
            } else {
                Elem("hh-input-nama").classList.add("is-invalid")
                Elem("hh-input-kelompok").value = ""
                Elem("hh-input-unit").value = ""
            }
        } else if(elem.id == "hh-input-unit" && !(elem.value == "")){
            if (database.unitData.map((p)=>{return p.name}).includes(Elem("hh-input-unit").value)){
                Elem("hh-input-unit").classList.remove("is-invalid")
            } else {
                Elem("hh-input-unit").classList.add("is-invalid")
            }
        }
        else {
            if(elem.value == ""){
                elem.classList.add("is-invalid")    
            } else {
                elem.classList.remove("is-invalid")
            }
        } 
        
}

async function saveHHInput(){
    var tempVal = {}
    tempVal.name = ""
    tempVal.group = ""
    tempVal.unit = ""
    tempVal.bulan = ""
    tempVal.tahun = ""
    tempVal.m1 = ""
    tempVal.m2 = ""
    tempVal.m3 = ""
    tempVal.m4 = ""
    tempVal.m5 = ""

    let isSkip = false
    document.querySelectorAll("[input-value-group='hh']").forEach((p)=>{
        if (isSkip) {
            return;
        }
        if (p.classList.contains("is-invalid") || p.value == "") {
            isSkip = true;
            p.focus()
            if(p.value == "") {alert("Opps... " + p.getAttribute("input-value-type") + " masih kosong")}
            else {alert("Opps... " + p.getAttribute("input-value-type") + " masih salah")}
            return;
        }
        tempVal[p.getAttribute("input-value-type")] = p.value
    })
    if(isSkip){return}
    let moCheck = 0
    var moURL = ""
    for (var i = 1; i < 6; i++){
        var mo = ""
        if (!(document.querySelector("[name='input-hh-mo"+i+"']:checked") === null)){
            mo = document.querySelector("[name='input-hh-mo"+i+"']:checked").value
            moURL += "&mo" + i + "=" + mo
            moCheck += 1
        }
        tempVal["m" + i] = mo
    }
    if(moCheck === 0){
        alert("Opps... belum ada moment yang dinilai")
        return
    }
    hhInputValue = tempVal
    // hh_ins	hh_	ins		time,obsever,name,group,unit,bulan,tahun,m1,m2,m3,m4,m5
    var urlSave = dbAPI + "?req=hh_ins" +
    "&observer=" + Elem("userLoginName").innerHTML +
    "&name=" + hhInputValue.name +
    "&group=" + hhInputValue.group +
    "&unit=" + hhInputValue.unit +
    "&month=" + hhInputValue.bulan +
    "&year=" + hhInputValue.tahun + moURL
    
    console.log(urlSave)
    // return
    if(confirm("Simpan penilaian?")){
        spinner(true)
        let respon = await fetch(urlSave).then(respon => respon.json())
        console.log(respon.ok)
        await NavbarTo("hh")
        spinner(false)
        alert("Data berhasil disimpan")
    }
}
