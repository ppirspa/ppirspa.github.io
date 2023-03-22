var resumeFilter = {
    hh: {}
}
var resumeFilterHHDefault = {
    month : (new Date()).getMonth(),
    year : (new Date()).getFullYear(),
    group: "All",
    unit: "All",
    by: "Moment",
    top: "1-0"
}
var resumeHHData = {
    chart: {}, table: {}
} 
function ResetResume_HH(){
    console.log("ResetResume_HH")
    var today = new Date()
    Elem("resume-filter-hh-bulan").value = today.getMonth()
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
    // spinner(true)
    updateResume_HH_Data()
    updateResume_HH_Title()
    updateResume_HH_Chart()
    updateResume_HH_Table()
    // spinner(false)
}

function updateResume_HH_Data(){
    var momentAxes = ['M1', 'M2', 'M3', 'M4', 'M5', 'Total']
    var momentAxes2 = ['M1', 'M2', 'M3', 'M4', 'M5']
    var profesiAxes = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain", "Total"]
    var momentList = ['mo1', 'mo2', 'mo3', 'mo4', 'mo5', 'total']
    var momentList2 = ['mo1', 'mo2', 'mo3', 'mo4', 'mo5']
    var profesiList = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain", "All"]
    var profesiList2 = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain"]
    var color = {serial:["#a62b2b", "#0d7d4b", "#ae7828", "#6a1c96", "#6b7914", "#210cdd"], total:"#210cdd",increase:["#f49191","#d45858","#a62b2b"]}
    var shortMonthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    
    var iData = 0; var len = database.hhData.length
    var box1 = {}
    while(iData < len){
        var item = database.hhData[iData]

        var month = shortMonthText[item.month] + " " + item.year*1
        // resumeHHData.byMonth[]
        iData++
    }


    if(resumeFilter.hh.by == "Moment"){
        resumeHHData.chart["chart1"] = {
            labels : momentAxes,
            barColor: [color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.serial[0], color.total]
        }    
    } else {
        resumeHHData.chart["chart1"] = {
            labels : profesiAxes,
            barColor: [color.serial[0], color.serial[0], color.serial[0], color.serial[0], color.total]
        }
    }
    resumeHHData.chart["chart1"] = {
        datasetData : loopData.chart1.datasetData,    
    }

    return
    resumeHHData.chart["chart1"] = {
        labels : resumeFilter.hh.by == "Moment" ? momentAxes : profesiAxes ,
        datasetData : resumeFilter.hh.by == "Moment" ? momentList.map((p)=>{
            return hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, resumeFilter.hh.group, resumeFilter.hh.unit)[p].score
        }) : profesiList.map((p)=>{
            return hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, p, resumeFilter.hh.unit).total.score
        }),
        barColor: resumeFilter.hh.by == "Moment" ? [color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.serial[0], color.total] : [color.serial[0], color.serial[0], color.serial[0], color.serial[0], color.total]
    }
    resumeHHData.chart["chart2"] = {
        labels : resumeFilter.hh.by == "Moment" ? momentAxes : profesiList2,
        datasetData : resumeFilter.hh.by == "Moment" ? profesiList2.map((p)=>{
            var item = {
                label : p,
                data : momentList.map((q)=>{return hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, p, resumeFilter.hh.unit)[q].score}),
                backgroundColor: color.serial[profesiList2.indexOf(p)]
            }
            return item
        }) : momentList.map((p)=>{
            var item = {
                label : p,
                data : profesiList2.map((q)=>{return hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, q, resumeFilter.hh.unit)[p].score}),
                backgroundColor: color.serial[momentList.indexOf(p)]
            }
            return item
        })
    }
    var maxMonth = Math.max(...database.hhData.map((p)=>{
        var mo = (p.month.toString().length === 1) ? "0" + p.month.toString() : p.month.toString()
        var n = p.year.toString() + mo 
        return n * 1
    }))
    var d2 = new Date(maxMonth.toString().substring(0,4) * 1, (maxMonth.toString().substring(4) * 1) - 1, 01); var d1 = new Date(2022, 3, 01)
    var monthList = getMonthSequenceList(d1, d2).map((p)=>{
        var n = {
            month: p.getMonth() + 1,
            year: p.getFullYear()
        }
        return n
    })  
    resumeHHData.chart["chart3"] = {
        labels: monthList.map((p)=>{
            return shortMonthText[p.month] + " " + p.year
        }),
        data : monthList.map((p)=>{
            var s = hhDataFilter(p.month, p.year, resumeFilter.hh.group, resumeFilter.hh.unit).total.score
            return s
        })  
    }
    var threeMonth = {
        2: {month: resumeFilter.hh.month, year: resumeFilter.hh.year},
        1: {
            month: resumeFilter.hh.month - 1 + (resumeFilter.hh.month < 2 ? 12 : 0),
            year: resumeFilter.hh.year - 1 + (resumeFilter.hh.month < 2 ? 0 : 1)
        },
        0: {
            month: resumeFilter.hh.month - 2 + (resumeFilter.hh.month < 3 ? 12 : 0),
            year: resumeFilter.hh.year - 1 + (resumeFilter.hh.month < 3 ? 0 : 1)
        }
    }
    resumeHHData.chart["chart4"] = {
        labels : resumeFilter.hh.by == "Moment" ? momentAxes : profesiList,
        datasetData : resumeFilter.hh.by == "Moment" ? Object.keys(threeMonth).map((p)=>{
            var item = {
                label : shortMonthText[threeMonth[p].month] + " " + threeMonth[p].year,
                data : momentList.map((q)=>{return hhDataFilter(threeMonth[p].month, threeMonth[p].year, resumeFilter.hh.group, resumeFilter.hh.unit)[q].score}),
                backgroundColor: color.increase[p]
            }
            return item
        }) : Object.keys(threeMonth).map((p)=>{
            var item = {
                label : shortMonthText[threeMonth[p].month] + " " + threeMonth[p].year,
                data : profesiList.map((q)=>{return hhDataFilter(threeMonth[p].month, threeMonth[p].year, q, resumeFilter.hh.unit).total.score}),
                backgroundColor: color.increase[p]
            }
            return item
        })
    }
    resumeHHData.table["table1"] = resumeFilter.hh.by == "Moment" ? {
        header: [""].concat(momentAxes), 
        act: momentList.map((p)=>{
            return hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, resumeFilter.hh.group, resumeFilter.hh.unit)[p].act
        }),
        opp: momentList.map((p)=>{
            return hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, resumeFilter.hh.group, resumeFilter.hh.unit)[p].opp
        }),
        score: [""].concat(momentList.map((p)=>{
            var s =  hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, resumeFilter.hh.group, resumeFilter.hh.unit)[p].score
            return (Math.floor(s*1000) / 10) + "%"
        }))
    } : {
        header: [""].concat(profesiAxes), 
        act: profesiList.map((p)=>{
            return hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, p, resumeFilter.hh.unit).total.act
        }),
        opp: profesiList.map((p)=>{
            return hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, p, resumeFilter.hh.unit).total.opp
        }),
        score: [""].concat(profesiList.map((p)=>{
            var s = hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, p, resumeFilter.hh.unit).total.score
            return (Math.floor(s*1000) / 10) + "%"
        }))
    }
    resumeHHData.table["table2"] = resumeFilter.hh.by == "Moment" ? {
        header: [""].concat(momentAxes), 
        body: profesiList2.map((p)=>{
            var row = [p].concat(momentList.map((q)=>{
                var s = hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, p, resumeFilter.hh.unit)[q].score
                return (Math.floor(s*1000) / 10) + "%"
            }))
            return row
        }),
        footer: []
    } : {
        header: [""].concat(profesiList2), 
        body: momentAxes2.map((p)=>{
            var row = [p].concat(profesiList2.map((q)=>{
                var s = hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, q, resumeFilter.hh.unit)[momentList2[momentAxes2.indexOf(p)]].score
                return (Math.floor(s*1000) / 10) + "%"
            }))
            return row
        }),
        footer: ["Total"].concat(profesiList2.map((q)=>{
            var s = hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, q, resumeFilter.hh.unit).total.score
            return (Math.floor(s*1000) / 10) + "%"
        }))
    }
    resumeHHData.table["table4"] = resumeFilter.hh.by == "Moment" ? {
        header: [""].concat(Object.keys(threeMonth).map((p)=>{
            return shortMonthText[threeMonth[p].month] + " " + threeMonth[p].year
        })), 
        body: momentList2.map((p)=>{
            var row = [momentAxes2[momentList2.indexOf(p)]]
                    .concat(Object.keys(threeMonth).map((q)=>{
                        var s = hhDataFilter(threeMonth[q].month, threeMonth[q].year, resumeFilter.hh.group, resumeFilter.hh.unit)[p].score
                        return (Math.floor(s*1000) / 10) + "%"
                    }))
            return row
        }),
        footer: ["Total"]
                .concat(Object.keys(threeMonth).map((q)=>{
                    var s = hhDataFilter(threeMonth[q].month, threeMonth[q].year, resumeFilter.hh.group, resumeFilter.hh.unit).total.score
                    return (Math.floor(s*1000) / 10) + "%"
                }))
    } : {
        header: [""].concat(Object.keys(threeMonth).map((p)=>{
            return shortMonthText[threeMonth[p].month] + " " + threeMonth[p].year
        })), 
        body: profesiList2.map((p)=>{
            var row = [p]
                    .concat(Object.keys(threeMonth).map((q)=>{
                        var s = hhDataFilter(threeMonth[q].month, threeMonth[q].year, p, resumeFilter.hh.unit).total.score
                        return (Math.floor(s*1000) / 10) + "%"
                    }))
            return row
        }),
        footer: ["Total"]
                .concat(Object.keys(threeMonth).map((q)=>{
                    var s = hhDataFilter(threeMonth[q].month, threeMonth[q].year, "All", resumeFilter.hh.unit).total.score
                    return (Math.floor(s*1000) / 10) + "%"
                }))
    }
    var tab5Grouping_byUnit = {}
    database.hhData.filter((p)=>{
        return (p.month*1 === resumeFilter.hh.month*1) && (p.year*1 === resumeFilter.hh.year*1)
    }).forEach((q)=>{
        tab5Grouping_byUnit[q.unit] = {
            unitName: q.unit,
            n: database.hhData.filter((p)=>{
                return (p.unit == q.unit) &&(p.month*1 === resumeFilter.hh.month*1) && (p.year*1 === resumeFilter.hh.year*1)
            }).length,
            HHScore: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).total.score,
            mo1: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).mo1.score,
            mo2: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).mo2.score,
            mo3: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).mo3.score,
            mo4: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).mo4.score,
            mo5: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).mo5.score,
            Dokter: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "Dokter", q.unit).total.score,
            "Perawat Bidan": hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "Perawat Bidan", q.unit).total.score,
            "Magang Siswa": hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "Magang Siswa", q.unit).total.score,
            "Lain-lain": hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "Lain-lain", q.unit).total.score,
        }
    })
    resumeHHData.table["table5"] = Object.values(tab5Grouping_byUnit)
    .sort((a,b)=>{
        if(resumeFilter.hh.top == "1-0"){return b.HHScore - a.HHScore} else {return a.HHScore - b.HHScore}
    })
    // console.log(Object.values(tab5Grouping_byUnit))
    console.log(resumeHHData)
}
function hhDataFilter(month, year, group, unit){
    var monthText = {
        1:"Januari", 2:"Februari", 3:"Maret", 4:"April", 5:"Mei", 6:"Juni", 
        7:"Juli", 8:"Agustus", 9:"September", 10:"Oktober", 11:"November", 12:"Desember"
    }
    var result = {
        mo1:{act:0, opp: 0, score: ""},mo2:{act:0, opp: 0, score: ""},mo3:{act:0, opp: 0, score: ""},mo4:{act:0, opp: 0, score: ""},mo5:{act:0, opp: 0, score: ""},
        total:{act:0, opp: 0, score: ""},
        monthShort: monthText[month].substring(0,3) + " " + year,
        monthLong: monthText[month] + " " + year
    }
    var totAct = 0; totOpp = 0; totScore = "";
    for(var i = 1; i<6; i++){
        var act = 0; var opp = 0; var score = ""
        act = database.hhData.filter((p)=>{
            var groupTrue = true;
            var unitTrue = true;
            if(group !== "All"){groupTrue = (p.group == group)}
            if(unit !== "All"){unitTrue = (p.unit == unit)}
            return (p["mo"+i]) && (p.month*1 == month*1) && (p.year*1 == year*1) && groupTrue && unitTrue
        }).length
        opp = database.hhData.filter((p)=>{
            var groupTrue = true;
            var unitTrue = true;
            if(group !== "All"){groupTrue = (p.group == group)}
            if(unit !== "All"){unitTrue = (p.unit == unit)}
            return (p["mo"+i] !== "") && (p.month*1 == month*1) && (p.year*1 == year*1) && groupTrue && unitTrue
        }).length
        totAct += act; totOpp += opp
        if(opp > 0){score = toDec(act/opp, 3)}
        result["mo"+i].act = act
        result["mo"+i].opp = opp
        result["mo"+i].score = score
    }
    if(totOpp>0){totScore = toDec(totAct/totOpp, 3)}
    result["total"].act = totAct
    result["total"].opp = totOpp
    result["total"].score = totScore
    return result
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
    document.querySelector("#res-hh-title-3 p:nth-child(2)").innerHTML = groupText + unitText
    document.querySelector("#res-hh-title-4 p:nth-child(1)").innerHTML = "Kepatuhan Hand Hygiene 3 Bulan Per " + resumeFilter.hh.by
    document.querySelector("#res-hh-title-4 p:nth-child(2)").innerHTML = groupText + unitText + " | Bulan " + monthText[resumeFilter.hh.month * 1] + " " + (resumeFilter.hh.year * 1)
    document.querySelector("#res-hh-title-5 p:nth-child(1)").innerHTML = "TOP 10 " + (resumeFilter.hh.top == "1-0" ? "Tertinggi" : "Terendah") + " Kepatuhan Hand Hygiene Pada Unit";
    document.querySelector("#res-hh-title-5 p:nth-child(2)").innerHTML = "Bulan " + monthText[resumeFilter.hh.month * 1] + " " + (resumeFilter.hh.year * 1)
}
function updateResume_HH_Chart(){
    var shortMonthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    var canva1 = document.createElement("canvas");
    var canva2 = document.createElement("canvas");
    var canva3 = document.createElement("canvas");
    var canva4 = document.createElement("canvas")

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
    Elem("res-hh-canvas-1").innerHTML = ""
    Elem("res-hh-canvas-1").appendChild(canva1)
    
    return
    new Chart(canva2, {
        type: 'bar',
        data: {
            labels: resumeHHData.chart.chart2.labels,
            datasets: resumeHHData.chart.chart2.datasetData
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {title: {display: true,padding: {top: 10}},legend: {display: true, position: "bottom"},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    new Chart(canva3, {
        type: 'line',
        data: {
            labels: resumeHHData.chart.chart3.labels,
            datasets: [{
                data: resumeHHData.chart.chart3.data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 10}}}},
            plugins: {title: {display: true,padding: {top: 10}},legend: {display: false},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10) + '%';},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    new Chart(canva4, {
        type: 'bar',
        data: {
            labels: resumeHHData.chart.chart4.labels,
            datasets: resumeHHData.chart.chart4.datasetData
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return (Math.floor(value*1000)/10) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {tooltip:{callback: function(value) {return Math.floor(value*100) + '%'}},title: {display: true,padding: {top: 10}},legend: {display: true, position: "bottom"},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })

    Elem("res-hh-canvas-2").innerHTML = ""
    Elem("res-hh-canvas-2").appendChild(canva2)
    Elem("res-hh-canvas-3").innerHTML = ""
    Elem("res-hh-canvas-3").appendChild(canva3)
    Elem("res-hh-canvas-4").innerHTML = ""
    Elem("res-hh-canvas-4").appendChild(canva4)
    var maxLongMonth = 13
    if(resumeHHData.chart.chart3.labels.length>maxLongMonth){
        Elem("res-hh-canvas-3").style.width = (resumeHHData.chart.chart3.labels.length/maxLongMonth*900)  +"px"
    }
    var scrollMonthIndex =  resumeHHData.chart.chart3.labels.indexOf(
        shortMonthText[resumeFilter.hh.month] + " " + resumeFilter.hh.year   
    )
    var x = scrollMonthIndex

    if(scrollMonthIndex<0){
        var scrollMonth = Elem("res-hh-canvas-3").offsetWidth  
    } else {
        scrollMonth = ((x * 1) - 4 )  / resumeHHData.chart.chart3.labels.length * (Elem("res-hh-canvas-3").offsetWidth * 1) 
    }
    Elem("res-hh-canvas-3-parent").scrollTo(scrollMonth,0)
}
function updateResume_HH_Table(){
    var table1 = Elem("tab-res-hh-1")    
        tab1Head = table1.querySelector("thead tr")    
        tab1Head.innerHTML = ""
        resumeHHData.table["table1"].header.forEach((p)=>{
            var thNew = document.createElement("th")
            thNew.setAttribute("scope", "col")
            thNew.innerHTML = p
            tab1Head.appendChild(thNew)
        })
        tab1Body = table1.querySelector("tbody")
        tab1Body.innerHTML = ""
        var tab1BodyRow = ["Act", "Opp"]
        tab1BodyRow.forEach((p)=>{
            var trNew = document.createElement("tr")
            var th = document.createElement("th")
                th.setAttribute("scope", "row")
                th.innerHTML = p
            trNew.appendChild(th)
            for(var i = 1; i < resumeHHData.table["table1"].header.length; i++){
                var td = document.createElement("td")
                td.innerHTML = resumeHHData.table["table1"][p.toLowerCase()][i-1]
                trNew.appendChild(td)
            }
            table1.querySelector("tbody").appendChild(trNew)
        })
        tab1Foot = table1.querySelector("tfoot tr")    
        tab1Foot.innerHTML = ""
        resumeHHData.table["table1"].score.forEach((p)=>{
            var thNew = document.createElement("th")
            thNew.setAttribute("scope", "col")
            thNew.innerHTML = p
            tab1Foot.appendChild(thNew)
        })
    var table2 = Elem("tab-res-hh-2")
        tab2Head = table2.querySelector("thead tr")    
        tab2Head.innerHTML = ""
        resumeHHData.table["table2"].header.forEach((p)=>{
            var thNew = document.createElement("th")
            thNew.setAttribute("scope", "col")
            thNew.innerHTML = p
            tab2Head.appendChild(thNew)
        })
        tab2Body = table2.querySelector("tbody")
        tab2Body.innerHTML = ""
        resumeHHData.table["table2"].body.forEach((p)=>{
            var tr = document.createElement("tr")
            var th = document.createElement("th")
            th.innerHTML = p[0]; th.setAttribute("scope", "row")
            tr.appendChild(th)
            for(var i = 1; i<p.length;i++){
                if(resumeHHData.table["table2"].header[i] == "Total"){
                    var t = document.createElement("th")
                    t.setAttribute("scope", "row")
                }else {
                    var t = document.createElement("td")
                }
                t.innerHTML = p[i]
                tr.appendChild(t)
            }
            tab2Body.appendChild(tr)
        })
        tab2Foot = table2.querySelector("tfoot tr")
        tab2Foot.innerHTML = ""
        if(resumeHHData.table["table2"].footer.length > 0){
            resumeHHData.table["table2"].footer.forEach((p)=>{
                var thNew = document.createElement("th")
                thNew.setAttribute("scope", "col")
                thNew.innerHTML = p
                tab2Foot.appendChild(thNew)
            })
        }
    var table4 = Elem("tab-res-hh-4")
        tab4Head = table4.querySelector("thead tr")    
        tab4Head.innerHTML = ""
        resumeHHData.table["table4"].header.forEach((p)=>{
            var thNew = document.createElement("th")
            thNew.setAttribute("scope", "col")
            thNew.innerHTML = p
            tab4Head.appendChild(thNew)
        })
        tab4Body = table4.querySelector("tbody")
        tab4Body.innerHTML = ""
        resumeHHData.table["table4"].body.forEach((p)=>{
            var tr = document.createElement("tr")
            var th = document.createElement("th")
            th.innerHTML = p[0]; th.setAttribute("scope", "row")
            tr.appendChild(th)
            for(var i = 1; i<p.length;i++){
                if(resumeHHData.table["table4"].header[i] == "Total"){
                    var t = document.createElement("th")
                    t.setAttribute("scope", "row")
                }else {
                    var t = document.createElement("td")
                }
                t.innerHTML = p[i]
                tr.appendChild(t)
            }
            tab4Body.appendChild(tr)
        })
        tab4Foot = table4.querySelector("tfoot tr")
        tab4Foot.innerHTML = ""
        if(resumeHHData.table["table4"].footer.length > 0){
            resumeHHData.table["table4"].footer.forEach((p)=>{
                var thNew = document.createElement("th")
                thNew.setAttribute("scope", "col")
                thNew.innerHTML = p
                tab4Foot.appendChild(thNew)
            })
        }
    var table5 = Elem("tab-res-hh-5")
    var table5Body = table5.querySelector("tbody")
        table5Body.innerHTML = ""
        if(resumeHHData.table["table5"].length > 0){  
            for(var i = 0; i<10;i++){
                var tr = document.createElement("tr")
                var td1 = document.createElement("td")
                    td1.innerHTML = i+1; 
                    tr.appendChild(td1)
                var td2 = document.createElement("td")
                    td2.innerHTML =  Math.floor(resumeHHData.table["table5"][i].HHScore*1000)/10 + "%" ;
                    tr.appendChild(td2)
                var td3 = document.createElement("td")
                    td3.innerHTML = resumeHHData.table["table5"][i].unitName; tr.appendChild(td3)
                var td4 = document.createElement("td")
                    td4.innerHTML = resumeHHData.table["table5"][i].n; tr.appendChild(td4)
                var tdDok = document.createElement("td"); tdDok.innerHTML = resumeHHData.table["table5"][i]["Dokter"]; tdDok.classList.add("d-none"); tdDok.classList.add("res-hh-tab-group"); tr.appendChild(tdDok)    
                var tdPer = document.createElement("td"); tdPer.innerHTML = resumeHHData.table["table5"][i]["Perawat Bidan"]; tdPer.classList.add("d-none"); tdPer.classList.add("res-hh-tab-group"); tr.appendChild(tdPer)
                var tdMag = document.createElement("td"); tdMag.innerHTML = resumeHHData.table["table5"][i]["Magang Siswa"]; tdMag.classList.add("d-none"); tdMag.classList.add("res-hh-tab-group"); tr.appendChild(tdMag)
                var tdLai = document.createElement("td"); tdLai.innerHTML = resumeHHData.table["table5"][i]["Lain-lain"]; tdLai.classList.add("d-none"); tdLai.classList.add("res-hh-tab-group"); tr.appendChild(tdLai)
                for(var j = 1; j<6; j++){var td = document.createElement("td"); td.innerHTML = resumeHHData.table["table5"][i]["mo"+j]; ; td.classList.add("d-none"); td.classList.add("res-hh-tab-moment"); tr.appendChild(td) }
                table5Body.appendChild(tr)
            }
        }
}
function tab5show(elem){
    var cla = elem.getAttribute("tab5")
    document.querySelectorAll("." + cla).forEach((p)=>{
        p.classList.add("d-none")
        if(elem.checked){p.classList.remove("d-none")}
    })
}