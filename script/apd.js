var apdTableFilter = {}
var apdItem = [
    ["handscoon","masker","gown", "google", "sepatu", "headcup"],
    ["Handscoon", "Masker", "Gown-Apron", "Faceshield-Google", "Sepatu Boots", "Headcup"]
]
function ResetAPDInput(){
    console.log("reset apd")
    var today = new Date()
    Elem("apd-input-bulan").value = today.getMonth() + 1
    Elem("apd-input-tahun").value = today.getFullYear()
    var praFilter = {
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
    apdTableFilter = praFilter
    apdFilterPreset()
    UpdateAPDTable()
    InputWithList()
    // EditAPD(610)
}
function apdFilterPreset(){
    var data = database.apdData
    var monthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    var tempData = {monthListObj : {}}
    var nData = 0
    while(nData < data.length){
        var mo = data[nData].month
        var ye = data[nData].year
        tempData.monthListObj[(ye*12)+(mo*1)] = {mo: mo, year : ye, text: monthText[mo] + " " + ye}
    nData++
    }
    tempData["monthListArr"] = Object.values(tempData.monthListObj)
    var bulanFilter = document.getElementById("apd-filter-bulan")
        bulanFilter.innerHtml = ""
        var allBulanOpt = document.createElement("option"); 
            allBulanOpt.value = "all"; 
            allBulanOpt.innerHTML = "Semua Bulan"
        bulanFilter.appendChild(allBulanOpt)
        var nBulan = tempData.monthListArr.length - 1;
        while(nBulan >= 0){
            var item = document.createElement("option")
            item.value = tempData.monthListArr[nBulan].year.toString() + tempData.monthListArr[nBulan].mo.toString(); 
            item.innerHTML = tempData.monthListArr[nBulan].text
            bulanFilter.appendChild(item)
        nBulan--
        }
    var obsFilter = document.getElementById("apd-filter-observer")
    obsFilter.innerHTML = ""
        var allObsOpt = document.createElement("option"); 
        allObsOpt.value = "all"; 
        allObsOpt.innerHTML = "Semua Observer"
        obsFilter.appendChild(allObsOpt)
    var userList = Object.keys(database.userList)
    var nObs = 0;
        while(nObs < userList.length){
            // var user = databasae.userList[userList[nObs]]
            var item = document.createElement("option")
            item.value = userList[nObs]; 
            item.innerHTML = database.userList[userList[nObs]]
            obsFilter.appendChild(item)
        nObs++
        }   
}
function apdFilter(elem){
    apdTableFilter[elem.getAttribute("filter-apd-type")] = elem.value
    apdTableFilter.minData = 0
    UpdateAPDTable()
}
function apdSortTableHeader(elem){
    document.querySelectorAll(".apdSortBtn .bi:nth-child(1)").forEach((p)=>p.classList = "bi bi-caret-up")
    document.querySelectorAll(".apdSortBtn .bi:nth-child(2)").forEach((p)=>p.classList = "bi bi-caret-down")
    currentSort = elem.getAttribute("apd-sort-state")
    apdTableFilter["sort"]["type"] = elem.getAttribute("apd-sort-type")
    document.querySelectorAll(".apdSortBtn").forEach((p)=>p.setAttribute("apd-sort-state", "off"))
    if(currentSort === "up"){
        elem.setAttribute("apd-sort-state", "down")
        elem.querySelector(".bi:nth-child(2)").classList = "bi bi-caret-down-fill"
        apdTableFilter["sort"]["direction"] = "bigger-smaller"
    }
    else {
        elem.setAttribute("apd-sort-state", "up")
        elem.querySelector(".bi:nth-child(1)").classList = "bi bi-caret-up-fill"
        apdTableFilter["sort"]["direction"] = "smaller-bigger"
    }
    apdTableFilter.minData = 0
    UpdateAPDTable()
}
function UpdateAPDTable(){
    console.log("Updating Table...")
    // console.log(apdTableFilter)
    var apdData = database.apdData
    var userID = UserInfo.id * 1
    var monthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }

    if(apdTableFilter.group !== "all"){
        apdData = apdData.filter((p)=>{return p.group == apdTableFilter.group})
    }
    if(apdTableFilter.unit !== ""){
        apdData = apdData.filter((p)=>{return p.unit == apdTableFilter.unit})
    }
    if(apdTableFilter.monthyear !== "all"){
        var year = apdTableFilter.monthyear.toString().substring(0,4) * 1
        var month = apdTableFilter.monthyear.toString().substring(4) * 1
        apdData = apdData.filter((p)=>{return p.year === year && p.month === month})
    }
    if(apdTableFilter.observer !== "all"){
        apdData = apdData.filter((p)=>{return p.observer == apdTableFilter.observer})
    }

    var sort = apdTableFilter.sort
    switch (true){
        case (sort.type == "time" && sort.direction == "bigger-smaller") :
            apdData.sort((a, b)=>{ return new Date(b.time) - new Date(a.time) })
            break;
        case (sort.type == "time" && sort.direction == "smaller-bigger") :
            apdData.sort((a, b)=>{ return new Date(a.time) - new Date(b.time) })
            break;
        case (sort.type == "score" && sort.direction == "bigger-smaller") :
            apdData.sort((a, b)=>{ return totalScore(b)*1 - totalScore(a)*1})
            break;
        case (sort.type == "score" && sort.direction == "smaller-bigger") :
            apdData.sort((a, b)=>{ return totalScore(a)*1 - totalScore(b)*1 })
            break;
        default :
    }
    
    // console.log(apdData)
    // return
    var dataLen = apdData.length
    var minData = apdTableFilter.minData
        if(minData > dataLen-1){minData = dataLen-1;}
    var maxData = minData + (apdTableFilter.divider - 1)
        if(maxData > dataLen-1){maxData = dataLen-1;}

    Elem("apd-table-body").innerHTML = ""
    for(var i = minData; i < (maxData+1);i++ ){
        var dataItem = apdData[i]
        var tr = document.createElement("tr")    
        if(userID === dataItem["observer"] * 1) {
            tr.setAttribute("onclick", "EditAPD("+dataItem.id+")")
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
        trInner += "<td>"+ (totalScore(dataItem) === "" ? "" : (totalScore(dataItem)+"%")) + "</td>"
        
        for(var j = 0; j<6; j++){
            trInner += "<td class='text-center'>" + textAPD(dataItem[apdItem[0][j]]) + "</td>"    
        }
        trInner += "<td>" + dataItem.overuse + "</td>"
        
        tr.innerHTML = trInner
        Elem("apd-table-body").appendChild(tr)
    }
    function textAPD(val){
        if(val === true){return "Y"}
        else if(val === false){return "N"}
        else{return ""}
    }

    
    var nPaging = Math.floor((apdData.length - 1) / apdTableFilter.divider)
    var curr_nPaging = Math.floor(minData / apdTableFilter.divider)
    var apdGroupingArrowBtns = document.querySelectorAll(".apd-grouping-btn-arrow")
    var apdGroupingNumBtns = document.querySelectorAll(".apd-grouping-btn-num")
    
    apdGroupingArrowBtns[1].querySelector("div").setAttribute("onclick", "apdTableGroupShow("+(nPaging * apdTableFilter.divider)+")")
    apdGroupingArrowBtns.forEach((p)=>{p.classList.remove("disabled")})
    apdGroupingNumBtns.forEach((p)=>{p.classList.remove("disabled");p.classList.remove("active")})

    if(minData === 0){apdGroupingArrowBtns[0].classList.add("disabled")}
    if(nPaging < 5 || curr_nPaging < 2 ){
        for(var i = 0; i<5; i++){
            var elem = apdGroupingNumBtns[i] 
            if(i < (nPaging + 1) ){
                elem.querySelector("div").innerHTML = i + 1
                elem.querySelector("div").setAttribute("onclick", "apdTableGroupShow("+(i * apdTableFilter.divider)+")")
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
                var elem = apdGroupingNumBtns[i] 
                if(i === 2){elem.classList.add("active")}
                elem.querySelector("div").innerHTML = (curr_nPaging + i - 1)
                elem.querySelector("div").setAttribute("onclick", "apdTableGroupShow("+((curr_nPaging + i - 2) * apdTableFilter.divider)+")")
            }   
        }
        else if(curr_nPaging >= (nPaging-1)){
            for(var i = 0; i<5;i++){
                var elem = apdGroupingNumBtns[i]
                elem.querySelector("div").innerHTML = nPaging + i - 3
                elem.querySelector("div").setAttribute("onclick", "apdTableGroupShow("+((nPaging+i-4) * apdTableFilter.divider)+")")
                if(i === (4 + curr_nPaging - nPaging)){
                    elem.classList.add("active")
                }
                if(curr_nPaging === nPaging){
                    apdGroupingArrowBtns[1].classList.add("disabled")
                }
            }
        }
    }
    function totalScore(item){
        var act = 0; var opp = 0
        for(var i = 0; i < 6; i++){
            var apdItemVal = item[apdItem[0][i]]
            if(apdItemVal !== ""){
                opp++;
                if(apdItemVal){act++}
            }
        }
        if (opp == 0){return ""}
        var tot = act / opp * 100 
        return tot == 100 ? 100 : (tot.toFixed(1) * 1) 
    }
}
function apdTableGroupShow(n){
    apdTableFilter.minData = n;
    UpdateAPDTable()
}
function apdInputChange(elem){
    if (elem.id == "apd-input-nama"){
        if(!(elem.value == "") && 
            database.staffData.map((p)=>{return p.name}).includes(Elem("apd-input-nama").value)){
            Elem("apd-input-nama").classList.remove("is-invalid")
        } else {
            Elem("apd-input-nama").classList.add("is-invalid")
            Elem("apd-input-kelompok").value = ""
            Elem("apd-input-unit").value = ""
        }
    } else if(elem.id == "apd-input-unit" && !(elem.value == "")){
        if (database.unitData.map((p)=>{return p.name}).includes(Elem("apd-input-unit").value)){
            Elem("apd-input-unit").classList.remove("is-invalid")
        } else {
            Elem("apd-input-unit").classList.add("is-invalid")
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
async function simpanNilaiAPD(){
    var SimpanVal = {}
    var obyekDataInput = document.querySelectorAll("[input-value-group='apd']")
    var nObyekDataInput = 0
    while(nObyekDataInput < obyekDataInput.length){
        var elem = obyekDataInput[nObyekDataInput]
        if(elem.value == "" || elem.classList.contains("is-invalid")){
            alert("Input '" + elem.getAttribute("input-value-type").toUpperCase() + "' kosong atau salah");
            elem.focus()
            return
        }
        SimpanVal[elem.getAttribute("input-value-type")] = elem.value
    nObyekDataInput++
    }
    var apdItemsInput = document.querySelectorAll(".apd-card input")
    var napdItemsInput = 0; var apdItemChecked = 0
    while(napdItemsInput < apdItemsInput.length){
        var elem = apdItemsInput[napdItemsInput]
        if(elem.checked){
            apdItemChecked++;
            var valType = elem.getAttribute("name").substring(10)
            valLength = elem.getAttribute("name").length + 1
            val = elem.id.substring(valLength)
            SimpanVal[valType] = val
        }
        
    napdItemsInput++
    }
    if(apdItemChecked === 0){
        alert("Salah satu item penilaian APD harus diisi");
        return
    }
    if(Elem("apd-input-overuse").value !== ""){
        SimpanVal["overuse"] = Elem("apd-input-overuse").value
    }
    console.log(SimpanVal)
    if(confirm("Simpan data penilaian APD?")){
        spinner(true)
        var url = dbAPI + "?req=apdins&observer=" + UserInfo.id
        var simpanValKey = Object.keys(SimpanVal); var nsimpanValKey = 0
        while(nsimpanValKey < simpanValKey.length){
            url += "&" + simpanValKey[nsimpanValKey] + "=" + SimpanVal[simpanValKey[nsimpanValKey]]
        nsimpanValKey++
        }
        console.log("sending...trying...")
        await fetch(url)
        .then(respon => respon.json())
        .then(respon => {
            if(respon.ok){
                console.log("respon = ok")
                // console.log(database)
                database.apdData = respon.data
                // database.userList = respon.userList
                // console.log(database)
                ResetAPDInput()
                spinner(false)
                Toast("Data berhasil disimpan")                
            }
        })

    }
    
}
function EditAPD(id){
    var data = database.apdData.filter((p)=>{return p.id === id})[0]
    // console.log(data)
    Elem("apd-edit-id").value = data.id
    Elem("apd-edit-observer").value = data.observer
    Elem("apd-edit-nama").value = data.object
    Elem("apd-edit-kelompok").value = data.group
    Elem("apd-edit-unit").value = data.unit
    Elem("apd-edit-bulan").value = data.month
    Elem("apd-edit-tahun").value = data.year

    var nAPDitem = 0;
    while(nAPDitem < apdItem[0].length){
        var val = data[apdItem[0][nAPDitem]]
        Elem("apd-edit-" + apdItem[0][nAPDitem] + "-true").checked = false
        Elem("apd-edit-" + apdItem[0][nAPDitem] + "-false").checked = false
        if(val !== ""){
            var input = Elem("apd-edit-" + apdItem[0][nAPDitem] + "-" + (val ? "true" : "false"))
            input.checked = true
        }
    nAPDitem++
    }
    Elem("apd-edit-overuse").value = data.overuse
    Elem("apdEditCanvasBtn").click()
}
async function editapdAPI(code, elem){
    // console.log(code)
    if(code == "hapus"){

    }
    if(code == "simpan"){
        var SimpanVal = {}
        var obyekDataInput = document.querySelectorAll("[input-value-group='apd-edit']")
        var nObyekDataInput = 0
        while(nObyekDataInput < obyekDataInput.length){
            var elem = obyekDataInput[nObyekDataInput]
            if(elem.value == "" || elem.classList.contains("is-invalid")){
                alert("Input '" + elem.getAttribute("input-value-type").toUpperCase() + "' kosong atau salah");
                elem.focus()
                return
            }
            SimpanVal[elem.getAttribute("input-value-type")] = elem.value
        nObyekDataInput++
        }
        
        // var apdItemsInput = document.querySelectorAll(".apd-edit-item input")
        // console.log(apdItemsInput)
        var napdItems = 0; var apdItemChecked = 0
        while(napdItems < 6){
            SimpanVal[apdItem[0][napdItems]] = ""
            var trueElem = Elem("apd-edit-"+apdItem[0][napdItems]+"-true")
            var falseElem = Elem("apd-edit-"+apdItem[0][napdItems]+"-false")
            if(trueElem.checked){
                apdItemChecked++;
                SimpanVal[apdItem[0][napdItems]] = "true"
            }
            else if(falseElem.checked){
                apdItemChecked++;
                SimpanVal[apdItem[0][napdItems]] = "false"
            }
            
        napdItems++
        }
        if(apdItemChecked === 0){
            alert("Salah satu item penilaian APD harus diisi");
            return
        }
        if(Elem("apd-edit-overuse").value !== ""){
            SimpanVal["overuse"] = Elem("apd-edit-overuse").value
        }

        console.log(SimpanVal)
        if(confirm("Simpan data penilaian APD?")){
            spinner(true)
            var url = dbAPI + "?req=apdupd" 
            // &observer=" + SimpanVal.observer + "&id=" + SimpanVal.id
            var simpanValKey = Object.keys(SimpanVal); var nsimpanValKey = 0
            while(nsimpanValKey < simpanValKey.length){
                url += "&" + simpanValKey[nsimpanValKey] + "=" + SimpanVal[simpanValKey[nsimpanValKey]]
            nsimpanValKey++
            }
            // console.log(url)
            console.log("sending...trying...")
            await fetch(url)
            .then(respon => respon.json())
            .then(respon => {
                if(respon.ok){
                    console.log("respon = ok")
                    database.apdData = respon.data
                    ResetAPDInput()
                    spinner(false)
                    Toast("Data berhasil disimpan")                
                }
            })
    
        }
    }
}