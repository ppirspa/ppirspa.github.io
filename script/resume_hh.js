var resumeFilter = {
    hh: {}
}
var resumeFilterHHDefault = {
    month : (new Date()).getMonth() + 1,
    year : (new Date()).getFullYear(),
    group: "All",
    unit: "All",
    by: "Moment"
}
var resumeHHData = {
    chart: {}, table: {}
} 
function ResetResume_HH(){
    console.log("ResetResume_HH")
    var today = new Date()
    Elem("resume-filter-hh-bulan").value = today.getMonth() + 1
    Elem("resume-filter-hh-tahun").value = today.getFullYear()
    var filterHHUnit = Elem("resume-filter-hh-unit")
        filterHHUnit.innerHTML = ""
        var firstOpt = Elem("resume-filter-hh-unit-first").cloneNode(true)
        filterHHUnit.appendChild(firstOpt)
        for(var i = 0; i < database.unitData.length; i++){
            var opt = document.createElement("option")
            opt.value = database.unitData[i].name
            opt.innerHTML = database.unitData[i].name
            filterHHUnit.appendChild(opt)
        }
    resumeFilter.hh = resumeFilterHHDefault
    updateResume_HH()
}
function updateResume_HH(){
    updateResume_HH_Data()
    updateResume_HH_Title()
    updateResume_HH_Chart()
    updateResume_HH_Table()
    console.log(resumeFilter.hh)
}
function updateResume_HH_Data(){
    var monthText = {
        1:"Januari", 2:"Februari", 3:"Maret", 4:"April", 5:"Mei", 6:"Juni", 
        7:"Juli", 8:"Agustus", 9:"September", 10:"Oktober", 11:"November", 12:"Desember"
    }
    var hhData = database.hhData
    resumeHHData.moData = {
        min0 : {},
        min1 : {},
        min2 : {}
    }

    for(var j = 0; j < 3; j++){
        var temp = {}
        var m = (resumeFilter.hh.month * 1) - j
        var totOpp = 0
        var totAct = 0
        var totScore = ""

        temp["byMoment"] = {
            chartDataset : [],
            act: [],
            opp: [],
            total: []
        } 
        for(var i = 1; i < 6; i++){
            var opp = database.hhData.filter((p)=>{
                return ((p["mo"+i] !== "") && (filterData(p, m)))
            }).length
            var act = database.hhData.filter((p)=>{
                return ((p["mo"+i]) && (filterData(p, m)))
            }).length
            var score = ""
            if(opp > 0){var score = toDec(act/opp, 3)}  
            temp["mo" + i] = {
                opp : opp,
                act : act,
                score : score
            }
            totOpp += opp
            totAct += act
            
        }
        resumeHHData.moData["min"+j] = temp
    }

    if(resumeFilter.hh.by == "Moment"){
        // var datasetData =  [0.8, 0.86, 0.99, 0.78, 0.8, 0.952]
    } else {
        // var datasetData = [0.8, 0.86, 0.99, 0.78, 0.8, 0.952]
    }
    resumeHHData.chart["chart1"] = {
        labels : ['M1', 'M2', 'M3', 'M4', 'M5', 'Total'],
        datasetData : [0.8, 0.86, 0.99, 0.78, 0.8, 0.952], 
        barColor: ['rgba(166, 43, 43, 1)', 'rgba(166, 43, 43, 1)', 'rgba(166, 43, 43, 1)', 'rgba(166, 43, 43, 1)', 'rgba(166, 43, 43, 1)', 'rgba(33, 12, 221, 1)']
    }
    
    // resumeHHData
    console.log(resumeHHData)
}

function updateResume_HH_Title(){
    var monthText = {
        1:"Januari", 2:"Februari", 3:"Maret", 4:"April", 5:"Mei", 6:"Juni", 
        7:"Juli", 8:"Agustus", 9:"September", 10:"Oktober", 11:"November", 12:"Desember"
    }
    if(resumeFilter.hh.unit == "All"){var unitText = "Semua Unit"}
    else{var unitText = "Unit " + resumeFilter.hh.unit}
    if(resumeFilter.hh.by == "Profesi"){
        var groupText = ""
    }
    else{
        if(resumeFilter.hh.group == "All"){var groupText = "Semua Kelompok Profesi | "}
        else{var groupText = "Kelompok " + resumeFilter.hh.group + " | "}
    }
    
    document.querySelector("#res-hh-title-1 p:nth-child(1)").innerHTML = "Kepatuhan Hand Hygiene Per " + resumeFilter.hh.by
    document.querySelector("#res-hh-title-1 p:nth-child(2)").innerHTML = groupText + unitText + " | Bulan " + monthText[resumeFilter.hh.month * 1] + " " + (resumeFilter.hh.year * 1) 
    document.querySelector("#res-hh-title-2 p:nth-child(2)").innerHTML = unitText + " | Bulan " + monthText[resumeFilter.hh.month * 1] + " " + (resumeFilter.hh.year * 1)
}
function updateResume_HH_Chart(){
    var shortMonthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    var canva1 = document.createElement("canvas");
    var canva2 = document.createElement("canvas");
    var canva3 = document.createElement("canvas");

    Chart.register(ChartDataLabels)
    new Chart(canva1, {
        type: 'bar',
        data: {
            labels: resumeHHData.chart.chart1.labels,
            datasets: [{
                data: resumeHHData.chart.chart1.datasetData,
                borderWidth: 1,
                backgroundColor: resumeHHData.chart.chart1.barColor
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {title: {display: true,padding: {top: 10}},legend: {display: false},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    new Chart(canva2, {
        type: 'bar',
        data: {
            labels: resumeHHData.chart.chart1.labels,
            datasets: [
                {
                    label: 'Dokter',
                    data: [0.8, 0.86, 0.99, 0.78, 0.8, 0.952],
                    backgroundColor: 'rgba(166, 43, 43, 1)'
                },
                {
                    label: 'Perawat Bidan',
                    data: [0.9, 0.9, 1, , 0.67, 0.952],
                    backgroundColor: 'rgba(0, 0, 255, 1)'
                },
                {
                    label: 'Megang Siswa',
                    data: [0.9, 0.9, 1, , 0.67, 0.952],
                    backgroundColor: 'rgba(0, 128, 0, 1)'
                },
                {
                    label: 'Lain-lain',
                    data: [0.9, 0.9, 1, , 0.67, 0.952],
                    backgroundColor: 'rgba(229, 209, 33, 1)'
                },
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {title: {display: true,padding: {top: 10}},legend: {display: false},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    
    var d2 = new Date(resumeFilter.hh.year, resumeFilter.hh.month - 1, 01)
    var d1 = new Date(d2.getFullYear()-1, d2.getMonth(), 01)
    console.log(d2)
    console.log(d1)
    
    var monthList = getMonthSequenceList(d1, d2).map((p)=>{
        return shortMonthText[p.getMonth() + 1] + " " + p.getFullYear()
    })  
    console.log(monthList)

    new Chart(canva3, {
        type: 'line',
        data: {
            labels: monthList,
            datasets: [{
                label: 'My First Dataset',
                data: [0.65, 0.59, 0.80, 0.81, 0.56, 0.55, 0.40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {title: {display: true,padding: {top: 10}},legend: {display: false},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })

     
    // div1.appendChild(canva1)
    Elem("res-hh-canvas-1").innerHTML = ""
    Elem("res-hh-canvas-1").appendChild(canva1)
    Elem("res-hh-canvas-2").innerHTML = ""
    Elem("res-hh-canvas-2").appendChild(canva2)
    Elem("res-hh-canvas-3").innerHTML = ""
    Elem("res-hh-canvas-3").appendChild(canva3)
}
function updateResume_HH_Table(){
    document.querySelectorAll(".res-hh-thead").forEach((p)=>{p.classList.add("d-none")})
    document.querySelectorAll(".thead-" + resumeFilter.hh.by).forEach((p)=>{p.classList.remove("d-none")})
}
