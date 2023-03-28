var hhInputValue = {}
var hhTableFilterShort ={}
var hhTableFilterShortDefault = {
    divider : 10,
    sort : {
        type: "time", 
        direction : "bigger-smaller"
    },
    group : "all",
    unit : "",
    monthyear : "all",
    observer : "all",
    minData : 0,   
}
database.hhUniqueObserver = []

function ResetHHInput(){
    console.log("ResetHHInput")
    var today = new Date()
    Elem("hh-input-bulan").value = today.getMonth() + 1
    Elem("hh-input-tahun").value = today.getFullYear()
    hhFilterPreset()
    hhTableFilterShort = hhTableFilterShortDefault
    UpdateHHTable()
    InputWithList()
    Elem("moment-clear-button").click()
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
    "&observer=" + UserInfo.id +
    "&name=" + hhInputValue.name +
    "&group=" + hhInputValue.group +
    "&unit=" + hhInputValue.unit +
    "&month=" + hhInputValue.bulan +
    "&year=" + hhInputValue.tahun + moURL
    
    // return
    if(confirm("Simpan penilaian?")){
        spinner(true)
        let respon = await fetch(urlSave).then(respon => respon.json())
        .then(respon => {
            if(respon.ok){
                console.log("respon = ok")
                database.hhData = respon.data                
            }
        })
        ResetHHInput()
        spinner(false)
        alert("Data berhasil disimpan")
    }
}
function UpdateHHTable(){
    var hhData = database.hhData
    var userID = UserInfo.id * 1
    var monthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }

    if(hhTableFilterShort.group !== "all"){
        hhData = hhData.filter((p)=>{return p.group == hhTableFilterShort.group})
    }
    if(hhTableFilterShort.unit !== ""){
        hhData = hhData.filter((p)=>{return p.unit == hhTableFilterShort.unit})
    }
    if(hhTableFilterShort.monthyear !== "all"){
        var year = hhTableFilterShort.monthyear.toString().substring(0,4) * 1
        var month = hhTableFilterShort.monthyear.toString().substring(4) * 1
        hhData = hhData.filter((p)=>{return p.year === year && p.month === month})
    }
    if(hhTableFilterShort.observer !== "all"){
        hhData = hhData.filter((p)=>{return p.observer == hhTableFilterShort.observer})
    }

    var sort = hhTableFilterShort.sort
    switch (true){
        case (sort.type == "time" && sort.direction == "bigger-smaller") :
            hhData.sort((a, b)=>{ return new Date(b.time) - new Date(a.time) })
            break;
        case (sort.type == "time" && sort.direction == "smaller-bigger") :
            hhData.sort((a, b)=>{ return new Date(a.time) - new Date(b.time) })
            break;
        case (sort.type == "moment" && sort.direction == "bigger-smaller") :
            hhData.sort((a, b)=>{ return totalMoment(b)*1 - totalMoment(a)*1})
            break;
        case (sort.type == "moment" && sort.direction == "smaller-bigger") :
            hhData.sort((a, b)=>{ return totalMoment(a)*1 - totalMoment(b)*1 })
            break;
        default :
    }
    
    var dataLen = hhData.length
    var minData = hhTableFilterShort.minData
        if(minData > dataLen-1){minData = dataLen-1;}
    var maxData = minData + (hhTableFilterShort.divider - 1)
        if(maxData > dataLen-1){maxData = dataLen-1;}

    Elem("hh-table-body").innerHTML = ""
    for(var i = minData; i < (maxData+1);i++ ){
        var dataItem = hhData[i]
        var tr = document.createElement("tr")    
        if(userID === dataItem["observer"] * 1) {
            tr.setAttribute("onclick", "EditHH("+dataItem.id+")")
            tr.classList.add('table-link')
        }
        var tgl = new Date(dataItem.time)
        var hour = tgl.getHours(); if(hour < 10){hour = "0"+hour}
        var minut = tgl.getMinutes(); if(minut < 10){minut = "0"+minut}
        var trInner = "<td>"+tgl.getDate()+"/"+(tgl.getMonth()+1)+"/"+tgl.getFullYear()+" "+hour+":"+minut+"</td>"
        trInner += "<td>"+ database.userList[dataItem.observer * 1]+"</td>"
        trInner += "<td>"+dataItem.object+"</td>"
        trInner += "<td>"+dataItem.unit+"</td>"
        trInner += "<td>"+dataItem.group+"</td>"
        trInner += "<td>"+monthText[dataItem.month]+" " + dataItem.year + "</td>"
        trInner += "<td>"+ (totalMoment(dataItem) === "" ? "" : (totalMoment(dataItem)+"%")) + "</td>"
        trInner += "<td>" + textMo(dataItem.mo1) + "</td>"
        trInner += "<td>" + textMo(dataItem.mo2) + "</td>"
        trInner += "<td>" + textMo(dataItem.mo3) + "</td>"
        trInner += "<td>" + textMo(dataItem.mo4) + "</td>"
        trInner += "<td>" + textMo(dataItem.mo5) + "</td>"
        tr.innerHTML = trInner
        Elem("hh-table-body").appendChild(tr)
    }
    function textMo(mo){
        if(mo === true){return "Y"}
        else if(mo === false){return "N"}
        else{return ""}
    }

    var nPaging = Math.floor((hhData.length - 1) / hhTableFilterShort.divider)
    var curr_nPaging = Math.floor(minData / hhTableFilterShort.divider)
    var hhGroupingArrowBtns = document.querySelectorAll(".hh-grouping-btn-arrow")
    var hhGroupingNumBtns = document.querySelectorAll(".hh-grouping-btn-num")
    
    hhGroupingArrowBtns[1].querySelector("div").setAttribute("onclick", "hhTableGroupShow("+(nPaging * hhTableFilterShort.divider)+")")
    hhGroupingArrowBtns.forEach((p)=>{p.classList.remove("disabled")})
    hhGroupingNumBtns.forEach((p)=>{p.classList.remove("disabled");p.classList.remove("active")})

    if(minData === 0){hhGroupingArrowBtns[0].classList.add("disabled")}
    if(nPaging < 5 || curr_nPaging < 2 ){
        for(var i = 0; i<5; i++){
            var elem = hhGroupingNumBtns[i] 
            if(i < (nPaging + 1) ){
                elem.querySelector("div").innerHTML = i + 1
                elem.querySelector("div").setAttribute("onclick", "hhTableGroupShow("+(i * hhTableFilterShort.divider)+")")
                if(i === curr_nPaging){elem.classList.add("active")}
            }
            else {
                elem.querySelector("div").innerHTML = i + 1
                elem.classList.add("disabled")
            }
        }
    }
    else {
        if(curr_nPaging > 1 && curr_nPaging < (nPaging - 1) ){
            for(var i = 0; i<5;i++){
                var elem = hhGroupingNumBtns[i] 
                if(i === 2){elem.classList.add("active")}
                elem.querySelector("div").innerHTML = (curr_nPaging + i - 1)
                elem.querySelector("div").setAttribute("onclick", "hhTableGroupShow("+((curr_nPaging + i - 2) * hhTableFilterShort.divider)+")")
            }   
        }
        else if(curr_nPaging >= (nPaging-1)){
            for(var i = 0; i<5;i++){
                var elem = hhGroupingNumBtns[i]
                elem.querySelector("div").innerHTML = nPaging + i - 3
                elem.querySelector("div").setAttribute("onclick", "hhTableGroupShow("+((nPaging+i-4) * hhTableFilterShort.divider)+")")
                if(i === (4 + curr_nPaging - nPaging)){
                    elem.classList.add("active")
                }
                if(curr_nPaging === nPaging){
                    hhGroupingArrowBtns[1].classList.add("disabled")
                }
            }
        }
    }
}
function totalMoment(item){
    var act = 0; var opp = 0 
    for(var i = 1; i < 6; i++){
        var moVal = item["mo"+i] 
        moVal === "" ? "" : opp++
        moVal === true ? act++ : ""
    }
    if (opp == 0){return ""}
    var tot = act / opp * 100 
    return tot == 100 ? 100 : (tot.toFixed(1) * 1) 
}
function HHSortTableHeader(elem){
    document.querySelectorAll(".HHSortBtn .bi:nth-child(1)").forEach((p)=>p.classList = "bi bi-caret-up")
    document.querySelectorAll(".HHSortBtn .bi:nth-child(2)").forEach((p)=>p.classList = "bi bi-caret-down")
    currentSort = elem.getAttribute("hh-sort-state")
    hhTableFilterShort["sort"]["type"] = elem.getAttribute("hh-sort-type")
    document.querySelectorAll(".HHSortBtn").forEach((p)=>p.setAttribute("hh-sort-state", "off"))
    if(currentSort === "up"){
        elem.setAttribute("hh-sort-state", "down")
        elem.querySelector(".bi:nth-child(2)").classList = "bi bi-caret-down-fill"
        hhTableFilterShort["sort"]["direction"] = "bigger-smaller"
    }
    else {
        elem.setAttribute("hh-sort-state", "up")
        elem.querySelector(".bi:nth-child(1)").classList = "bi bi-caret-up-fill"
        hhTableFilterShort["sort"]["direction"] = "smaller-bigger"
    }
    hhTableFilterShort.minData = 0
    UpdateHHTable()
}
function hhFilter(elem){
    hhTableFilterShort[elem.getAttribute("filter-hh-type")] = elem.value
    hhTableFilterShort.minData = 0
    // console.log(hhTableFilterShort)
    UpdateHHTable()
}
function hhFilterPreset(){
    var data = database.hhData
    // console.log(data)
    var monthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    var praArray = {
        month : {},
        observer : {}
    }
    var filterMonElem = Elem("hh-filter-bulan")
        var optAllMo = document.createElement("option")
        optAllMo.setAttribute("value", "all")
        optAllMo.innerHTML = "Semua Bulan"
        filterMonElem.appendChild(optAllMo)
    var filterObsElem = Elem("hh-filter-observer")
        var optAllOb = document.createElement("option")
        optAllOb.setAttribute("value", "all")
        optAllOb.innerHTML = "Semua Observer"
        filterObsElem.appendChild(optAllOb)
    data.forEach((p)=>{
        var mSort = (p.month * 1) + (p.year*12)
        var mText = monthText[p.month] + " " + (p.year)
        var mValue = p.year.toString() + p.month.toString()
        praArray.month[mSort] = {
            text : mText,
            value : mValue
        }
        if(p.observer * 1 > -1){
            praArray.observer[p.observer] = ""
        }
    })
    var moList = Object.keys(praArray.month).map((p)=>{
        return [p, praArray.month[p].text, praArray.month[p].value]
    })
    moList.splice(0,1)
    moList.sort((a, b)=>{ return b[0]*1 - a[0]*1 })
    // console.log(moList)
    moList.forEach((p)=>{
        var opt = document.createElement("option")
        opt.setAttribute("value", p[2])
        opt.innerHTML = p[1]
        filterMonElem.appendChild(opt)
    })
    // console.log(praArray)
    Object.keys(praArray.observer).forEach((p)=>{
        var opt = document.createElement("option")
        opt.setAttribute("value", p)
        opt.innerHTML = database.userList[p]
        filterObsElem.appendChild(opt)
    })
}
function EditHH(id){
    var data = database.hhData.filter((p)=>{return p.id === id})[0]
    Elem("hh-edit-id").value = data.id
    Elem("hh-edit-observer").value = database.userList[2]
    Elem("hh-edit-nama").value = data.object
    Elem("hh-edit-kelompok").value = data.group
    Elem("hh-edit-unit").value = data.unit
    Elem("hh-edit-bulan").value = data.month
    Elem("hh-edit-tahun").value = data.year
    document.querySelectorAll('.input-hh-btn.hh-edit.moment-1').forEach((p)=>p.checked = false)
    if(data.mo1 !== ""){data.mo1 ? Elem("edit-hh-mo1-true").checked = true : Elem("edit-hh-mo1-false").checked = true}
    document.querySelectorAll('.input-hh-btn.hh-edit.moment-2').forEach((p)=>p.checked = false)
    if(data.mo2 !== ""){data.mo2 ? Elem("edit-hh-mo2-true").checked = true : Elem("edit-hh-mo2-false").checked = true}
    document.querySelectorAll('.input-hh-btn.hh-edit.moment-3').forEach((p)=>p.checked = false)
    if(data.mo3 !== ""){data.mo2 ? Elem("edit-hh-mo3-true").checked = true : Elem("edit-hh-mo3-false").checked = true}
    document.querySelectorAll('.input-hh-btn.hh-edit.moment-4').forEach((p)=>p.checked = false)
    if(data.mo4 !== ""){data.mo2 ? Elem("edit-hh-mo4-true").checked = true : Elem("edit-hh-mo4-false").checked = true}
    document.querySelectorAll('.input-hh-btn.hh-edit.moment-5').forEach((p)=>p.checked = false)
    if(data.mo5 !== ""){data.mo2 ? Elem("edit-hh-mo5-true").checked = true : Elem("edit-hh-mo5-false").checked = true}

    Elem("hhEditCanvasBtn").click()
    // console.log(data)
}
function hhFilterReset(){
    console.log(Elem("hh-filter-kelompok").selectedIndex)
    Elem("hh-filter-kelompok").selectedIndex = 0; Elem("hh-filter-kelompok").onchange()
    Elem("hh-filter-unit").value = ""; Elem("hh-filter-unit").onchange()
    Elem("hh-filter-bulan").selectedIndex = 0; Elem("hh-filter-bulan").onchange()
    Elem("hh-filter-observer").selectedIndex = 0; Elem("hh-filter-observer").onchange()
    
}
function hhTableGroupShow(n){
    hhTableFilterShort.minData = n;
    UpdateHHTable()
}
async function editHHAPI(code, elem){
  if (confirm(elem.innerHTML + " ?" ) == true){
    spinner(true)
    // id, time,observer, name, group, unit, month, year, mo1, mo2, mo3, mo4, mo5
    var editElem = Elem("hhEditCanvas")
    var id = editElem.querySelector("#hh-edit-id").value * 1
    var observer = Object.keys(database.userList).find(key => database.userList[key] === editElem.querySelector("#hh-edit-observer").value)
    var name = editElem.querySelector("#hh-edit-nama").value
    var group = editElem.querySelector("#hh-edit-kelompok").value
    var unit = editElem.querySelector("#hh-edit-unit").value
    var month = editElem.querySelector("#hh-edit-bulan").value * 1
    var year = editElem.querySelector("#hh-edit-tahun").value * 1
    var moAll = {}
    moAll.mo1 = ""; if(editElem.querySelector("#edit-hh-mo1-true").checked){moAll.mo1 = "true"} else if (editElem.querySelector("#edit-hh-mo1-false").checked){moAll.mo1 = "false"}
    moAll.mo2 = ""; if(editElem.querySelector("#edit-hh-mo2-true").checked){moAll.mo2 = "true"} else if (editElem.querySelector("#edit-hh-mo2-false").checked){moAll.mo2 = "false"}
    moAll.mo3 = ""; if(editElem.querySelector("#edit-hh-mo3-true").checked){moAll.mo3 = "true"} else if (editElem.querySelector("#edit-hh-mo3-false").checked){moAll.mo3 = "false"}
    moAll.mo4 = ""; if(editElem.querySelector("#edit-hh-mo4-true").checked){moAll.mo4 = "true"} else if (editElem.querySelector("#edit-hh-mo4-false").checked){moAll.mo4 = "false"}
    moAll.mo5 = ""; if(editElem.querySelector("#edit-hh-mo5-true").checked){moAll.mo5 = "true"} else if (editElem.querySelector("#edit-hh-mo5-false").checked){moAll.mo5 = "false"}
    
    if(name == ""){alert("Nama obyek masih kosong"); editElem.querySelector("#hh-edit-nama").focus();return}
    if(group == ""){alert("Kelompok profesi masih kosong"); editElem.querySelector("#hh-edit-kelompok").focus();return}
    if(unit == ""){alert("Unit masih kosong"); editElem.querySelector("#hh-edit-unit").focus();return}
    if(!(month > 0)){alert("Bulan masih kosong"); editElem.querySelector("#hh-edit-bulan").focus();return}
    if(!(year > 2021)){alert("Tahun masih kosong"); editElem.querySelector("#hh-edit-tahun").focus();return}
    var moSelect = []
    for(var j = 1; j<6; j++){
        if(moAll["mo"+j] !== ""){
            moSelect.push("&mo" + j + "=" +moAll["mo"+j])
        }
    }
    if(!(moSelect.length > 0)){alert("Belum ada momemnt yang dinilai");return}

    // return
    if(code == "simpan"){
        console.log("Req Send: Simpan ....")
        await fetch(dbAPI + "?" + 
            "req=hh_upd" +
            "&id=" + id + 
            "&observer="  + observer + 
            "&name=" + name +
            "&group="  + group +
            "&unit="  + unit +
            "&month="  + month +
            "&year="  + year + 
            moSelect.join("")
            )

            .then(respon => respon.json())
            .then(respon => {
                if(respon.ok){
                    console.log("Respon: ok...")
                    database.hhData = respon.data;
                    ResetHHInput()
                }
            })
    }
    if(code == "hapus"){
        console.log("Req Send: Hapus ....")
        await fetch(dbAPI + "?" + 
            "req=hh_del" +
            "&id=" + id 
            )
            .then(respon => respon.json())
            .then(respon => {
                if(respon.ok){
                    console.log("Respon: ok...")
                    database.hhData = respon.data; 
                    ResetHHInput()
                }
            })
    }
    Toast(elem.innerHTML + " - Success")
    Elem("hh-edit-batal-btn").click()
    spinner(false)
    return
  }
  else {
    return
  }
}