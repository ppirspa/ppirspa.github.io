var quesFiltered = []
function ResetSupervisiPage(){
    console.log("ResetSupervisiPage...")
    var today = new Date()
    Elem("sup-input-unit").value = ""; unitFilter('')
    Elem("sup-input-bulan").value = today.getMonth() + 1
    Elem("sup-input-tahun").value = today.getFullYear()
    Elem("sup-input-id").value = ""
    Elem("sup-input-id-cont").classList.add("d-none")
    progressBar(0, 0)
    // hhFilterPreset()
    // hhTableFilterShort = hhTableFilterShortDefault
    UpdateSPVTable()
    InputWithList()
    
    
    // SupHide('unitData')
    // Elem("sup-input-unit").value = "ADAS MANIS"
    // unitFilter("ADAS MANIS")
    // SupHide('unitData')

}
function SupShow(code){
    if(code == 'unitData'){
        document.getElementById('sup-unitData-container').classList.remove('hidden')
        Elem("sup-unitData-btn").classList.add('d-none')
    }
    if(code == 'listData'){
        document.getElementById('sup-listData-container').classList.remove('hidden')
        Elem("sup-listData-btn").classList.add('d-none')
    }
}
function SupHide(code){
    if(code == 'unitData'){
        document.getElementById('sup-unitData-container').classList.add('hidden')
        Elem("sup-unitData-btn").classList.remove('d-none')
    }
    if(code == 'listData'){
        document.getElementById('sup-listData-container').classList.add('hidden')
        Elem("sup-listData-btn").classList.remove('d-none')
    }
}
function spvTabTo(elem){
    var babSelect = elem.id.substring(8) 
    if(babSelect !== "before" && babSelect !== "after"){
        document.querySelectorAll(".spv-box-bab").forEach((p)=>{p.classList.add('d-none')})
        Elem("spv-box-" + babSelect).classList.remove('d-none')
        ScrollToX(document.querySelector("#spv-tab-" + babSelect + "-label"), Elem("spv-scroll-tab-container"))
    }
    else {
        var babAvaibleElem = document.querySelectorAll("[name='spv-tab']")
        var babAvaible = []
        var nBabAvail = 0;
        while(nBabAvail < babAvaibleElem.length){
            babAvaible.push(babAvaibleElem[nBabAvail].id.substring(8))
        nBabAvail++    
        }
        // console.log(babAvaible)
        var currentBabId = babAvaible.indexOf(document.querySelector("[name='spv-tab']:checked").id.substring(8).toUpperCase()) - 1
        if(babSelect == "before" && currentBabId > 0){
            currentBabId--
        } else if (babSelect == "after" && currentBabId < (babAvaible.length -1 )){
            currentBabId++
        }
        var elemTarget = Elem("spv-tab-" + babAvaible[currentBabId + 1])
        elemTarget.checked = true
        var event = new Event('change'); elemTarget.dispatchEvent(event);
        ScrollToX(document.querySelector("#spv-tab-" + babAvaible[currentBabId + 1] + "-label"), Elem("spv-scroll-tab-container"))
    }
}
function unitFilter(val){
    // quesFiltered = []
    var cekList = Object.values(database.ceklist)
    var babTabContainer = Elem("spv-scroll-tab-container")
        babTabContainer.innerHTML = ""
    var babPageContainer = Elem("spv-bab-container"); 
        babPageContainer.innerHTML = ""
    var nCekList = 0; var nBabAssign = 0; var QueFiltered = {}
    quesFiltered = []
    if(val == ""){return}
    while(nCekList < cekList.length){
        var chItem = cekList[nCekList]
        var units = chItem.unitAssign
        if(units.indexOf(val) > -1){
            quesFiltered.push(chItem)
            var code = chItem.code
            var babCode = code.substring(4,5)
            var babText = chItem.bab
            var subCode = code.substring(6)
            if(!(Elem("spv-tab-" + babCode))){
                QueFiltered[babCode] = {}
                var inpBab = Elem("spv-tab-sample").cloneNode(true)
                    inpBab.id = "spv-tab-" + babCode
                    if(quesFiltered.length === 1){inpBab.checked = true} else {inpBab.checked = false}
                var tabBabLabel =  Elem("spv-tab-label-sample").cloneNode(true)
                    tabBabLabel.setAttribute("for", "spv-tab-" + babCode)
                    tabBabLabel.id = "spv-tab-" + babCode + "-label"
                    tabBabLabel.innerHTML = "<div>"+alphabet[nBabAssign]+". "+babText+"</div>"
                babTabContainer.appendChild(inpBab)
                babTabContainer.appendChild(tabBabLabel)

                var babBox = Elem("spv-box-sample").cloneNode(true)
                    babBox.id = "spv-box-" + babCode
                    var yesLabel = babBox.querySelector(".sup-que-item-yesno > div:nth-child(2) > label")
                        yesLabel.setAttribute("for", "bab-"+babCode+"-true")
                        yesLabel.querySelector("input").id = "bab-"+babCode+"-true"
                        yesLabel.querySelector("input").setAttribute("name", "bab-"+babCode )
                    var noLabel = babBox.querySelector(".sup-que-item-yesno > div:nth-child(3) > label")
                        noLabel.setAttribute("for", "bab-"+babCode+"-false")
                        noLabel.querySelector("input").id = "bab-"+babCode+"-false"
                        noLabel.querySelector("input").setAttribute("name", "bab-"+babCode )
                    if(quesFiltered.length === 1){babBox.classList.remove("d-none")} else {babBox.classList.add("d-none")}
                    babBox.querySelector(".bab-container-sample").id = "bab-container-" + babCode
                babPageContainer.appendChild(babBox)
                nBabAssign++
            }
            if(!(Elem("spv-subbab-"+subCode))){
                QueFiltered[babCode][subCode] = {}
                var nSubNum = Object.keys(QueFiltered[babCode]).length
                var subBabElem = Elem("spv-subbab-sample").cloneNode(true)
                    subBabElem.querySelector(".spv-subbab-title").innerHTML = nSubNum + ". " +chItem.subbab
                    subBabElem.id = "spv-subbab-"+ subCode
                    var yesLabel = subBabElem.querySelector(".sup-que-item-yesno > div:nth-child(2) > div:nth-child(1) > label")
                        yesLabel.setAttribute("for", "sub-"+subCode+"-true")
                        yesLabel.querySelector("input").id = "sub-"+subCode+"-true"
                        yesLabel.querySelector("input").setAttribute("name", "sub-"+subCode )
                    var noLabel = subBabElem.querySelector(".sup-que-item-yesno > div:nth-child(2) > div:nth-child(2) > label")
                        noLabel.setAttribute("for", "sub-"+subCode+"-false")
                        noLabel.querySelector("input").id = "sub-"+subCode+"-false"
                        noLabel.querySelector("input").setAttribute("name", "sub-"+subCode )
                var babParent = Elem("bab-container-" + babCode)
                babParent.appendChild(subBabElem)
            }
            var queItemElem = Elem("spv-que-box-sample").cloneNode(true)
                queItemElem.querySelector(".spv-que-text").innerHTML = chItem.text
                var yesInp = queItemElem.querySelector(".spv-que-yn > input:nth-child(1)")
                    yesInp.setAttribute("bab-group", "bab-" + babCode + "-true")
                    yesInp.setAttribute("sub-group", "sub-" + subCode + "-true")
                    yesInp.setAttribute("name", "que-" + chItem.code)
                    yesInp.id = "que-" + chItem.code + "-true"
                var yesLab = queItemElem.querySelector(".spv-que-yn label:nth-child(2)")
                    yesLab.setAttribute("for", "que-" + chItem.code+ "-true")
                var noInp = queItemElem.querySelector(".spv-que-yn > input:nth-child(3)")
                    noInp.setAttribute("bab-group", "bab-" + babCode + "-false")
                    noInp.setAttribute("sub-group", "sub-" + subCode + "-false")
                    noInp.setAttribute("name", "que-" + chItem.code)
                    noInp.id = "que-" + chItem.code+ "-false"
                var noLab = queItemElem.querySelector(".spv-que-yn label:nth-child(4)")
                    noLab.setAttribute("for", "que-" + chItem.code+ "-false")    
            if(chItem.subbab !== ""){
                var parentSub = Elem("spv-subbab-" + subCode)
                parentSub.appendChild(queItemElem)
            } else {
                var parentBab = Elem("bab-container-" + babCode)
                parentBab.appendChild(queItemElem)
            }

        }
    nCekList++
    } 
    progressBar(0,quesFiltered.length)
}
function subBoxShow(elem){
    var parent = elem.parentElement
    var cl = parent.getAttribute("box-group")
    var isActive = parent.classList.contains('active')
    var boxGroupElem = document.querySelectorAll("."+cl) 
    boxGroupElem.forEach((p)=>{
        p.classList.remove("active")
    })
    if(!(isActive)){
        parent.classList.add("active")
        if(Elem(parent.getAttribute("box-for")).querySelector("div:nth-child(1)")){
            Elem(parent.getAttribute("box-for")).querySelector("div:nth-child(1)").classList.add("active")
        }
    }
}
function clickCeklist(elem){
    var isChecked = elem.checked
    var yesnoGroup = elem.getAttribute('name')
    var yesnoGroupElem = document.querySelectorAll("[name='"+yesnoGroup+"']") 
        yesnoGroupElem[0].checked = false
        yesnoGroupElem[1].checked = false
    var level = yesnoGroup.substring(0,3)
    if(!(isChecked)){elem.checked = false} else {elem.checked = true}
    
    // console.log(yesnoGroup)
    if(level == "sub"){
        var quesSubGroupName = elem.id
        var quesSubGroupElem = document.querySelectorAll("[sub-group='"+quesSubGroupName+"']")
        if(!(isChecked)){
            quesSubGroupElem.forEach((p)=>{
                p.checked = false; var event = new Event('change'); p.dispatchEvent(event);
            })
        } else {
            quesSubGroupElem.forEach((p)=>{p.checked = true; var event = new Event('change'); p.dispatchEvent(event);})
        }
    }
    if(level == "bab"){
        var quesBabGroupName = elem.id
        var quesBabGroupElem = document.querySelectorAll("[bab-group='"+quesBabGroupName+"']")
        if(!(isChecked)){
            quesBabGroupElem.forEach((p)=>{
                p.checked = false; var event = new Event('change'); p.dispatchEvent(event);
            })
        } else {
            quesBabGroupElem.forEach((p)=>{p.checked = true; var event = new Event('change'); p.dispatchEvent(event);})
        }
    }
    var nQues = 0; var QuesChecked = {bab:{}, sub:{}, item:{yesChecked: 0, noChecked: 0, allChecked: 0, total: 0}}
    while(nQues < quesFiltered.length){
        var qItem = quesFiltered[nQues]
        var itemBab = qItem.code.substring(4,5)
            if(!(QuesChecked.bab[itemBab])){QuesChecked.bab[itemBab] = {yesChecked: 0, noChecked: 0, allChecked: 0, total: 0}}
            QuesChecked.bab[itemBab].total += 1
            if(Elem("que-"+qItem.code+"-true").checked || Elem("que-"+qItem.code+"-false").checked){
                QuesChecked.bab[itemBab].allChecked += 1
                if(Elem("que-"+qItem.code+"-true").checked){QuesChecked.bab[itemBab].yesChecked += 1}
                if(Elem("que-"+qItem.code+"-false").checked){QuesChecked.bab[itemBab].noChecked += 1}
            }
        if(qItem.subbab !== ""){
            var itemSub = qItem.code.substring(6)
            if(!(QuesChecked.sub[itemSub])){QuesChecked.sub[itemSub] = {yesChecked: 0, noChecked: 0, allChecked: 0, total: 0}}
            QuesChecked.sub[itemSub].total += 1
            if(Elem("que-"+qItem.code+"-true").checked || Elem("que-"+qItem.code+"-false").checked){
                QuesChecked.sub[itemSub].allChecked += 1
                if(Elem("que-"+qItem.code+"-true").checked){QuesChecked.sub[itemSub].yesChecked += 1}
                if(Elem("que-"+qItem.code+"-false").checked){QuesChecked.sub[itemSub].noChecked += 1}
            }
        }
        QuesChecked.item.total += 1
        if(Elem("que-"+qItem.code+"-true").checked || Elem("que-"+qItem.code+"-false").checked){
            QuesChecked.item.allChecked += 1
            if(Elem("que-"+qItem.code+"-true").checked){QuesChecked.item.yesChecked += 1}
            if(Elem("que-"+qItem.code+"-false").checked){QuesChecked.item.noChecked += 1}
        }
    nQues++
    }
    Object.keys(QuesChecked.bab).forEach((p)=>{
        if(level !== "bab"){
            var yesInp = Elem("bab-"+p+"-true")
            var noInp = Elem("bab-"+p+"-false")
            if(QuesChecked.bab[p].yesChecked === QuesChecked.bab[p].total){
                if(QuesChecked.bab[p].yesChecked === 0){yesInp.checked = false}
                if(QuesChecked.bab[p].yesChecked > 0){yesInp.checked = true}
            } else {yesInp.checked = false}
            if(QuesChecked.bab[p].noChecked === QuesChecked.bab[p].total){
                if(QuesChecked.bab[p].noChecked === 0){noInp.checked = false}
                if(QuesChecked.bab[p].noChecked > 0){noInp.checked = true}
            } else {noInp.checked = false}
        }
    })
    Object.keys(QuesChecked.sub).forEach((p)=>{
        if(level !== "bab" && level !== "sub"){
            var yesInp = Elem("sub-"+p+"-true")
            var noInp = Elem("sub-"+p+"-false")
            if(QuesChecked.sub[p].yesChecked === QuesChecked.sub[p].total){
                if(QuesChecked.sub[p].yesChecked === 0){yesInp.checked = false}
                if(QuesChecked.sub[p].yesChecked > 0){yesInp.checked = true}
            } else {yesInp.checked = false}
            if(QuesChecked.sub[p].noChecked === QuesChecked.sub[p].total){
                if(QuesChecked.sub[p].noChecked === 0){noInp.checked = false}
                if(QuesChecked.sub[p].noChecked > 0){noInp.checked = true}
            } else {noInp.checked = false}
        }
    })
    // console.log(QuesChecked)
    progressBar(QuesChecked.item.allChecked, QuesChecked.item.total)
}
function progressBar(checked, total){
    Elem("progress-text").innerHTML = checked.toString() +"/ "+ total.toString()+" checked"
    var progBar = Elem("sup-progress")
    var score = 0
    if(total > 0){score = Math.floor((checked*1)/(total*1)*1000)/10}
    progBar.setAttribute("aria-valuenow", score.toString())
    progBar.querySelector(".progress-bar").style.width = score.toString()+"%"
    progBar.querySelector(".progress-bar").innerHTML = score.toString()+"%" 
}
function UpdateSPVTable(){
    var container = Elem("spv-table-container")
    var shortMonthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    container.innerHTML = ""
    var n = database.spvData.length
    var nData = 0
    while(nData < n){
        var item = database.spvData[nData]
        // console.log(item)
        var itemScore = spvTabScore(item.unit, item.ques)
        var trNew = document.createElement("tr")
        trNew.classList.add("spv-tr")
        trNew.innerHTML =
            "<td class=''>"+
            "    <div style='font-size: 0.6rem;'>"+shortMonthText[item.month]+" "+item.year+"</div>"+
            "    <div class='fw-bold'>"+item.unit+ ((item.subunit == "")?"":(" ("+item.subunit+") "))+ "</div>"+
            "    <div style='font-size: 0.6rem;'>"+database.userList[item.observer]+"</div>"+
            "</td>"+
            "<td class='align-middle'>"+
            "    <div class='text-center' style='font-size: 0.6rem;'>Score: "+itemScore.score+"%</div>"+
            "    <div class='text-center' style='font-size: 0.6rem;'>("+itemScore.checked+"% Checked)</div>"+
            "</td>"+
            "<td class='align-middle spv-edit' onclick='spvDataModif(this,"+item.id+")'><i class='fa-solid fa-pen-to-square'></i></td>"+
            "<td class='align-middle spv-del' onclick='spvDataModif(this,"+item.id+")'><i class='fa-solid fa-trash'></i></td>"
        container.appendChild(trNew)
    nData++
    }
}
function spvTabScore(unit, qObj){
    var yNum = 0; var cNum = 0; var tNum = 0
    var nQues = 0; var quesKey = Object.keys(database.ceklist)
    while(nQues<quesKey.length){
        var qItem = database.ceklist[quesKey[nQues]]
        var unitList = qItem.unitAssign
        if(unitList.indexOf(unit) > -1){
            tNum++
            if(qObj[quesKey[nQues]] !== ""){
                cNum++
                var objItem = qObj[quesKey[nQues]]
                if(objItem){yNum++}
            }
        }  
    nQues++
    }
    var res = {score:0, checked:0}
    if(tNum > 0){
        var s = cNum/tNum
        res.checked = Math.floor(s*1000) / 10
    }
    if(cNum > 0){
        var s = yNum/cNum
        res.score = Math.floor(s*1000) / 10
    }
    return res
}
function spvDataModif(elem, itemID){
    if(elem.classList.contains("spv-edit")){
        spvDataEdit(itemID)
    } else {
        spvDataDel(itemID)
    }
}
function spvDataEdit(itemID){
    if(!(confirm("Melakukan perubahan pada data lama dengan id: " + itemID + " ?"))){return}
    console.log("editing SPV Data .. id: " + itemID)
    var nSearch = 0; var item = {} 
    while(nSearch < database.spvData.length){
        var sea = database.spvData[nSearch]
        if(sea.id*1 === itemID*1){item = sea}
        nSearch++
    }
    if(!(item.id)){return}

    console.log(item)
    SupShow('unitData')
    SupHide('listData')
    Elem("sup-input-id").value = item.id
    Elem("sup-input-id-cont").classList.remove("d-none")
    Elem("sup-input-unit").value = item.unit
    Elem("sup-input-subunit").value = item.subunit
    Elem("sup-input-bulan").value = item.month
    Elem("sup-input-tahun").value = item.year
    unitFilter(item.unit)
    var nItemQues = item.ques
    var queListKey = Object.keys(database.ceklist)
    nLoop = 0;
    while(nLoop < queListKey.length){
        if(database.ceklist[queListKey[nLoop]].unitAssign.indexOf(item.unit) > -1){
            Elem("que-"+database.ceklist[queListKey[nLoop]].code+"-true").checked = false
            Elem("que-"+database.ceklist[queListKey[nLoop]].code+"-false").checked = false
            if(nItemQues[queListKey[nLoop]]!==""){
                if(nItemQues[queListKey[nLoop]]){
                    Elem("que-"+database.ceklist[queListKey[nLoop]].code+"-true").checked = true
                    var event = new Event('change'); Elem("que-"+database.ceklist[queListKey[nLoop]].code+"-true").dispatchEvent(event);
                } else {
                    Elem("que-"+database.ceklist[queListKey[nLoop]].code+"-false").checked = true
                    var event = new Event('change'); Elem("que-"+database.ceklist[queListKey[nLoop]].code+"-false").dispatchEvent(event);
                }
            }
        }
    nLoop++
    }
}
async function spvDataDel(itemID){
    if(confirm("Menghapus data lama dengan id: " + itemID + " ?")){
        spinner(true)
        console.log("API requesting.... ")
        var url = dbAPI + "?" + "req=spvdel&id="+itemID
        console.log(url)
        return
        await fetch(dbAPI + "?" + "req=spvdel&id="+itemID)
                .then(respon => respon.json())
                .then(respon => {
                    if(respon.ok){
                        console.log("Respon: ok...")
                        database.spvData = respon.data;
                        ResetSupervisiPage()
                        spinner(false)
                        Toast("Data berhasil dihapus")
                        console.log(database)
                    }
                })        
    }
}
function spvNewData(){
    if(confirm("Data yang belum disimpan akan terhapus. Lanjutkan membuat input data baru?")){
        ResetSupervisiPage()
        Elem("sup-unitData-btn").click()
    }
}
async function SimpanSupervisi(){
    var SimpanObj = {}
    SimpanObj["observer"] = UserInfo.id
    SimpanObj["unit"] = Elem("sup-input-unit").value
        if(SimpanObj["unit"] == ""){
            alert('Ups.... Unit masih kosong'); 
            SupShow("unitData")
            Elem("sup-input-unit").focus(); 
            return 
        }
    SimpanObj["subunit"] = Elem("sup-input-subunit").value
    SimpanObj["month"] = Elem("sup-input-bulan").value * 1
    SimpanObj["year"] = Elem("sup-input-tahun").value * 1
    SimpanObj["id"] = Elem("sup-input-id").value * 1
    if(quesFiltered.length === 0){
        alert('Ada kesalahan. Mohon diulang');  
        return
    }
    if(Elem("spv-progress-bar").innerHTML == "0%"){
        alert('Ups... Belum ada ceklist yang dinilai');  
        return
    }
    var nQueList = 0
    while(nQueList < quesFiltered.length){
        var code = quesFiltered[nQueList].code 
        var yesInp = Elem("que-"+code+"-true")
        var noInp = Elem("que-"+code+"-false")
        var key = code.substring(0,3)*1
        if(yesInp.checked){SimpanObj[key] = true}
        if(noInp.checked){SimpanObj[key] = false}
    nQueList++
    }

    if(SimpanObj.id === 0){
        if(confirm("Simpan penilaian ceklist supervisi?")){
            spinner(true)
            console.log("API requesting.... ")
            var url = dbAPI + "?" + "req=spvins"
            var nSaveInp = 0; var simpanObjKey = Object.keys(SimpanObj)
            while(nSaveInp < simpanObjKey.length){
                url += "&"+ simpanObjKey[nSaveInp] + "=" + SimpanObj[simpanObjKey[nSaveInp]]
                nSaveInp++
            }
            console.log(url)
        }
    } else if(SimpanObj.id > 0){
        if(confirm("Simpan PERUBAHAN penilaian ceklist supervisi?")){
            spinner(true)
            console.log("API requesting.... ")
            var url = dbAPI + "?" + "req=spvupd"
            var nSaveInp = 0; var simpanObjKey = Object.keys(SimpanObj)
            while(nSaveInp < simpanObjKey.length){
                url += "&"+ simpanObjKey[nSaveInp] + "=" + SimpanObj[simpanObjKey[nSaveInp]]
                nSaveInp++
            }
            console.log(url)
        }
    }
    if(url){
    await fetch(url)
                .then(respon => respon.json())
                .then(respon => {
                    if(respon.ok){
                        console.log("Respon: ok...")
                        database.spvData = respon.data;
                        ResetSupervisiPage()
                        spinner(false)
                        Toast("Data penilaian ceklist berhasil disimpan")
                    }
                })
            }
}