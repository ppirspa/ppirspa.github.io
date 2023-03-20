var resumeFilter = {
    hh: {}
}

var resumeHHData = {
    chart: {}, table: {}, monthList:[]
} 
function ResetResume_HH(){
    console.log("ResetResume_HH")
    var today = new Date()
    var shortMonthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    var iData = 0; var len = database.hhData.length; var monthDataObj = {}
    while(iData < len){
        var item = database.hhData[iData]
        var month = shortMonthText[item.month] + " " + item.year*1
        monthDataObj[(item.year.toString() + (item.month.toString().length == 1 ? ("0" + item.month.toString()) : item.month.toString())) * 1] = month
        iData++
    }
    resumeHHData.monthList = Object.values(monthDataObj)
    
    var monthValueTemp = resumeHHData.monthList
    Elem("resume-filter-hh-bulan").value = Object.keys(monthDataObj)[Object.values(monthDataObj).indexOf(monthValueTemp.pop())].substring(4) * 1
    Elem("resume-filter-hh-tahun").value = Object.keys(monthDataObj)[Object.values(monthDataObj).indexOf(monthValueTemp.pop())].substring(0,4) * 1

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
    var resumeFilterHHDefault = {
        month : Elem("resume-filter-hh-bulan").value,
        year : Elem("resume-filter-hh-tahun").value,
        group: "All",
        unit: "All",
        by: "Moment",
        top: "1-0"
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
    var momentList2 = ['mo1', 'mo2', 'mo3', 'mo4', 'mo5']; var momentList2Len = momentList2.length
    var profesiList = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain", "All"]; var profesiListLen = profesiList.length
    var profesiList2 = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain"]; var profesiList2Len = profesiList2.length
    var color = {serial:["#a62b2b", "#0d7d4b", "#ae7828", "#6a1c96", "#6b7914", "#210cdd"], total:"#210cdd",increase:["#f49191","#d45858","#a62b2b"]}
    var shortMonthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    var iData = 0; var len = database.hhData.length; var dataFilter1 = []
    var grouping1 = {
        Dokter: {n:0,mo1:{act:0,opp:0,score:["",""]},mo2:{act:0,opp:0,score:["",""]},mo3:{act:0,opp:0,score:["",""]},mo4:{act:0,opp:0,score:["",""]},mo5:{act:0,opp:0,score:["",""]},total:{act:0,opp:0,score:["",""]}},
        "Perawat Bidan":{n:0,mo1:{act:0,opp:0,score:["",""]},mo2:{act:0,opp:0,score:["",""]},mo3:{act:0,opp:0,score:["",""]},mo4:{act:0,opp:0,score:["",""]},mo5:{act:0,opp:0,score:["",""]},total:{act:0,opp:0,score:["",""]}},
        "Magang Siswa":{n:0,mo1:{act:0,opp:0,score:["",""]},mo2:{act:0,opp:0,score:["",""]},mo3:{act:0,opp:0,score:["",""]},mo4:{act:0,opp:0,score:["",""]},mo5:{act:0,opp:0,score:["",""]},total:{act:0,opp:0,score:["",""]}},
        "Lain-lain":{n:0,mo1:{act:0,opp:0,score:["",""]},mo2:{act:0,opp:0,score:["",""]},mo3:{act:0,opp:0,score:["",""]},mo4:{act:0,opp:0,score:["",""]},mo5:{act:0,opp:0,score:["",""]},total:{act:0,opp:0,score:["",""]}},
        "All":{n:0,mo1:{act:0,opp:0,score:["",""]},mo2:{act:0,opp:0,score:["",""]},mo3:{act:0,opp:0,score:["",""]},mo4:{act:0,opp:0,score:["",""]},mo5:{act:0,opp:0,score:["",""]},total:{act:0,opp:0,score:["",""]}}
    } 
    var grouping3 = {data:[], monthValue:{}, monthListObj:{}}

    while(iData < len){
        var item = database.hhData[iData]
        var itemMonthGroup = shortMonthText[item.month*1] + " " + item.year
        grouping3.monthListObj[itemMonthGroup] = ""
        var nProfesi = 0
        while(nProfesi < profesiListLen){
            var profesi = profesiList[nProfesi]
            if((item.month*1 === resumeFilter.hh.month*1) && (item.year*1 === resumeFilter.hh.year*1) && ((profesi == "All") ? (item.group !== "") : (item.group == profesi)) && ((resumeFilter.hh.unit == "All") ? (item.unit !== "") : (item.unit == resumeFilter.hh.unit))){
                grouping1[profesi].n += 1
                var nMo = 1
                while(nMo < momentList2Len + 1){
                    if(item["mo"+nMo] !== ""){
                        grouping1[profesi]["mo"+nMo].opp += 1
                        grouping1[profesi]["total"].opp += 1     
                        if(item["mo"+nMo]){
                            grouping1[profesi]["mo"+nMo].act += 1
                            grouping1[profesi]["total"].act += 1
                        }
                    }
                    if(grouping1[profesi]["mo"+nMo].opp > 0){
                        var sMo = grouping1[profesi]["mo"+nMo].act / grouping1[profesi]["mo"+nMo].opp
                        grouping1[profesi]["mo"+nMo].score[0] = sMo
                        grouping1[profesi]["mo"+nMo].score[1] = (Math.floor(sMo*1000) / 10) + "%"
                    }
                    if(grouping1[profesi]["total"].opp > 0){
                        var sTot = grouping1[profesi]["total"].act / grouping1[profesi]["total"].opp
                        grouping1[profesi]["total"].score[0] = sTot
                        grouping1[profesi]["total"].score[1] = (Math.floor(sTot*1000) / 10) + "%"
                    } 
                nMo++
                }
                
            }        
        nProfesi++
        }
        if(!(grouping3.monthValue[itemMonthGroup])){
            grouping3.monthValue[itemMonthGroup] = {act: 0, opp: 0}
        }
        if(((resumeFilter.hh.group == "All") ? (item.group !== "") : (item.group == resumeFilter.hh.group)) && ((resumeFilter.hh.unit == "All") ? (item.unit !== "") : (item.unit == resumeFilter.hh.unit))){
            var nMo5 = 1;
            while(nMo5 < 6){
                if(item["mo"+nMo5]){grouping3.monthValue[itemMonthGroup].act += 1}
                if(item["mo"+nMo5] !== ""){grouping3.monthValue[itemMonthGroup].opp += 1}
            nMo5++    
            }
        }

        iData++
    }
    

    if(resumeFilter.hh.by == "Moment"){
        resumeHHData.chart["chart1"] = {
            labels : momentAxes,
            barColor: [color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.serial[0], color.total],
            datasetData : [grouping1[resumeFilter.hh.group]["mo1"].score[0],grouping1[resumeFilter.hh.group]["mo2"].score[0],grouping1[resumeFilter.hh.group]["mo3"].score[0],grouping1[resumeFilter.hh.group]["mo4"].score[0],grouping1[resumeFilter.hh.group]["mo5"].score[0],grouping1[resumeFilter.hh.group]["total"].score[0]],
        };
        resumeHHData.table["table1"] = [
            [""].concat(momentAxes),
            ["nSubyek","","","","","",grouping1[resumeFilter.hh.group].n],
            ['Act',grouping1[resumeFilter.hh.group]["mo1"].act,grouping1[resumeFilter.hh.group]["mo2"].act,grouping1[resumeFilter.hh.group]["mo3"].act,grouping1[resumeFilter.hh.group]["mo4"].act,grouping1[resumeFilter.hh.group]["mo5"].act,grouping1[resumeFilter.hh.group]["total"].act],
            ['Opp',grouping1[resumeFilter.hh.group]["mo1"].opp,grouping1[resumeFilter.hh.group]["mo2"].opp,grouping1[resumeFilter.hh.group]["mo3"].opp,grouping1[resumeFilter.hh.group]["mo4"].opp,grouping1[resumeFilter.hh.group]["mo5"].opp,grouping1[resumeFilter.hh.group]["total"].opp],
            ['',grouping1[resumeFilter.hh.group]["mo1"].score[1],grouping1[resumeFilter.hh.group]["mo2"].score[1],grouping1[resumeFilter.hh.group]["mo3"].score[1],grouping1[resumeFilter.hh.group]["mo4"].score[1],grouping1[resumeFilter.hh.group]["mo5"].score[1],grouping1[resumeFilter.hh.group]["total"].score[1]]
        ];
        resumeHHData.chart["chart2"] = {
            labels : momentAxes,
            datasetData: [
                {label : "Dokter",backgroundColor: color.serial[0], data:[grouping1["Dokter"]["mo1"].score[0],grouping1["Dokter"]["mo2"].score[0],grouping1["Dokter"]["mo3"].score[0],grouping1["Dokter"]["mo4"].score[0],grouping1["Dokter"]["mo5"].score[0],grouping1["Dokter"]["total"].score[0]]},
                {label : "Perawat Bidan",backgroundColor: color.serial[1], data:[grouping1["Perawat Bidan"]["mo1"].score[0],grouping1["Perawat Bidan"]["mo2"].score[0],grouping1["Perawat Bidan"]["mo3"].score[0],grouping1["Perawat Bidan"]["mo4"].score[0],grouping1["Perawat Bidan"]["mo5"].score[0],grouping1["Perawat Bidan"]["total"].score[0]]},
                {label : "Magang Siswa",backgroundColor: color.serial[2], data:[grouping1["Magang Siswa"]["mo1"].score[0],grouping1["Magang Siswa"]["mo2"].score[0],grouping1["Magang Siswa"]["mo3"].score[0],grouping1["Magang Siswa"]["mo4"].score[0],grouping1["Magang Siswa"]["mo5"].score[0],grouping1["Magang Siswa"]["total"].score[0]]},
                {label : "Lain-lain",backgroundColor: color.serial[3], data:[grouping1["Lain-lain"]["mo1"].score[0],grouping1["Lain-lain"]["mo2"].score[0],grouping1["Lain-lain"]["mo3"].score[0],grouping1["Lain-lain"]["mo4"].score[0],grouping1["Lain-lain"]["mo5"].score[0],grouping1["Lain-lain"]["total"].score[0]]},
            ]
        }
        resumeHHData.table["table2"] = [
            ["", "n"].concat(momentAxes),
            ["Dokter", grouping1["Dokter"].n, grouping1["Dokter"]["mo1"].score[1],grouping1["Dokter"]["mo2"].score[1],grouping1["Dokter"]["mo3"].score[1],grouping1["Dokter"]["mo4"].score[1],grouping1["Dokter"]["mo5"].score[1],grouping1["Dokter"]["total"].score[1]],
            ["Perawat Bidan", grouping1["Perawat Bidan"].n,grouping1["Perawat Bidan"]["mo1"].score[1],grouping1["Perawat Bidan"]["mo2"].score[1],grouping1["Perawat Bidan"]["mo3"].score[1],grouping1["Perawat Bidan"]["mo4"].score[1],grouping1["Perawat Bidan"]["mo5"].score[1],grouping1["Perawat Bidan"]["total"].score[1]],
            ["Magang Siswa", grouping1["Magang Siswa"].n, grouping1["Magang Siswa"]["mo1"].score[1],grouping1["Magang Siswa"]["mo2"].score[1],grouping1["Magang Siswa"]["mo3"].score[1],grouping1["Magang Siswa"]["mo4"].score[1],grouping1["Magang Siswa"]["mo5"].score[1],grouping1["Magang Siswa"]["total"].score[1]],
            ["Lain-lain", grouping1["Lain-lain"].n, grouping1["Lain-lain"]["mo1"].score[1],grouping1["Lain-lain"]["mo2"].score[1],grouping1["Lain-lain"]["mo3"].score[1],grouping1["Lain-lain"]["mo4"].score[1],grouping1["Lain-lain"]["mo5"].score[1],grouping1["Lain-lain"]["total"].score[1]]
        ];
    } else {
        resumeHHData.chart["chart1"] = {
            labels : profesiAxes,
            barColor: [color.serial[0], color.serial[0], color.serial[0], color.serial[0], color.total],
            datasetData:[grouping1["Dokter"].total.score[0],grouping1["Perawat Bidan"].total.score[0],grouping1["Magang Siswa"].total.score[0],grouping1["Lain-lain"].total.score[0],grouping1["All"].total.score[0]]
        };
        resumeHHData.table["table1"] = [
            [""].concat(profesiAxes),
            ["nSubyek",grouping1["Dokter"].n,grouping1["Perawat Bidan"].n,grouping1["Magang Siswa"].n,grouping1["Lain-lain"].n,grouping1["All"].n],
            ['Act',grouping1["Dokter"].total.act,grouping1["Perawat Bidan"].total.act,grouping1["Magang Siswa"].total.act,grouping1["Lain-lain"].total.act,grouping1["All"].total.act],
            ['Opp',grouping1["Dokter"].total.opp,grouping1["Perawat Bidan"].total.opp,grouping1["Magang Siswa"].total.opp,grouping1["Lain-lain"].total.opp,grouping1["All"].total.opp],
            ['',grouping1["Dokter"].total.score[1],grouping1["Perawat Bidan"].total.score[1],grouping1["Magang Siswa"].total.score[1],grouping1["Lain-lain"].total.score[1],grouping1["All"].total.score[1]],
        ];
        resumeHHData.chart["chart2"] = {
            labels : profesiList2,
            datasetData:[
                {label : "M1",backgroundColor: color.serial[0], data:[grouping1["Dokter"]["mo1"].score[0],grouping1["Perawat Bidan"]["mo1"].score[0],grouping1["Magang Siswa"]["mo1"].score[0],grouping1["Lain-lain"]["mo1"].score[0]]},
                {label : "M2",backgroundColor: color.serial[1], data:[grouping1["Dokter"]["mo2"].score[0],grouping1["Perawat Bidan"]["mo2"].score[0],grouping1["Magang Siswa"]["mo2"].score[0],grouping1["Lain-lain"]["mo2"].score[0]]},
                {label : "M3",backgroundColor: color.serial[2], data:[grouping1["Dokter"]["mo3"].score[0],grouping1["Perawat Bidan"]["mo3"].score[0],grouping1["Magang Siswa"]["mo3"].score[0],grouping1["Lain-lain"]["mo3"].score[0]]},
                {label : "M4",backgroundColor: color.serial[3], data:[grouping1["Dokter"]["mo4"].score[0],grouping1["Perawat Bidan"]["mo4"].score[0],grouping1["Magang Siswa"]["mo4"].score[0],grouping1["Lain-lain"]["mo4"].score[0]]},
                {label : "M5",backgroundColor: color.serial[4], data:[grouping1["Dokter"]["mo5"].score[0],grouping1["Perawat Bidan"]["mo5"].score[0],grouping1["Magang Siswa"]["mo5"].score[0],grouping1["Lain-lain"]["mo5"].score[0]]},
                {label : "Total",backgroundColor: color.total, data:[grouping1["Dokter"]["total"].score[0],grouping1["Perawat Bidan"]["total"].score[0],grouping1["Magang Siswa"]["total"].score[0],grouping1["Lain-lain"]["total"].score[0]]}
            ] 
        };
        resumeHHData.table["table2"] = [
            [""].concat(profesiList2),
            ["nSubyek", grouping1["Dokter"].n, grouping1["Perawat Bidan"].n, grouping1["Magang Siswa"].n, grouping1["Lain-lain"].n],
            ["M1", grouping1["Dokter"]["mo1"].score[1],grouping1["Perawat Bidan"]["mo1"].score[1],grouping1["Magang Siswa"]["mo1"].score[1],grouping1["Lain-lain"]["mo1"].score[1]],
            ["M2", grouping1["Dokter"]["mo2"].score[1],grouping1["Perawat Bidan"]["mo2"].score[1],grouping1["Magang Siswa"]["mo2"].score[1],grouping1["Lain-lain"]["mo2"].score[1]],
            ["M3", grouping1["Dokter"]["mo3"].score[1],grouping1["Perawat Bidan"]["mo3"].score[1],grouping1["Magang Siswa"]["mo3"].score[1],grouping1["Lain-lain"]["mo3"].score[1]],
            ["M4", grouping1["Dokter"]["mo4"].score[1],grouping1["Perawat Bidan"]["mo4"].score[1],grouping1["Magang Siswa"]["mo4"].score[1],grouping1["Lain-lain"]["mo4"].score[1]],
            ["M5", grouping1["Dokter"]["mo5"].score[1],grouping1["Perawat Bidan"]["mo5"].score[1],grouping1["Magang Siswa"]["mo5"].score[1],grouping1["Lain-lain"]["mo5"].score[1]],
            ["Total",grouping1["Dokter"]["total"].score[1],grouping1["Perawat Bidan"]["total"].score[1],grouping1["Magang Siswa"]["total"].score[1],grouping1["Lain-lain"]["total"].score[1]]
        ];
    }
    var monthList = Object.keys(grouping3.monthListObj)
    // console.log(monthList)
    var nMonthList = 0; var nMonthListLen = monthList.length; grouping3.data = []
    while(nMonthList < nMonthListLen){
        // console.log(resumeHHData.monthList[nMonthList])
        var act = 0; var opp = 0; var score = ""
        act = grouping3.monthValue[monthList[nMonthList]].act
        opp = grouping3.monthValue[monthList[nMonthList]].opp
        if(opp > 0){
            score = act/opp
        }
        console.log("score:"+score)
        grouping3.data.push(score)
    nMonthList++
    }
    
    console.log(grouping3)

    resumeHHData.chart["chart3"] = {
        labels: monthList,
        data : grouping3.data  
    }
    // var maxMonth = Math.max(...database.hhData.map((p)=>{
    //     var mo = (p.month.toString().length === 1) ? "0" + p.month.toString() : p.month.toString()
    //     var n = p.year.toString() + mo 
    //     return n * 1
    // }))
    // var d2 = new Date(maxMonth.toString().substring(0,4) * 1, (maxMonth.toString().substring(4) * 1) - 1, 01); var d1 = new Date(2022, 3, 01)
    // var monthList = getMonthSequenceList(d1, d2).map((p)=>{
    //     var n = {
    //         month: p.getMonth() + 1,
    //         year: p.getFullYear()
    //     }
    //     return n
    // })  
    


    // var threeMonth = {
    //     2: {month: resumeFilter.hh.month, year: resumeFilter.hh.year},
    //     1: {
    //         month: resumeFilter.hh.month - 1 + (resumeFilter.hh.month < 2 ? 12 : 0),
    //         year: resumeFilter.hh.year - 1 + (resumeFilter.hh.month < 2 ? 0 : 1)
    //     },
    //     0: {
    //         month: resumeFilter.hh.month - 2 + (resumeFilter.hh.month < 3 ? 12 : 0),
    //         year: resumeFilter.hh.year - 1 + (resumeFilter.hh.month < 3 ? 0 : 1)
    //     }
    // }
    // resumeHHData.chart["chart4"] = {
    //     labels : resumeFilter.hh.by == "Moment" ? momentAxes : profesiList,
    //     datasetData : resumeFilter.hh.by == "Moment" ? Object.keys(threeMonth).map((p)=>{
    //         var item = {
    //             label : shortMonthText[threeMonth[p].month] + " " + threeMonth[p].year,
    //             data : momentList.map((q)=>{return hhDataFilter(threeMonth[p].month, threeMonth[p].year, resumeFilter.hh.group, resumeFilter.hh.unit)[q].score}),
    //             backgroundColor: color.increase[p]
    //         }
    //         return item
    //     }) : Object.keys(threeMonth).map((p)=>{
    //         var item = {
    //             label : shortMonthText[threeMonth[p].month] + " " + threeMonth[p].year,
    //             data : profesiList.map((q)=>{return hhDataFilter(threeMonth[p].month, threeMonth[p].year, q, resumeFilter.hh.unit).total.score}),
    //             backgroundColor: color.increase[p]
    //         }
    //         return item
    //     })
    // }
    
    // resumeHHData.table["table2"] = resumeFilter.hh.by == "Moment" ? {
    //     header: [""].concat(momentAxes), 
    //     body: profesiList2.map((p)=>{
    //         var row = [p].concat(momentList.map((q)=>{
    //             var s = hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, p, resumeFilter.hh.unit)[q].score
    //             return (Math.floor(s*1000) / 10) + "%"
    //         }))
    //         return row
    //     }),
    //     footer: []
    // } : {
    //     header: [""].concat(profesiList2), 
    //     body: momentAxes2.map((p)=>{
    //         var row = [p].concat(profesiList2.map((q)=>{
    //             var s = hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, q, resumeFilter.hh.unit)[momentList2[momentAxes2.indexOf(p)]].score
    //             return (Math.floor(s*1000) / 10) + "%"
    //         }))
    //         return row
    //     }),
    //     footer: ["Total"].concat(profesiList2.map((q)=>{
    //         var s = hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, q, resumeFilter.hh.unit).total.score
    //         return (Math.floor(s*1000) / 10) + "%"
    //     }))
    // }
    // resumeHHData.table["table4"] = resumeFilter.hh.by == "Moment" ? {
    //     header: [""].concat(Object.keys(threeMonth).map((p)=>{
    //         return shortMonthText[threeMonth[p].month] + " " + threeMonth[p].year
    //     })), 
    //     body: momentList2.map((p)=>{
    //         var row = [momentAxes2[momentList2.indexOf(p)]]
    //                 .concat(Object.keys(threeMonth).map((q)=>{
    //                     var s = hhDataFilter(threeMonth[q].month, threeMonth[q].year, resumeFilter.hh.group, resumeFilter.hh.unit)[p].score
    //                     return (Math.floor(s*1000) / 10) + "%"
    //                 }))
    //         return row
    //     }),
    //     footer: ["Total"]
    //             .concat(Object.keys(threeMonth).map((q)=>{
    //                 var s = hhDataFilter(threeMonth[q].month, threeMonth[q].year, resumeFilter.hh.group, resumeFilter.hh.unit).total.score
    //                 return (Math.floor(s*1000) / 10) + "%"
    //             }))
    // } : {
    //     header: [""].concat(Object.keys(threeMonth).map((p)=>{
    //         return shortMonthText[threeMonth[p].month] + " " + threeMonth[p].year
    //     })), 
    //     body: profesiList2.map((p)=>{
    //         var row = [p]
    //                 .concat(Object.keys(threeMonth).map((q)=>{
    //                     var s = hhDataFilter(threeMonth[q].month, threeMonth[q].year, p, resumeFilter.hh.unit).total.score
    //                     return (Math.floor(s*1000) / 10) + "%"
    //                 }))
    //         return row
    //     }),
    //     footer: ["Total"]
    //             .concat(Object.keys(threeMonth).map((q)=>{
    //                 var s = hhDataFilter(threeMonth[q].month, threeMonth[q].year, "All", resumeFilter.hh.unit).total.score
    //                 return (Math.floor(s*1000) / 10) + "%"
    //             }))
    // }
    // var tab5Grouping_byUnit = {}
    // database.hhData.filter((p)=>{
    //     return (p.month*1 === resumeFilter.hh.month*1) && (p.year*1 === resumeFilter.hh.year*1)
    // }).forEach((q)=>{
    //     tab5Grouping_byUnit[q.unit] = {
    //         unitName: q.unit,
    //         n: database.hhData.filter((p)=>{
    //             return (p.unit == q.unit) &&(p.month*1 === resumeFilter.hh.month*1) && (p.year*1 === resumeFilter.hh.year*1)
    //         }).length,
    //         HHScore: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).total.score,
    //         mo1: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).mo1.score,
    //         mo2: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).mo2.score,
    //         mo3: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).mo3.score,
    //         mo4: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).mo4.score,
    //         mo5: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "All", q.unit).mo5.score,
    //         Dokter: hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "Dokter", q.unit).total.score,
    //         "Perawat Bidan": hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "Perawat Bidan", q.unit).total.score,
    //         "Magang Siswa": hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "Magang Siswa", q.unit).total.score,
    //         "Lain-lain": hhDataFilter(resumeFilter.hh.month, resumeFilter.hh.year, "Lain-lain", q.unit).total.score,
    //     }
    // })
    // resumeHHData.table["table5"] = Object.values(tab5Grouping_byUnit)
    // .sort((a,b)=>{
    //     if(resumeFilter.hh.top == "1-0"){return b.HHScore - a.HHScore} else {return a.HHScore - b.HHScore}
    // })
    // // console.log(Object.values(tab5Grouping_byUnit))
    // console.log(resumeHHData)
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
    Elem("res-hh-canvas-2").innerHTML = ""
    Elem("res-hh-canvas-2").appendChild(canva2)
    
    
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
    Elem("res-hh-canvas-3").innerHTML = ""
    Elem("res-hh-canvas-3").appendChild(canva3)
    var maxLongMonth = 13
    if(resumeHHData.chart.chart3.labels.length > maxLongMonth){
        Elem("res-hh-canvas-3").style.width = (resumeHHData.chart.chart3.labels.length/maxLongMonth*900)  +"px"
    }
    var scrollMonthIndex =  resumeHHData.chart.chart3.labels.indexOf(
        shortMonthText[resumeFilter.hh.month] + " " + resumeFilter.hh.year   
    )
    var x = scrollMonthIndex
    if(scrollMonthIndex < 0){
        var scrollMonth = Elem("res-hh-canvas-3").offsetWidth  
    } else {
        scrollMonth = ((x * 1) - 4 )  / resumeHHData.chart.chart3.labels.length * (Elem("res-hh-canvas-3").offsetWidth * 1) 
    }
    Elem("res-hh-canvas-3-parent").scrollTo(scrollMonth,0)
    return
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
        var tab1Head = table1.querySelector("thead tr");tab1Head.innerHTML = ""
        var tab1Body = table1.querySelector("tbody");tab1Body.innerHTML = ""
        var tab1Foot = table1.querySelector("tfoot tr");tab1Foot.innerHTML = ""
        var nTab1Row = 0; var nTab1Col = 0; var nTab1ColMax = resumeHHData.table["table1"][0].length
        while(nTab1Row < 5){
            if(nTab1Row > 0 && nTab1Row < 4){
                var trBody = document.createElement("tr")
            }
            while(nTab1Col < nTab1ColMax){
                if(nTab1Row === 0){
                    var thNew_head = document.createElement("th")
                    thNew_head.setAttribute("scope", "col")
                    thNew_head.innerHTML = resumeHHData.table["table1"][0][nTab1Col]
                    tab1Head.appendChild(thNew_head)
                    // console.log(tab1Head)
                }
                else if(nTab1Row > 0 && nTab1Row < 4){
                    if(nTab1Col === 0){
                        var td = document.createElement("th")
                        td.setAttribute("scope", "row")
                    } else {var td = document.createElement("td")}
                    td.innerHTML = resumeHHData.table["table1"][nTab1Row][nTab1Col]
                    // console.log(td)
                    trBody.appendChild(td)
                }
                else {
                    var thFoot = document.createElement("th")
                    thFoot.setAttribute("scope", "col")
                    thFoot.innerHTML = resumeHHData.table["table1"][4][nTab1Col]
                    tab1Foot.appendChild(thFoot)
                }
            nTab1Col++
            }
            if(nTab1Row > 0 && nTab1Row < 4){
                tab1Body.appendChild(trBody)
            }
        nTab1Col = 0
        nTab1Row++
        }

    var table2 = Elem("tab-res-hh-2")
        var tab2Head = table2.querySelector("thead tr");tab2Head.innerHTML = ""
        var tab2Body = table2.querySelector("tbody"); tab2Body.innerHTML = ""
        var tab2Foot = table2.querySelector("tfoot tr"); tab2Foot.innerHTML = ""
        var nTab2Row = 0; var nTab2Col = 0; var nTab2RowMax = resumeHHData.table["table2"].length;var nTab2ColMax = resumeHHData.table["table2"][0].length
        while(nTab2Row < nTab2RowMax){
            var trBody = document.createElement("tr")
            while(nTab2Col < nTab2ColMax){
                if(nTab2Row === 0){
                    var thNew_head = document.createElement("th")
                    thNew_head.setAttribute("scope", "col")
                    thNew_head.innerHTML = resumeHHData.table["table2"][0][nTab2Col]
                    tab2Head.appendChild(thNew_head)
                }
                if (nTab2RowMax === 8){
                    if(nTab2Row > 0 && nTab2Row < 7){
                        if(nTab2Col === 0){
                            var td = document.createElement("th")
                            td.setAttribute("scope", "row")
                        } else {
                            var td = document.createElement("td")
                        }
                        td.innerHTML = resumeHHData.table["table2"][nTab2Row][nTab2Col]
                        trBody.appendChild(td)
                    }
                } else {
                    if(nTab2Col === 0){
                        var td = document.createElement("th")
                        td.setAttribute("scope", "row")
                    } else {
                        var td = document.createElement("td")
                    }
                    td.innerHTML = resumeHHData.table["table2"][nTab2Row][nTab2Col]
                    trBody.appendChild(td)
                }
                if (nTab2RowMax === 8 && nTab2Row === 7) {
                    var thFoot = document.createElement("th")
                    thFoot.setAttribute("scope", "col")
                    thFoot.innerHTML = resumeHHData.table["table2"][7][nTab2Col]
                    tab2Foot.appendChild(thFoot)
                }  
            nTab2Col++
            }
            if(nTab2RowMax === 8 && trBody.innerHTML !== ""){
                tab2Body.appendChild(trBody)
            } else if (trBody.innerHTML !== "") {
                tab2Body.appendChild(trBody)
            }
        nTab2Col = 0
        nTab2Row++
        }
    
    return
        resumeHHData.table["table2"].header.forEach((p)=>{
            var thNew = document.createElement("th")
            thNew.setAttribute("scope", "col")
            thNew.innerHTML = p
            tab2Head.appendChild(thNew)
        })
        
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
        
        if(resumeHHData.table["table2"].footer.length > 0){
            resumeHHData.table["table2"].footer.forEach((p)=>{
                var thNew = document.createElement("th")
                thNew.setAttribute("scope", "col")
                thNew.innerHTML = p
                tab2Foot.appendChild(thNew)
            })
        }
    return
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