resumeSPVData = {data: {}, chart:{chart1:{datasets:[]}}, table:{}}

function ResetResume_SPV(){
    console.log("ResetResume_SPV")
    var today = new Date()
    Elem("resume-filter-spv-bulan").value = today.getMonth() 
    Elem("resume-filter-spv-tahun").value = today.getFullYear() 
    var filterSPVUnit = Elem("resume-filter-spv-unit")
        filterSPVUnit.innerHTML = ""
        var firstOpt = Elem("resume-filter-spv-unit-first").cloneNode(true)
        filterSPVUnit.appendChild(firstOpt)
        for(var i = 0; i < database.unitData.length; i++){
            var opt = document.createElement("option")
            opt.value = database.unitData[i].name
            opt.innerHTML = database.unitData[i].name
            filterSPVUnit.appendChild(opt)
        }
    var resumeFilterSPVDefault = {
        month : Elem("resume-filter-hh-bulan").value*1,
        year : Elem("resume-filter-hh-tahun").value*1,
        unit: "All"
    }
    resumeFilter.spv = resumeFilterSPVDefault
    updateResume_SPV_data()
    updateResume_spv_byFilter()
}
function updateResume_SPV_data(){
    resumeSPVData.data = {}
    var iData = 0
    while(iData<database.spvData.length){
        var item = database.spvData[iData]
        var mo = item.year.toString() + ((item.month.toString().length === 1) ? ("0" + item.month.toString()):(item.month.toString()))
        if(!(resumeSPVData.data[mo])){
            resumeSPVData.data[mo] = {All : {}}
            Object.keys(database.superBab).forEach((p)=>{
                resumeSPVData.data[mo].All[p] = {num: 0, denum: 0, score: ""}
            })
        }
        var unit = item.unit
        if(!(resumeSPVData.data[mo][unit])){
            resumeSPVData.data[mo][unit] = {}
            Object.keys(database.superBab).forEach((p)=>{
                resumeSPVData.data[mo][unit][p] = {num: 0, denum: 0, score: ""}
            })
        }
        var queObj = item.ques; var nQue = 0
        while(nQue < Object.keys(queObj).length){
            var numkey = Object.keys(queObj)[nQue]
            var queObjItem = queObj[numkey]
            var babCode = database.ceklist[numkey].code.substring(4,5)
            if(queObjItem !== ""){
                resumeSPVData.data[mo].All[babCode].denum++
                resumeSPVData.data[mo][unit][babCode].denum++
                if(queObjItem){
                    resumeSPVData.data[mo].All[babCode].num++
                    resumeSPVData.data[mo][unit][babCode].num++
                }
                if(resumeSPVData.data[mo].All[babCode].denum>0){
                    resumeSPVData.data[mo].All[babCode].score = resumeSPVData.data[mo].All[babCode].num / resumeSPVData.data[mo].All[babCode].denum
                }
                if(resumeSPVData.data[mo][unit][babCode].denum>0){
                    resumeSPVData.data[mo][unit][babCode].score = resumeSPVData.data[mo][unit][babCode].num / resumeSPVData.data[mo][unit][babCode].denum
                }
            }
        nQue++
        }

    iData++
    }
    console.log(resumeSPVData)
}
function updateResume_spv_byFilter(){
    // spinner(true)
    updateResume_spv_Pra()
    updateResume_spv_Title()
    updateResume_spv_Chart()
    updateResume_spv_Table()
}
function updateResume_spv_Title(){
    var monthText = {
        1:"Januari", 2:"Februari", 3:"Maret", 4:"April", 5:"Mei", 6:"Juni", 
        7:"Juli", 8:"Agustus", 9:"September", 10:"Oktober", 11:"November", 12:"Desember"
    }
    if(resumeFilter.spv.unit == "All"){var unitText = "Semua Unit"}
    else{var unitText = "Unit " + resumeFilter.spv.unit}
    document.querySelector("#res-spv-title-1 > p:nth-child(2)").innerHTML = unitText+" | Bulan "+monthText[resumeFilter.spv.month]+" "+resumeFilter.spv.year
    document.querySelector("#res-spv-title-2 > p:nth-child(2)").innerHTML = unitText+" | Bulan "+monthText[resumeFilter.spv.month]+" "+resumeFilter.spv.year
    document.querySelector("#res-spv-title-3 > p:nth-child(2)").innerHTML = unitText+" | Bulan "+monthText[resumeFilter.spv.month]+" "+resumeFilter.spv.year
}
function updateResume_spv_Pra(){
    var pra = {data:["","","","","","","","","","","",""]}
    var shortMonthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    var monInit = resumeFilter.spv.month * 1
    var yeaInit = resumeFilter.spv.year * 1
    var babKeys = Object.keys(database.superBab)
    resumeSPVData.chart.chart1.datasets = []
    
    for(var nMo = 2; nMo>=0; nMo--){
        var moGroup = monInit - nMo
        var yearGroup = yeaInit
        if(monInit === 2 && nMo === 2){moGroup+=12; yearGroup -= 1}
        if(monInit === 1 && nMo === 1){moGroup+=12; yearGroup -= 1}
        if(monInit === 1 && nMo === 2){moGroup+=12; yearGroup -= 1}
        var moYear = (yearGroup.toString() + ((moGroup.toString().length === 1) ? ("0" + moGroup.toString()):(moGroup.toString()))) * 1
        console.log(moYear) 
        var dataItem = {label: shortMonthText[moGroup] + " " + yearGroup, data:[], backgroundColor: color.serial[nMo]}
        var nBab = 0;
        while(nBab < babKeys.length){
            if(resumeSPVData.data[moYear]){
                if(resumeSPVData.data[moYear][resumeFilter.spv.unit]){
                    var key = babKeys[nBab]
                    var score = resumeSPVData.data[moYear][resumeFilter.spv.unit][key].score
                    dataItem.data.push(score)
                }
                else {
                    dataItem.data.push(".")    
                }
            }
            else{
                dataItem.data.push(".")        
            }
        nBab++
        }
        resumeSPVData.chart.chart1.datasets.push(dataItem)
    }

}
function updateResume_spv_Chart(){
    var canva1 = document.createElement("canvas");
    var canva2 = document.createElement("canvas")
    Chart.register(ChartDataLabels)

    new Chart(canva1, {
        type: 'bar',
        data: {
            labels: Object.values(database.superBab),
            datasets: resumeSPVData.chart.chart1.datasets
        },
        options: {
            indexAxis: 'y',
            maintainAspectRatio: false,
            scale:{
                x:{
                    beginAtZero: true, min: 0,max: 1, 
                    ticks: {stepSize: 0.25, font:{size: 8}, format: {style: 'percent'}}
                },
            },
            plugins: {
                tooltip:{
                    enabled:true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            } 
                            if(context.parsed.y !== null) {
                                label += (Math.floor(context.parsed.x*1000)/10) + "%";
                            };
                            return label;
                        }
                    }
                },
                title: {
                    display: true,
                    padding: {top: 10},
                    text:""
                },
                legend: {
                    display: true
                },
                datalabels: {
                    formatter: function(value, context) {return (Math.floor(value*1000) / 10);},
                    color: 'white',
                    anchor: 'center',
                    align: 'end',
                    offset: 1,
                    font:{size: 9}
                }
            }
        }
    })
    Elem("res-spv-canvas-1").innerHTML = ""
    Elem("res-spv-canvas-1").appendChild(canva1)

    new Chart(canva2, {
        type: 'bar',
        data: {
            labels: Object.values(database.superBab),
            datasets: resumeSPVData.chart.chart1.datasets
        },
        options: {
            indexAxis: 'x',
            maintainAspectRatio: false,
            scale:{
                y:{
                    beginAtZero: true, min: 0,max: 1, 
                    ticks: {stepSize: 0.25, font:{size: 8}, format: {style: 'percent'}}
                },
                x:{
                    ticks:{
                        font:{size: 10},
                        align: "center",
                        labelOffset: 10
                    },
                    type: 'category',
                }
            },
            plugins: {
                tooltip:{
                    enabled:true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            } 
                            if(context.parsed.y !== null) {
                                label += (Math.floor(context.parsed.x*1000)/10) + "%";
                            };
                            return label;
                        }
                    }
                },
                title: {
                    display: true,
                    padding: {top: 10},
                    text:""
                },
                legend: {
                    display: true
                },
                datalabels: {
                    formatter: function(value, context) {return (Math.floor(value*1000) / 10);},
                    color: 'white',
                    anchor: 'center',
                    align: 'end',
                    offset: 1,
                    font:{size: 9}
                }
            }
        }
    })
    Elem("res-spv-canvas-2").innerHTML = ""
    Elem("res-spv-canvas-2").appendChild(canva2)

}
function updateResume_spv_Table(){
    var monInit = resumeFilter.spv.month * 1
    var yeaInit = resumeFilter.spv.year * 1
    var babKeys = Object.keys(database.superBab)
    var table = Elem("tab-res-spv-1")
    var tBody = table.querySelector("tbody")
    tBody.innerHTML = ""
    
    var moYear = (resumeFilter.spv.year.toString() + ((resumeFilter.spv.month.toString().length === 1) ? ("0" + resumeFilter.spv.month.toString()):(resumeFilter.spv.month.toString()))) * 1
    var nBab = 0; 
    while(nBab<babKeys.length){
        key = babKeys[nBab]
        var score = "-"
        if(resumeSPVData.data[moYear]){
            if(resumeSPVData.data[moYear][resumeFilter.spv.unit]){
                var s = resumeSPVData.data[moYear][resumeFilter.spv.unit][key].score
                if(s !== ""){
                    score = (Math.floor(s*1000)/10) + " %"
                } else {
                    score = "-"
                }
            }
        }
        tBody.innerHTML += 
            "<tr>"+
                "<td style='text-align: start; font-size: 0.9rem' onclick='spvBabDetail(this)' id='spv-table-tr-"+key+"'>"+database.superBab[key]+"</td>"+
                "<td>"+score+"</td>"+
            "</tr>"
    nBab++
    }
}
function spvBabDetail(elem){
    var bab = elem.id.substring(13)
    var modalBoxBody = Elem("spv-detail-modal-body")
    modalBoxBody.querySelector("div:nth-child(1)").innerHTML = "Bab: " + database.superBab[bab]
    var modalBoxBodyApend = Elem("spv-detail-modal-body-append")
    modalBoxBodyApend.innerHTML = ""
    var queCek = []; var nQueCek = 0; var queCekKeys = Object.keys(database.ceklist)
    var preObj = {sub:{}, que:{}}
    
    while(nQueCek < queCekKeys.length){
        var key = queCekKeys[nQueCek]
        var queItem = database.ceklist[key]
        var babQueItem = queItem.code.substring(4,5)
        var subKey = queItem.code.substring(6)
        var subText = queItem.subbab
        var unitAssign = queItem.unitAssign
        if(resumeFilter.spv.unit == "All"){var unitBoelan1 = true} 
        else {var unitBoelan1 = (unitAssign.indexOf(resumeFilter.spv.unit) > -1)}
        if(bab == babQueItem && unitBoelan1){
            queCek.push(key)
            preObj.que[key] = {num:0, denum:0, score:"", sub:""}
            if(!(preObj.sub[subKey]) && subText !== ""){
                preObj.sub[subKey] = subText
            }
            if(subText !== ""){
                preObj.que[key].sub = subKey
            }
        } 
        
    nQueCek++
    }
    
    var nPre = 0
    while(nPre < database.spvData.length){
        item = database.spvData[nPre]
        if(resumeFilter.spv.unit == "All"){var unitBoelan = true} 
        else {var unitBoelan = item.unit == resumeFilter.spv.unit}
        if(item.month*1 == resumeFilter.spv.month*1 && item.year*1 == resumeFilter.spv.year*1 && unitBoelan){
            var checkedQuesList = item.ques
            for(var nQueCek2 = 0; nQueCek2 < queCek.length; nQueCek2++ ){
                var key2 = queCek[nQueCek2]
                var checkedQues = checkedQuesList[key2]

                if(checkedQues !== ""){
                    preObj.que[key2].denum++
                    if(checkedQues){preObj.que[key2].num++}
                }
                if(preObj.que[key2].denum > 0){
                    preObj.que[key2].score = Math.floor(preObj.que[key2].num / preObj.que[key2].denum * 1000) / 10
                }
            }
        }

    nPre++
    }

    var preObjSubKey = Object.keys(preObj.sub)
    if(preObjSubKey.length > 0){
        for(var i = 0; i < preObjSubKey.length; i++){
            modalBoxBodyApend.innerHTML += 
                "<div class='spv-det-row-sub' id='spv-det-row-"+preObjSubKey[i]+"'>"+
                    "<div>"+
                        (i+1) + ". " + preObj.sub[preObjSubKey[i]] +
                    "</div>"+
                "</div>"
        }
    }
    var preObjQueKey = Object.keys(preObj.que)
    if(preObjQueKey.length > 0){
        for(var i = 0; i < preObjQueKey.length; i++){
            var score = preObj.que[preObjQueKey[i]].score
            if(score !== "" && score !== 0){
                var scoreText = score + "%";
                var scoreNum = score/100;
            } else {
                if(preObj.que[preObjQueKey[i]].denum > 0){
                    var scoreText = "0%";
                } else {
                    var scoreText = "-";
                }
                var scoreNum = 0;
            }
            var bgColor = "green"
            if(score >= 90 ){bgColor = "green"}
            if(score >= 70 && score < 90){bgColor = "yellow"}
            if(score < 70 ){bgColor = "red"}
            var divString =
                    "<div class='spv-det-row-que' id='spv-det-row-que-"+preObjQueKey[i]+"'>"+
                    "    <div>"+database.ceklist[preObjQueKey[i]].text+"</div>"+
                    "    <div>"+preObj.que[preObjQueKey[i]].denum+"</div>"+
                    "    <div>"+
                    "        <div style='width: calc(60px * "+scoreNum.toString()+"); background-color: "+bgColor+"; '>1</div>"+
                    "        <div>"+scoreText+"</div>"+
                    "    </div>"+
                    "</div>"
            var parent = Elem("spv-det-row-"+preObj.que[preObjQueKey[i]].sub)
            if(parent){parent.innerHTML += divString}
            else {
                modalBoxBodyApend.innerHTML += divString
            }
        }
    }
    
    
Elem("spv-detail-btn").click()
}