var quesFiltered = []
function ResetSupervisiPage(){
    console.log("ResetSupervisiPage...")
    var today = new Date()
    Elem("sup-input-unit").value = ""; checklistFilter('')
    Elem("sup-input-bulan").value = today.getMonth() + 1
    Elem("sup-input-tahun").value = today.getFullYear()
    Elem("sup-input-id").value = ""
    Elem("sup-input-id-cont").classList.add("d-none")
    progressBar(0, 0)
    // hhFilterPreset()
    // hhTableFilterShort = hhTableFilterShortDefault
    UpdateSPVTable()
    InputWithList()

    checklistFilter(val)

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
function checklistFilter(val){
    // return
    
    var cekList = Object.values(database.ceklist)
    var cekListContainer = Elem("checklistQueContainer"); cekListContainer.innerHTML = ""
    var nCekList = 0; nItemAssign = 1
    quesFiltered = []
    if(val == ""){return}
    
    while(nCekList < cekList.length){
        var chItem = cekList[nCekList]
        var queText = chItem.text
        var bab = chItem.bab
        var sub = chItem.subbab
        var units = chItem.unitAssign
        console.log(units)
        if(units.indexOf(val) > -1){
            quesFiltered.push(chItem)
            console.log(chItem)
            var qBox = Elem("sup-que-item-box-example").cloneNode(true)
                qBox.id = "qBox-" + chItem.code
                qBox.querySelector(".sup-que-item-text").innerHTML = "<span>"+nItemAssign+". </span>"+queText
                var yesBoxLabel = qBox.querySelector(".sup-que-item-yesno > div:nth-child(1) > label")
                    yesBoxLabel.setAttribute("for", "que-"+chItem.code+"-true")
                    yesBoxLabel.querySelector("input").setAttribute("name", "que-"+chItem.code)
                    yesBoxLabel.querySelector("input").setAttribute("sub-group", "sub-"+chItem.code.substring(6)+"-true")
                    yesBoxLabel.querySelector("input").setAttribute("bab-group", "bab-"+chItem.code.substring(4,5)+"-true")
                    yesBoxLabel.querySelector("input").id = "que-"+chItem.code+"-true"
                var noBoxLabel = qBox.querySelector(".sup-que-item-yesno > div:nth-child(2) > label")
                    noBoxLabel.setAttribute("for", "que-"+chItem.code+"-false")
                    noBoxLabel.querySelector("input").setAttribute("name", "que-"+chItem.code)
                    noBoxLabel.querySelector("input").setAttribute("sub-group", "sub-"+chItem.code.substring(6)+"-false")
                    noBoxLabel.querySelector("input").setAttribute("bab-group", "bab-"+chItem.code.substring(4,5)+"-false")
                    noBoxLabel.querySelector("input").id = "que-"+chItem.code+"-false"
            if(sub!==""){
                if(!(Elem("sup-subbab-box-" + chItem.code.substring(6)))){
                    var subbabHead = Elem("sup-subbab-example").cloneNode(true)
                        subbabHead.querySelector(".sup-q-subbab-title > div").innerHTML = "<span>"+chItem.code.substring(6)+". </span>"+sub
                        subbabHead.setAttribute("box-for", "sup-subbab-box-" + chItem.code.substring(6))
                        if(nItemAssign === 1){subbabHead.classList.add('active')}
                        var subYesBoxLabel = subbabHead.querySelector(".sup-que-item-yesno > div:nth-child(1) > label")
                            subYesBoxLabel.setAttribute("for", "sub-"+chItem.code.substring(6)+"-true")
                            subYesBoxLabel.querySelector("input").setAttribute("name", "sub-"+chItem.code.substring(6))
                            subYesBoxLabel.querySelector("input").setAttribute("bab-group", "bab-"+chItem.code.substring(4,5)+"-true")
                            subYesBoxLabel.querySelector("input").id = "sub-"+chItem.code.substring(6)+"-true"
                        var subNoBoxLabel = subbabHead.querySelector(".sup-que-item-yesno > div:nth-child(2) > label")
                            subNoBoxLabel.setAttribute("for", "sub-"+chItem.code.substring(6)+"-false")
                            subNoBoxLabel.querySelector("input").setAttribute("name", "sub-"+chItem.code.substring(6))
                            subNoBoxLabel.querySelector("input").setAttribute("bab-group", "bab-"+chItem.code.substring(4,5)+"-false")
                            subNoBoxLabel.querySelector("input").id = "sub-"+chItem.code.substring(6)+"-false"
                    var subbabBox = Elem("sup-subbab-box-example").cloneNode(true)
                        subbabBox.id = "sup-subbab-box-" + chItem.code.substring(6)
                    
                    if(!(Elem("sup-bab-"+chItem.code.substring(4,5)))){
                        var babHead = Elem("sup-bab-example").cloneNode(true)
                            babHead.id = "sup-bab"+chItem.code.substring(4,5)
                            babHead.querySelector(".sup-bab-title > div").innerHTML = "<span>"+chItem.code.substring(4,5)+". </span>" + bab
                        babHead.setAttribute("box-for", "sup-bab-"+chItem.code.substring(4,5))
                        if(nItemAssign === 1){babHead.classList.add('active')}
                        var babYesBoxLabel = babHead.querySelector(".sup-que-item-yesno > div:nth-child(1) > label")
                            babYesBoxLabel.setAttribute("for", "bab-"+chItem.code.substring(4,5)+"-true")
                            babYesBoxLabel.querySelector("input").setAttribute("name", "bab-"+chItem.code.substring(4,5))
                            // babYesBoxLabel.querySelector("input").setAttribute("bab-group", "bab-"+chItem.code.substring(4,5)+"-true")
                            babYesBoxLabel.querySelector("input").id = "bab-"+chItem.code.substring(4,5)+"-true"
                            // babYesBoxLabel.querySelector("input").setAttribute("YNgroup-value", "true")
                        var babNoBoxLabel = babHead.querySelector(".sup-que-item-yesno > div:nth-child(2) > label")
                            babNoBoxLabel.setAttribute("for", "bab-"+chItem.code.substring(4,5)+"-false")
                            babNoBoxLabel.querySelector("input").setAttribute("name", "bab-"+chItem.code.substring(4,5))
                            babNoBoxLabel.querySelector("input").id = "bab-"+chItem.code.substring(4,5)+"-false" 
                        var babBox = Elem("sup-bab-box-example").cloneNode(true)
                            babBox.id = "sup-bab-"+chItem.code.substring(4,5)

                        cekListContainer.appendChild(babHead)
                        cekListContainer.appendChild(babBox)        
                    }
                    Elem("sup-bab-"+chItem.code.substring(4,5)).appendChild(subbabHead)
                    Elem("sup-bab-"+chItem.code.substring(4,5)).appendChild(subbabBox)
                }
                var subbabParent = Elem("sup-subbab-box-" + chItem.code.substring(6))
                subbabParent.appendChild(qBox)
            } 
            else {
                if(!(Elem("sup-bab-"+chItem.code.substring(4,5)))){
                    var babHead = Elem("sup-bab-example").cloneNode(true)
                        babHead.id = "sup-bab"+chItem.code.substring(4,5)
                        babHead.querySelector(".sup-bab-title > div").innerHTML = "<span>"+chItem.code.substring(4,5)+". </span>" + bab
                    babHead.setAttribute("box-for", "sup-bab-"+chItem.code.substring(4,5))
                    if(nItemAssign === 1){babHead.classList.add('active')}
                    var babYesBoxLabel = babHead.querySelector(".sup-que-item-yesno > div:nth-child(1) > label")
                        babYesBoxLabel.setAttribute("for", "bab-"+chItem.code.substring(4,5)+"-true")
                        babYesBoxLabel.querySelector("input").setAttribute("name", "bab-"+chItem.code.substring(4,5))
                        // babYesBoxLabel.querySelector("input").setAttribute("bab-group", "bab-"+chItem.code.substring(4,5)+"-true")
                        babYesBoxLabel.querySelector("input").id = "bab-"+chItem.code.substring(4,5)+"-true"
                        // babYesBoxLabel.querySelector("input").setAttribute("YNgroup-value", "true")
                    var babNoBoxLabel = babHead.querySelector(".sup-que-item-yesno > div:nth-child(2) > label")
                        babNoBoxLabel.setAttribute("for", "bab-"+chItem.code.substring(4,5)+"-false")
                        babNoBoxLabel.querySelector("input").setAttribute("name", "bab-"+chItem.code.substring(4,5))
                        babNoBoxLabel.querySelector("input").id = "bab-"+chItem.code.substring(4,5)+"-false" 
                    var babBox = Elem("sup-bab-box-example").cloneNode(true)
                        babBox.id = "sup-bab-"+chItem.code.substring(4,5)

                    cekListContainer.appendChild(babHead)
                    cekListContainer.appendChild(babBox) 
                }
                Elem("sup-bab-"+chItem.code.substring(4,5)).appendChild(qBox)
            }
        nItemAssign++
        }
    nCekList++
    } 
    // console.log(quesFiltered)
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
    checklistFilter(item.unit)
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
function spvDataDel(itemID){
    if(!(confirm("Menghapus data lama dengan id: " + itemID + " ?"))){return}

}
function spvNewData(){
    if(confirm("Data yang belum disimpan akan terhapus. Lanjutkan membuat input data baru?")){
        ResetSupervisiPage()
    }
}