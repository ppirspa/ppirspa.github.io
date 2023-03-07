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
    var today = new Date()
    Elem("hh-input-bulan").value = today.getMonth() + 1
    Elem("hh-input-tahun").value = today.getFullYear()
    hhFilterPreset()
    hhTableFilterShort = hhTableFilterShortDefault
    UpdateHHTable()
    InputWithList()
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
function UpdateHHTable(){
    console.log(hhTableFilterShort)
    var hhData = database.hhData
    var user = UserName
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
        if(user == dataItem["observer"]){
            tr.setAttribute("onclick", "EditHH('show', "+hhData[i].id+")")
        }
        var tgl = new Date(dataItem.time)
        var hour = tgl.getHours(); if(hour < 10){hour = "0"+hour}
        var minut = tgl.getMinutes(); if(minut < 10){minut = "0"+minut}
        var trInner = "<td>"+tgl.getDate()+"/"+(tgl.getMonth()+1)+"/"+tgl.getFullYear()+" "+hour+":"+minut+"</td>"
        trInner += "<td>"+dataItem.observer+"</td>"
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
        praArray.observer[p.observer] = ""
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
    Object.keys(praArray.observer).forEach((p)=>{
        var opt = document.createElement("option")
        opt.setAttribute("value", p)
        opt.innerHTML = p
        filterObsElem.appendChild(opt)
    })
}
function EditHH(id){
    
}
function hhFilterReset(){
    console.log(Elem("hh-filter-kelompok").selectedIndex)
    Elem("hh-filter-kelompok").selectedIndex = 0; Elem("hh-filter-kelompok").onchange()
    Elem("hh-filter-unit").value = ""; Elem("hh-filter-unit").onchange()
    Elem("hh-filter-bulan").selectedIndex = 0; Elem("hh-filter-bulan").onchange()
    Elem("hh-filter-observer").selectedIndex = 0; Elem("hh-filter-observer").onchange()
    
    // Elem("hh-filter-unit").value = "";
    // Elem("hh-filter-bulan").selectedIndex = 0;
    // Elem("hh-filter-observer").selectedIndex = 0;
    
    // hhTableFilterShort.group = "all"
    // hhTableFilterShort.unit = ""
    // hhTableFilterShort.monthyear = "all"
    // hhTableFilterShort.observer = "all"
    // UpdateHHTable()
}
function hhTableGroupShow(n){
    hhTableFilterShort.minData = n;
    UpdateHHTable()
}
