var resumeHHData = {data: {}, chart:{}, table:{}}

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
    var resumeFilterHHDefault = {
        month : Elem("resume-filter-hh-bulan").value,
        year : Elem("resume-filter-hh-tahun").value,
        group: "All",
        unit: "All",
        by: "Moment",
        top: "1-0"
    }
    resumeFilter.hh = resumeFilterHHDefault
    updateResume_HH_Data()
    updateResume_HH()
    
}
function updateResume_HH(){
    // spinner(true)
    Elem("resume-hh-tab5-profesi").checked = false; tab5show(Elem("resume-hh-tab5-profesi"))
    Elem("resume-hh-tab5-moment").checked = false; tab5show(Elem("resume-hh-tab5-moment"))
    updateResume_HH_Pra()
    updateResume_HH_Title()
    updateResume_HH_Chart()
    updateResume_HH_Table()
    
    // spinner(false)
}

function updateResume_HH_Data(){
    resumeHHData.data = {}
    console.log(database.hhData)
    var iData = 0; var len = database.hhData.length;
    while(iData < len){
        var item = database.hhData[iData]
        var yMo = (item.year.toString() + (item.month.toString().length === 1 ? ("0"+ item.month) : item.month.toString()))*1
        if(!(resumeHHData.data[yMo])){
            resumeHHData.data[yMo] = {n:0,"All":{"Dokter":{n: 0, mo1:{act:0,opp:0,score:""},mo2:{act:0,opp:0,score:""},mo3:{act:0,opp:0,score:""},mo4:{act:0,opp:0,score:""},mo5:{act:0,opp:0,score:""},total:{act:0,opp:0,score:""}},"Perawat Bidan":{n: 0, mo1:{act:0,opp:0,score:""},mo2:{act:0,opp:0,score:""},mo3:{act:0,opp:0,score:""},mo4:{act:0,opp:0,score:""},mo5:{act:0,opp:0,score:""},total:{act:0,opp:0,score:""}},"Magang Siswa":{n: 0, mo1:{act:0,opp:0,score:""},mo2:{act:0,opp:0,score:""},mo3:{act:0,opp:0,score:""},mo4:{act:0,opp:0,score:""},mo5:{act:0,opp:0,score:""},total:{act:0,opp:0,score:""}},"Lain-lain":{n: 0, mo1:{act:0,opp:0,score:""},mo2:{act:0,opp:0,score:""},mo3:{act:0,opp:0,score:""},mo4:{act:0,opp:0,score:""},mo5:{act:0,opp:0,score:""},total:{act:0,opp:0,score:""}},"All":{n: 0, mo1:{act:0,opp:0,score:""},mo2:{act:0,opp:0,score:""},mo3:{act:0,opp:0,score:""},mo4:{act:0,opp:0,score:""},mo5:{act:0,opp:0,score:""},total:{act:0,opp:0,score:""}}}}
        }
        if(!(resumeHHData.data[yMo][item.unit])){
            resumeHHData.data[yMo][item.unit] = {"Dokter":{n: 0, mo1:{act:0,opp:0,score:""},mo2:{act:0,opp:0,score:""},mo3:{act:0,opp:0,score:""},mo4:{act:0,opp:0,score:""},mo5:{act:0,opp:0,score:""},total:{act:0,opp:0,score:""}},"Perawat Bidan":{n: 0, mo1:{act:0,opp:0,score:""},mo2:{act:0,opp:0,score:""},mo3:{act:0,opp:0,score:""},mo4:{act:0,opp:0,score:""},mo5:{act:0,opp:0,score:""},total:{act:0,opp:0,score:""}},"Magang Siswa":{n: 0, mo1:{act:0,opp:0,score:""},mo2:{act:0,opp:0,score:""},mo3:{act:0,opp:0,score:""},mo4:{act:0,opp:0,score:""},mo5:{act:0,opp:0,score:""},total:{act:0,opp:0,score:""}},"Lain-lain":{n: 0, mo1:{act:0,opp:0,score:""},mo2:{act:0,opp:0,score:""},mo3:{act:0,opp:0,score:""},mo4:{act:0,opp:0,score:""},mo5:{act:0,opp:0,score:""},total:{act:0,opp:0,score:""}},"All":{n: 0, mo1:{act:0,opp:0,score:""},mo2:{act:0,opp:0,score:""},mo3:{act:0,opp:0,score:""},mo4:{act:0,opp:0,score:""},mo5:{act:0,opp:0,score:""},total:{act:0,opp:0,score:""}}}
        }
        
        resumeHHData.data[yMo].n += 1
        resumeHHData.data[yMo].All.All.n += 1
        resumeHHData.data[yMo].All[item.group].n += 1
        resumeHHData.data[yMo][item.unit].All.n += 1
        resumeHHData.data[yMo][item.unit][item.group].n += 1
        var nMo = 1
        while(nMo < 6){
            if(item["mo"+nMo]!==""){
                resumeHHData.data[yMo][item.unit][item.group]["mo"+nMo].opp += 1
                resumeHHData.data[yMo][item.unit][item.group].total.opp += 1
                resumeHHData.data[yMo][item.unit].All["mo"+nMo].opp += 1
                resumeHHData.data[yMo][item.unit].All.total.opp += 1
                resumeHHData.data[yMo].All[item.group]["mo"+nMo].opp += 1
                resumeHHData.data[yMo].All[item.group].total.opp += 1
                resumeHHData.data[yMo].All.All["mo"+nMo].opp += 1
                resumeHHData.data[yMo].All.All.total.opp += 1
                if(item["mo"+nMo]){
                    resumeHHData.data[yMo][item.unit][item.group]["mo"+nMo].act += 1
                    resumeHHData.data[yMo][item.unit][item.group].total.act += 1
                    resumeHHData.data[yMo][item.unit].All["mo"+nMo].act += 1
                    resumeHHData.data[yMo][item.unit].All.total.act += 1
                    resumeHHData.data[yMo].All[item.group]["mo"+nMo].act += 1
                    resumeHHData.data[yMo].All[item.group].total.act += 1
                    resumeHHData.data[yMo].All.All["mo"+nMo].act += 1
                    resumeHHData.data[yMo].All.All.total.act += 1
                }
                if(resumeHHData.data[yMo][item.unit][item.group]["mo"+nMo].opp > 0){
                    var s = resumeHHData.data[yMo][item.unit][item.group]["mo"+nMo].act/resumeHHData.data[yMo][item.unit][item.group]["mo"+nMo].opp
                    resumeHHData.data[yMo][item.unit][item.group]["mo"+nMo].score = Math.floor(s*1000)/1000
                }
                if(resumeHHData.data[yMo][item.unit][item.group].total.opp > 0){
                    var s = resumeHHData.data[yMo][item.unit][item.group].total.act/resumeHHData.data[yMo][item.unit][item.group].total.opp
                    resumeHHData.data[yMo][item.unit][item.group].total.score = Math.floor(s*1000)/1000
                }
                if(resumeHHData.data[yMo][item.unit].All["mo"+nMo].opp > 0){
                    var s = resumeHHData.data[yMo][item.unit].All["mo"+nMo].act/resumeHHData.data[yMo][item.unit].All["mo"+nMo].opp
                    resumeHHData.data[yMo][item.unit].All["mo"+nMo].score = Math.floor(s*1000)/1000
                }
                if(resumeHHData.data[yMo][item.unit].All.total.opp > 0){
                    var s = resumeHHData.data[yMo][item.unit].All.total.act/resumeHHData.data[yMo][item.unit].All.total.opp
                    resumeHHData.data[yMo][item.unit].All.total.score = Math.floor(s*1000)/1000
                }
                if(resumeHHData.data[yMo].All[item.group]["mo"+nMo].opp > 0){
                    var s = resumeHHData.data[yMo].All[item.group]["mo"+nMo].act/resumeHHData.data[yMo].All[item.group]["mo"+nMo].opp
                    resumeHHData.data[yMo].All[item.group]["mo"+nMo].score = Math.floor(s*1000)/1000
                }
                if(resumeHHData.data[yMo].All[item.group].total.opp > 0){
                    var s = resumeHHData.data[yMo].All[item.group].total.act/resumeHHData.data[yMo].All[item.group].total.opp
                    resumeHHData.data[yMo].All[item.group].total.score = Math.floor(s*1000)/1000
                }
                if(resumeHHData.data[yMo].All.All["mo"+nMo].opp > 0){
                    var s = resumeHHData.data[yMo].All.All["mo"+nMo].act/resumeHHData.data[yMo].All.All["mo"+nMo].opp
                    resumeHHData.data[yMo].All.All["mo"+nMo].score = Math.floor(s*1000)/1000
                }
                if(resumeHHData.data[yMo].All.All.total.opp > 0){
                    var s = resumeHHData.data[yMo].All.All.total.act/resumeHHData.data[yMo].All.All.total.opp
                    resumeHHData.data[yMo].All.All.total.score = Math.floor(s*1000)/1000
                }
            }
        nMo++
        }
    iData++
    }
    
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
function updateResume_HH_Pra(){
    var shortMonthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    var profesiList = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain"]
    var momentList = ['mo1', 'mo2', 'mo3', 'mo4', 'mo5', 'total']

    resumeHHData.chart["chart1"] = {label:[], dataset:[], barColor:[]}
    resumeHHData.table["table1"] = [[],["n","","","","","",""],["Act","","","","","",""],["Opp","","","","","",""],["Score","","","","","",""]]
    resumeHHData.chart["chart2"] = {label:[], dataset:[]}
    resumeHHData.chart["chart4"] = {label:[], dataset:[]}
    
    var selectYMo = (resumeFilter.hh.year.toString() + (resumeFilter.hh.month.toString().length === 1 ? ("0"+ resumeFilter.hh.month) : resumeFilter.hh.month.toString()))*1
    var threeMonth = [
        {
            month: resumeFilter.hh.month - 2 + (resumeFilter.hh.month < 3 ? 12 : 0),
            year: resumeFilter.hh.year - 1 + (resumeFilter.hh.month < 3 ? 0 : 1)
        },
        {
            month: resumeFilter.hh.month - 1 + (resumeFilter.hh.month < 2 ? 12 : 0),
            year: resumeFilter.hh.year - 1 + (resumeFilter.hh.month < 2 ? 0 : 1)
        },
        {month: resumeFilter.hh.month, year: resumeFilter.hh.year}
    ]
    
    if(resumeFilter.hh.by == "Moment"){
        resumeHHData.chart["chart1"].label = momentAxes;
        resumeHHData.chart["chart2"].label = momentAxes;
        resumeHHData.table["table1"][0] = [""].concat(momentAxes)
        resumeHHData.chart["chart1"].dataset = [,,,,,,]
        resumeHHData.table["table2"] = [["","n"].concat(momentAxes),["Dokter","","","","","","",""],["Perawat Bidan","","","","","","",""],["Magang Siswa","","","","","","",""],["lain-lain","","","","","","",""]]
        resumeHHData.chart["chart4"].label = momentAxes;
        resumeHHData.chart["chart4"].dataset = [{},{},{}]
        resumeHHData.table["table4"] = [[""],["M1"],["M2"],["M3"],["M4"],["M5"],["Total"]]

        var n3Month = 0
        while(n3Month < 3){
            var ymo = (threeMonth[n3Month].year.toString() + (threeMonth[n3Month].month.toString().length === 1 ? ("0"+ threeMonth[n3Month].month.toString()) : (threeMonth[n3Month].month.toString())))*1
            // console.log(ymo)
            if(resumeHHData.data[ymo]){    
                var nMo4 = 0; var ch4Data = []
                while (nMo4 < 6){
                    ch4Data.push(cForm(resumeHHData.data[ymo][resumeFilter.hh.unit][resumeFilter.hh.group][momentList[nMo4]].score))
                    resumeHHData.table["table4"][1+nMo4].push(form(resumeHHData.data[ymo][resumeFilter.hh.unit][resumeFilter.hh.group][momentList[nMo4]].score))
                nMo4++
                }
            } else {
                var ch4Data = [".",".",".",".",".","."]
                var nMo4 = 0; var ch4Data = []
                while (nMo4 < 6){
                    resumeHHData.table["table4"][1+nMo4].push("")
                nMo4++
                }
            }
            resumeHHData.chart["chart4"].dataset[n3Month] = {
                label: shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year,
                data : ch4Data,
                backgroundColor : color.increase[n3Month]
            }
            
            resumeHHData.table["table4"][0].push(shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year)

        n3Month++
        }
        if(!(!(resumeHHData.data[selectYMo]))){if(!(!(resumeHHData.data[selectYMo][resumeFilter.hh.unit]))){
            var item = resumeHHData.data[selectYMo][resumeFilter.hh.unit][resumeFilter.hh.group]
            resumeHHData.chart["chart1"].dataset = [
                cForm(item.mo1.score),cForm(item.mo2.score),cForm(item.mo3.score),cForm(item.mo4.score),cForm(item.mo5.score),cForm(item.total.score)]

            resumeHHData.chart["chart1"].barColor = [color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.total]
            resumeHHData.table.table1[1] = ["n","","","","","",item.n]
            resumeHHData.table.table1[2] = ["Act",item.mo1.act,item.mo2.act,item.mo3.act,item.mo4.act,item.mo5.act,item.total.act]
            resumeHHData.table.table1[3] = ["Opp",item.mo1.opp,item.mo2.opp,item.mo3.opp,item.mo4.opp,item.mo5.opp,item.total.opp]
            resumeHHData.table.table1[4] = ["Score",form(item.mo1.score),form(item.mo2.score),form(item.mo3.score),form(item.mo4.score),form(item.mo5.score),form(item.total.score)]
            var nProfesi = 0;
            resumeHHData.table["table2"] = [["","n"].concat(momentAxes)]
            while (nProfesi < 4){
                var item2 = resumeHHData.data[selectYMo][resumeFilter.hh.unit][profesiList[nProfesi]]
                var data = {
                    label : profesiList[nProfesi],
                    data : [cForm(item2["mo1"].score),cForm(item2["mo2"].score),cForm(item2["mo3"].score),cForm(item2["mo4"].score),cForm(item2["mo5"].score),cForm(item2["total"].score)],
                    backgroundColor: color.serial[nProfesi]
                }
                resumeHHData.chart["chart2"].dataset.push(data)
                var tab2Row = [profesiList[nProfesi],item2.n,form(item2.mo1.score),form(item2.mo2.score),form(item2.mo3.score),form(item2.mo4.score),form(item2.mo5.score),form(item2.total.score)]
                resumeHHData.table["table2"].push(tab2Row)
            nProfesi++
            }

        }}

        
    } else {
        resumeHHData.chart["chart1"].label = profesiAxes;
        resumeHHData.table["table1"][0] = [""].concat(profesiAxes)
        resumeHHData.chart["chart1"].dataset = [,,,,,]

        resumeHHData.chart["chart2"].label = profesiAxes.slice(0,4);
        resumeHHData.chart["chart2"].dataset = [{label:"M1"},{label:"M2"},{label:"M3"},{label:"M4"},{label:"M5"},{label:"Total"}]
        resumeHHData.table["table2"] = [[""].concat(resumeHHData.chart["chart2"].label),["n",0,0,0,0],["M1","","","",""],["M2","","","",""],["M3","","","",""],["M4","","","",""],["M5","","","",""],["Total","","","",""]]

        resumeHHData.chart["chart4"].label = profesiAxes
        resumeHHData.chart["chart4"].dataset = [{},{},{}]
        resumeHHData.table["table4"] = [[""],["Dokter"],["Perawat Bidan"],["Magang Siswa"],["Lain-lain"],["Total"]]

        var profesiList2 = profesiList.concat("All")
        
        var n3Month = 0
        while(n3Month < 3){
            var ymo = (threeMonth[n3Month].year.toString() + (threeMonth[n3Month].month.toString().length === 1 ? ("0"+ threeMonth[n3Month].month.toString()) : (threeMonth[n3Month].month.toString())))*1
            resumeHHData.table["table4"][0].push(shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year)
            if(resumeHHData.data[ymo]){    
                var nPro4 = 0; var ch4Data = [] 
                while(nPro4 < profesiList2.length){
                    ch4Data.push(cForm(resumeHHData.data[ymo][resumeFilter.hh.unit][profesiList2[nPro4]].total.score))
                    resumeHHData.table["table4"][1+nPro4].push(form(resumeHHData.data[ymo][resumeFilter.hh.unit][profesiList2[nPro4]].total.score))
                nPro4++
                }
            } else {
                var ch4Data = [".",".",".",".",".","."]
                var nPro4 = 0;
                while(nPro4 < profesiList2.length){
                    resumeHHData.table["table4"][1+nPro4].push("")
                nPro4++
                }
            }
            resumeHHData.chart["chart4"].dataset[n3Month] = {
                label: shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year,
                data : ch4Data,
                backgroundColor : color.increase[n3Month]
            }

        n3Month++
        }
        

        if(!(!(resumeHHData.data[selectYMo]))){if(!(!(resumeHHData.data[selectYMo][resumeFilter.hh.unit]))){
            var item = resumeHHData.data[selectYMo][resumeFilter.hh.unit] 
            resumeHHData.chart["chart1"].dataset = [cForm(item["Dokter"].total.score),cForm(item["Perawat Bidan"].total.score), cForm(item["Magang Siswa"].total.score), cForm(item["Lain-lain"].total.score), cForm(item.All.total.score)]

            resumeHHData.table.table1[1] = ["n",item["Dokter"].n,item["Perawat Bidan"].n,item["Magang Siswa"].n,item["Lain-lain"].n,item["All"].n]
            resumeHHData.table.table1[2] = ["Act",item["Dokter"].total.act,item["Perawat Bidan"].total.act,item["Magang Siswa"].total.act,item["Lain-lain"].total.act,item["All"].total.act]
            resumeHHData.table.table1[3] = ["Opp",item["Dokter"].total.opp,item["Perawat Bidan"].total.opp,item["Magang Siswa"].total.opp,item["Lain-lain"].total.opp,item["All"].total.opp]
            resumeHHData.table.table1[4] = ["Score",form(item["Dokter"].total.score),form(item["Perawat Bidan"].total.score),form(item["Magang Siswa"].total.score),form(item["Lain-lain"].total.score),form(item["All"].total.score)]

            resumeHHData.chart["chart2"].dataset = []
            resumeHHData.table["table2"] = [[""].concat(profesiAxes.slice(0,4)),["n",item["Dokter"].n,item["Perawat Bidan"].n,item["Magang Siswa"].n,item["Perawat Bidan"].n]]
            var nMo2 = 0;
            
            while(nMo2  < 6){
                var dataItem = []; var nDataItem = 0
                while(nDataItem < 4){
                    var val = cForm(item[profesiList[nDataItem]][momentList[nMo2]].score)
                    dataItem.push(val)
                nDataItem ++
                } 
                var c2Item = {
                    label : momentAxes[nMo2],
                    data : dataItem,
                    backgroundColor: (nMo2 < 5 ? color.serial[nMo2] : color.total)
                }
                resumeHHData.chart["chart2"].dataset.push(c2Item)
                
                resumeHHData.table["table2"].push([momentAxes[nMo2], form(item["Dokter"][momentList[nMo2]].score), form(item["Perawat Bidan"][momentList[nMo2]].score), form(item["Magang Siswa"][momentList[nMo2]].score),form(item["Lain-lain"][momentList[nMo2]].score)])
            nMo2++
            }
        }}

        resumeHHData.chart["chart1"].barColor = [color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.total]
    }

    var monthList = Object.keys(resumeHHData.data)
    var nCh3 = 0; var nCh3Max = monthList.length; 
    resumeHHData.chart["chart3"] = {label: [], data:[]}
    while(nCh3 < nCh3Max){
        var year = monthList[nCh3].toString().substring(0,4) * 1
        var month = monthList[nCh3].toString().substring(4) * 1
        resumeHHData.chart.chart3.label.push(shortMonthText[month] + " " + year)
        resumeHHData.chart.chart3.data.push(cForm(resumeHHData.data[monthList[nCh3]][resumeFilter.hh.unit][resumeFilter.hh.group].total.score))
    nCh3++
    }

    var unitData1 = resumeHHData.data[selectYMo]
    resumeHHData.table["table5"] = []
    if(resumeHHData.data[selectYMo]){
        var nUnitData1 = 0; var nUnitData1Len = Object.keys(unitData1).length
        while(nUnitData1 < nUnitData1Len){
            
            if(Object.keys(unitData1)[nUnitData1] !== "All" && Object.keys(unitData1)[nUnitData1] !== "n" ){
                var unitName = Object.keys(unitData1)[nUnitData1]
                // console.log(unitName)
                var unitData = resumeHHData.data[selectYMo][unitName]  
                resumeHHData.table["table5"].push([
                    unitData.All.total.score,
                    form(unitData.All.total.score),unitName,unitData.All.n,
                    unitData["Dokter"].n > 0 ? form(unitData["Dokter"].total.score) : "",
                    unitData["Perawat Bidan"].n > 0 ? form(unitData["Perawat Bidan"].total.score) : "",
                    unitData["Magang Siswa"].n > 0 ? form(unitData["Magang Siswa"].total.score) : "",
                    unitData["Lain-lain"].n > 0 ? form(unitData["Lain-lain"].total.score) : "",
                    form(unitData.All.mo1.score),form(unitData.All.mo2.score),form(unitData.All.mo3.score),form(unitData.All.mo4.score),form(unitData.All.mo5.score)
                ])
            }
        nUnitData1++
        }
        resumeHHData.table["table5"].sort((a,b)=>{
            if(resumeFilter.hh.top == "1-0"){return (b[0]) - (a[0])
            } else {return (a[0]) - (b[0])}
        })
    }

    function form(val){if(val == "") {return ""} else {return (Math.floor(val*1000)/10) + "%"}}
    function cForm(val){var r = val; if(val === 0 || val === ""){r = "."}; return r}
    console.log(resumeFilter)
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
            labels: resumeHHData.chart["chart1"].label,
            datasets: [{
                data: resumeHHData.chart["chart1"].dataset,
                borderWidth: 1,
                backgroundColor: resumeHHData.chart["chart1"].barColor
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {
                tooltip:{enabled:true,callbacks: {label: function(context) {let label = "";if(context.parsed.y !== null) {label += (context.parsed.y*100) + "%";}return label;}}},title: {display: true,padding: {top: 10},text:""},legend: {display: false},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
        Elem("res-hh-canvas-1").innerHTML = ""
        Elem("res-hh-canvas-1").appendChild(canva1) 
    
    new Chart(canva2, {
        type: 'bar',
        data: {
            labels: resumeHHData.chart.chart2.label,
            datasets: resumeHHData.chart.chart2.dataset
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {tooltip:{enabled:true,callbacks: {label: function(context) {let label = "";if(context.parsed.y !== null) {label += (context.parsed.y*100) + "%";}return label;}}},title: {display: true,padding: {top: 10}, text:""},legend: {display: true, position: "bottom"},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    Elem("res-hh-canvas-2").innerHTML = ""
    Elem("res-hh-canvas-2").appendChild(canva2)   
    
    new Chart(canva3, {
        type: 'line',
        data: {
            labels: resumeHHData.chart.chart3.label,
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
            plugins: {tooltip:{enabled:true,callbacks: {label: function(context) {let label = "";if(context.parsed.y !== null) {label += (context.parsed.y*100) + "%";}return label;}}},title: {display: true,padding: {top: 10}, text:""},legend: {display: false},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10) + '%';},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    Elem("res-hh-canvas-3").innerHTML = ""
    Elem("res-hh-canvas-3").appendChild(canva3)
    var maxLongMonth = 13
    if(resumeHHData.chart.chart3.label.length > maxLongMonth){
        Elem("res-hh-canvas-3").style.width = (resumeHHData.chart.chart3.label.length/maxLongMonth*900)  +"px"
    }
    var scrollMonthIndex =  resumeHHData.chart.chart3.label.indexOf(
        shortMonthText[resumeFilter.hh.month] + " " + resumeFilter.hh.year   
    )
    var x = scrollMonthIndex
    if(scrollMonthIndex < 0){
        var scrollMonth = Elem("res-hh-canvas-3").offsetWidth  
    } else {
        scrollMonth = ((x * 1) - 3 )  / resumeHHData.chart.chart3.label.length * (Elem("res-hh-canvas-3").offsetWidth * 1) 
    }
    Elem("res-hh-canvas-3-parent").scrollTo(scrollMonth,0)

    new Chart(canva4, {
        type: 'bar',
        data: {
            labels: resumeHHData.chart.chart4.label,
            datasets: resumeHHData.chart.chart4.dataset
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return (Math.floor(value*1000)/10) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {tooltip:{enabled:true,callbacks: {label: function(context) {let label = "";if(context.parsed.y !== null) {label += (context.parsed.y*100) + "%";}return label;}}},title: {display: true,padding: {top: 10}, text:""},legend: {display: true, position: "bottom"},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    Elem("res-hh-canvas-4").innerHTML = ""
    Elem("res-hh-canvas-4").appendChild(canva4)
        
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
            if(nTab2Row === 0){
                var nHeadCol = 0;
                while(nHeadCol < nTab2ColMax){
                    var thNew_head = document.createElement("th")
                    thNew_head.setAttribute("scope", "col")
                    thNew_head.innerHTML = resumeHHData.table["table2"][0][nHeadCol]
                    tab2Head.appendChild(thNew_head)
                nHeadCol++
                }
            } else {
                if(nTab2RowMax === 8 && nTab2Row == 7){
                    var nFootCol = 0
                    while(nFootCol < nTab2ColMax){
                        var thNew_foot = document.createElement("th")
                            thNew_foot.setAttribute("scope", "col")
                            thNew_foot.innerHTML = resumeHHData.table["table2"][7][nFootCol]
                            tab2Foot.appendChild(thNew_foot)
                    nFootCol++
                    }
                }
                else {
                    var trNew = document.createElement("tr")
                    var thBody = document.createElement("th")
                        thBody.setAttribute("score", "row")
                        thBody.innerHTML =  resumeHHData.table["table2"][nTab2Row][0]
                        trNew.appendChild(thBody)
                    var nBodyCol = 1
                    while (nBodyCol<nTab2ColMax){
                        var tdBody = document.createElement("td")
                            tdBody.innerHTML = resumeHHData.table["table2"][nTab2Row][nBodyCol]
                        trNew.appendChild(tdBody)
                    nBodyCol++
                    }
                    tab2Body.appendChild(trNew)
                }
            }
        nTab2Row++
        }
        
    var table4 = Elem("tab-res-hh-4")
        var tab4Head = table4.querySelector("thead tr");tab4Head.innerHTML = ""
        var tab4Body = table4.querySelector("tbody"); tab4Body.innerHTML = ""
        var tab4Foot = table4.querySelector("tfoot tr"); tab4Foot.innerHTML = ""
        var nTab4Row = 0; var nTab4RowMax = resumeHHData.table.table4.length 
        while(nTab4Row < nTab4RowMax){
            var nTab4Col = 0;
            if (nTab4Row > 0 && nTab4Row !== (nTab4RowMax-1)){var trNew_Body = document.createElement("tr")}
            while(nTab4Col < 4){
                if(nTab4Row === 0){
                    var thNew_head = document.createElement("th"); thNew_head.setAttribute("scope", "col")
                    thNew_head.innerHTML = resumeHHData.table.table4[0][nTab4Col]
                    tab4Head.appendChild(thNew_head)
                }
                else if (nTab4Row > 0 && nTab4Row !== (nTab4RowMax-1)){
                    if(nTab4Col === 0){var td = document.createElement("th"); td.setAttribute("scope","row")}
                    else {var td = document.createElement("td")}
                    td.innerHTML = resumeHHData.table.table4[nTab4Row][nTab4Col]
                    trNew_Body.appendChild(td)
                } else {
                    var thNew_foot = document.createElement("th"); 
                    thNew_foot.setAttribute("scope", "col")
                    thNew_foot.innerHTML = resumeHHData.table.table4[nTab4Row][nTab4Col]
                    tab4Foot.appendChild(thNew_foot)
                }
            nTab4Col++
            }    
            // console.log(trNew_Body)
            if (nTab4Row > 0 && nTab4Row !== (nTab4RowMax-1)){tab4Body.appendChild(trNew_Body)}
        nTab4Row++
        }
        
    var table5 = Elem("tab-res-hh-5")
    var table5Body = table5.querySelector("tbody")
        table5Body.innerHTML = ""
        if(resumeHHData.table["table5"].length > 0){  
            for(var i = 0; i<10;i++){
                var tr = document.createElement("tr")
                var td1 = document.createElement("td")
                    td1.innerHTML = i+1;
                    td1.classList.add("border-end") 
                    tr.appendChild(td1)
                var j = 1
                while(j < 13){
                    var td = document.createElement("td")
                    td.innerHTML =  resumeHHData.table.table5[i][j]
                    if(j > 3 && j < 8){
                        td.classList.add("d-none"); 
                        td.classList.add("res-hh-tab-group");
                        if(j === 4){td.classList.add("border-start")}
                    }
                    if(j > 7){
                        td.classList.add("d-none"); 
                        td.classList.add("res-hh-tab-moment");
                        if(j === 8){td.classList.add("border-start")}
                    }
                    tr.appendChild(td)
                j++    
                }
                
                // return
                // var td2 = document.createElement("td")
                //     td2.innerHTML =  resumeHHData.table["table5"][i][1];
                //     tr.appendChild(td2)
                // var td3 = document.createElement("td")
                //     td3.innerHTML = resumeHHData.table["table5"][i].unitName; tr.appendChild(td3)
                // var td4 = document.createElement("td")
                //     td4.innerHTML = resumeHHData.table["table5"][i].n; tr.appendChild(td4)
                // var tdDok = document.createElement("td"); tdDok.innerHTML = resumeHHData.table["table5"][i]["Dokter"]; tdDok.classList.add("d-none"); tdDok.classList.add("res-hh-tab-group"); tr.appendChild(tdDok)    
                // var tdPer = document.createElement("td"); tdPer.innerHTML = resumeHHData.table["table5"][i]["Perawat Bidan"]; tdPer.classList.add("d-none"); tdPer.classList.add("res-hh-tab-group"); tr.appendChild(tdPer)
                // var tdMag = document.createElement("td"); tdMag.innerHTML = resumeHHData.table["table5"][i]["Magang Siswa"]; tdMag.classList.add("d-none"); tdMag.classList.add("res-hh-tab-group"); tr.appendChild(tdMag)
                // var tdLai = document.createElement("td"); tdLai.innerHTML = resumeHHData.table["table5"][i]["Lain-lain"]; tdLai.classList.add("d-none"); tdLai.classList.add("res-hh-tab-group"); tr.appendChild(tdLai)
                // for(var j = 1; j<6; j++){var td = document.createElement("td"); td.innerHTML = resumeHHData.table["table5"][i]["mo"+j]; ; td.classList.add("d-none"); td.classList.add("res-hh-tab-moment"); tr.appendChild(td) }
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