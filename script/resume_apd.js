

var resumeAPDData = {data: {}, chart:{}, table:{}}

function ResetResume_APD(){
    console.log("ResetResume_APD")
    var today = new Date()
    Elem("resume-filter-apd-bulan").value = today.getMonth() 
    Elem("resume-filter-apd-tahun").value = today.getFullYear() 
    var filterapdUnit = Elem("resume-filter-apd-unit")
        filterapdUnit.innerHTML = ""
        var firstOpt = Elem("resume-filter-apd-unit-first").cloneNode(true)
        filterapdUnit.appendChild(firstOpt)
        for(var i = 0; i < database.unitData.length; i++){
            var opt = document.createElement("option")
            opt.value = database.unitData[i].name
            opt.innerHTML = database.unitData[i].name
            filterapdUnit.appendChild(opt)
        }
    var resumeFilterapdDefault = {
        month : Elem("resume-filter-apd-bulan").value,
        year : Elem("resume-filter-apd-tahun").value,
        group: "All",
        unit: "All",
        by: "apdType",
        top: "1-0"
    }
    resumeFilter.apd = resumeFilterapdDefault
    updateResume_APD_Data()
    updateResume_APD_OnChange()
}
function updateResume_APD_OnChange(){
    console.log("updateResume_APD_OnChange")
    // spinner(true)
    Elem("resume-apd-tab5-profesi").checked = false; tab5show(Elem("resume-apd-tab5-profesi"))
    Elem("resume-apd-tab5-type").checked = false; tab5show(Elem("resume-apd-tab5-type"))
    updateResume_apd_OnChange_Pra()
    updateResume_apd_OnChange_Title()
    updateResume_apd_onChange_Chart()
    updateResume_apd_onChange_Table()
    
    // spinner(false)
}
function updateResume_APD_Data(){
    var profesiList_ALL = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain", "All"]
    resumeAPDData.data = {}
    console.log(database.apdData)
    var iData = 0; var len = database.apdData.length;
    var perUnitData = {}
    var nProfesiListAll = 0
    while(nProfesiListAll<profesiList_ALL.length){
        perUnitData[profesiList_ALL[nProfesiListAll]] = {n:0}
        var nAPDType = 0; var APDType = apdItem[0].concat("total")
        while(nAPDType < APDType.length){
            perUnitData[profesiList_ALL[nProfesiListAll]][APDType[nAPDType]] = {
                act: 0, opp: 0, score: ""
            }
        nAPDType++
        }
    nProfesiListAll++
    }
    
    while(iData < len){
        var item = database.apdData[iData]
        var yMo = (item.year.toString() + (item.month.toString().length === 1 ? ("0"+ item.month) : item.month.toString()))*1

        if(!(resumeAPDData.data[yMo])){resumeAPDData.data[yMo] = {}}
        if(!(resumeAPDData.data[yMo]["n"])){resumeAPDData.data[yMo]["n"] = 0}
        
        if(!(resumeAPDData.data[yMo]["All"])){
            resumeAPDData.data[yMo]["All"] = {}
            var nProfesiListAll = 0
            while(nProfesiListAll<profesiList_ALL.length){
                resumeAPDData.data[yMo]["All"][profesiList_ALL[nProfesiListAll]] = {n:0}
                var nAPDType = 0; var APDType = apdItem[0].concat("total")
                while(nAPDType < APDType.length){
                    resumeAPDData.data[yMo]["All"][profesiList_ALL[nProfesiListAll]][APDType[nAPDType]] = {
                        act: 0, opp: 0, score: ""
                    }
                nAPDType++
                }
            nProfesiListAll++
            }
        }
        if(!(resumeAPDData.data[yMo][item.unit])){
            resumeAPDData.data[yMo][item.unit] = {}
            var nProfesiListAll = 0
            while(nProfesiListAll<profesiList_ALL.length){
                resumeAPDData.data[yMo][item.unit][profesiList_ALL[nProfesiListAll]] = {n:0}
                var nAPDType = 0; var APDType = apdItem[0].concat("total")
                while(nAPDType < APDType.length){
                    resumeAPDData.data[yMo][item.unit][profesiList_ALL[nProfesiListAll]][APDType[nAPDType]] = {
                        act: 0, opp: 0, score: ""
                    }
                nAPDType++
                }
            nProfesiListAll++
            }
        }
                        
        resumeAPDData.data[yMo].n += 1
        resumeAPDData.data[yMo].All.All.n += 1
        resumeAPDData.data[yMo].All[item.group].n += 1
        resumeAPDData.data[yMo][item.unit].All.n += 1
        resumeAPDData.data[yMo][item.unit][item.group].n += 1

        nPro = 0
        while(nPro < apdItem[0].length){
            var apdItemSel = apdItem[0][nPro] 
            if(item[apdItemSel] !== ""){
                resumeAPDData.data[yMo][item.unit][item.group][apdItemSel].opp += 1
                resumeAPDData.data[yMo][item.unit][item.group].total.opp += 1
                resumeAPDData.data[yMo][item.unit].All[apdItemSel].opp += 1
                resumeAPDData.data[yMo][item.unit].All.total.opp += 1
                resumeAPDData.data[yMo].All[item.group][apdItemSel].opp += 1
                resumeAPDData.data[yMo].All[item.group].total.opp += 1
                resumeAPDData.data[yMo].All.All[apdItemSel].opp += 1
                resumeAPDData.data[yMo].All.All.total.opp += 1
                if(item[apdItemSel]){
                    resumeAPDData.data[yMo][item.unit][item.group][apdItemSel].act += 1
                    resumeAPDData.data[yMo][item.unit][item.group].total.act += 1
                    resumeAPDData.data[yMo][item.unit].All[apdItemSel].act += 1
                    resumeAPDData.data[yMo][item.unit].All.total.act += 1
                    resumeAPDData.data[yMo].All[item.group][apdItemSel].act += 1
                    resumeAPDData.data[yMo].All[item.group].total.act += 1
                    resumeAPDData.data[yMo].All.All[apdItemSel].act += 1
                    resumeAPDData.data[yMo].All.All.total.act += 1
                }
            }
            if(resumeAPDData.data[yMo][item.unit][item.group][apdItemSel].opp > 0){
                var s = resumeAPDData.data[yMo][item.unit][item.group][apdItemSel].act/resumeAPDData.data[yMo][item.unit][item.group][apdItemSel].opp
                resumeAPDData.data[yMo][item.unit][item.group][apdItemSel].score = Math.floor(s*1000)/1000
            }
            if(resumeAPDData.data[yMo][item.unit][item.group].total.opp > 0){
                var s = resumeAPDData.data[yMo][item.unit][item.group].total.act/resumeAPDData.data[yMo][item.unit][item.group].total.opp
                resumeAPDData.data[yMo][item.unit][item.group].total.score = Math.floor(s*1000)/1000
            }
            if(resumeAPDData.data[yMo][item.unit].All[apdItemSel].opp > 0){
                var s = resumeAPDData.data[yMo][item.unit].All[apdItemSel].act/resumeAPDData.data[yMo][item.unit].All[apdItemSel].opp
                resumeAPDData.data[yMo][item.unit].All[apdItemSel].score = Math.floor(s*1000)/1000
            }
            if(resumeAPDData.data[yMo][item.unit].All.total.opp > 0){
                var s = resumeAPDData.data[yMo][item.unit].All.total.act/resumeAPDData.data[yMo][item.unit].All.total.opp
                resumeAPDData.data[yMo][item.unit].All.total.score = Math.floor(s*1000)/1000
            }
            if(resumeAPDData.data[yMo].All[item.group][apdItemSel].opp > 0){
                var s = resumeAPDData.data[yMo].All[item.group][apdItemSel].act/resumeAPDData.data[yMo].All[item.group][apdItemSel].opp
                resumeAPDData.data[yMo].All[item.group][apdItemSel].score = Math.floor(s*1000)/1000
            }
            if(resumeAPDData.data[yMo].All[item.group].total.opp > 0){
                var s = resumeAPDData.data[yMo].All[item.group].total.act/resumeAPDData.data[yMo].All[item.group].total.opp
                resumeAPDData.data[yMo].All[item.group].total.score = Math.floor(s*1000)/1000
            }
            if(resumeAPDData.data[yMo].All.All[apdItemSel].opp > 0){
                var s = resumeAPDData.data[yMo].All.All[apdItemSel].act/resumeAPDData.data[yMo].All.All[apdItemSel].opp
                resumeAPDData.data[yMo].All.All[apdItemSel].score = Math.floor(s*1000)/1000
            }
            if(resumeAPDData.data[yMo].All.All.total.opp > 0){
                var s = resumeAPDData.data[yMo].All.All.total.act/resumeAPDData.data[yMo].All.All.total.opp
                resumeAPDData.data[yMo].All.All.total.score = Math.floor(s*1000)/1000
            }
        nPro++
        }
    iData++
    }
    console.log("resumeAPDData:")
    console.log(resumeAPDData)
}
function apdDataFilter(month, year, group, unit){
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
        act = database.apdData.filter((p)=>{
            var groupTrue = true;
            var unitTrue = true;
            if(group !== "All"){groupTrue = (p.group == group)}
            if(unit !== "All"){unitTrue = (p.unit == unit)}
            return (p["mo"+i]) && (p.month*1 == month*1) && (p.year*1 == year*1) && groupTrue && unitTrue
        }).length
        opp = database.apdData.filter((p)=>{
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
function updateResume_apd_OnChange_Pra(){
    var shortMonthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    var profesiList = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain"]
    var apdTypeListAxes = apdItem[1]
    var apdTypeListAxes2 = apdTypeListAxes.concat("Total")
    var apdTypeList_All = apdItem[0].concat("total")
    
    resumeAPDData.chart["chart1"] = {label:[], dataset:[], barColor:[]}
    resumeAPDData.table["table1"] = [[],["n","","","","","",""],["Act","","","","","",""],["Opp","","","","","",""],["Score","","","","","",""]]
    resumeAPDData.chart["chart2"] = {label:[], dataset:[]}
    resumeAPDData.chart["chart4"] = {label:[], dataset:[]}
    
    var selectYMo = (resumeFilter.apd.year.toString() + (resumeFilter.apd.month.toString().length === 1 ? ("0"+ resumeFilter.apd.month) : resumeFilter.apd.month.toString()))*1
    var threeMonth = [
        {
            month: resumeFilter.apd.month - 2 + (resumeFilter.apd.month < 3 ? 12 : 0),
            year: resumeFilter.apd.year - 1 + (resumeFilter.apd.month < 3 ? 0 : 1)
        },
        {
            month: resumeFilter.apd.month - 1 + (resumeFilter.apd.month < 2 ? 12 : 0),
            year: resumeFilter.apd.year - 1 + (resumeFilter.apd.month < 2 ? 0 : 1)
        },
        {month: resumeFilter.apd.month * 1, year: resumeFilter.apd.year * 1}
    ]
    
    if(resumeFilter.apd.by == "apdType"){
        resumeAPDData.chart["chart1"].label = apdTypeListAxes.concat("Total");
        resumeAPDData.chart["chart2"].label = apdTypeListAxes.concat("Total");
        resumeAPDData.table["table1"][0] = [""].concat(apdTypeListAxes).concat("Total")
        resumeAPDData.chart["chart1"].dataset = [,,,,,,]
        resumeAPDData.table["table2"] = [["","n"].concat(apdTypeListAxes).concat("Total"),["Dokter","","","","","","","",""],["Perawat Bidan","","","","","","","",""],["Magang Siswa","","","","","","","",""],["lain-lain","","","","","","","",""]]
        resumeAPDData.chart["chart4"].label = apdTypeListAxes.concat("Total");
        resumeAPDData.chart["chart4"].dataset = [{},{},{}]
        resumeAPDData.table["table4"] = [[""],[apdTypeListAxes[0]],[apdTypeListAxes[1]],[apdTypeListAxes[2]],[apdTypeListAxes[3]],[apdTypeListAxes[4]],[apdTypeListAxes[5]],["Total"]]
        
        var n3Month = 0
        while(n3Month < 3){
            var ymo = (threeMonth[n3Month].year.toString() + (threeMonth[n3Month].month.toString().length === 1 ? ("0"+ threeMonth[n3Month].month.toString()) : (threeMonth[n3Month].month.toString())))*1
            
            if(resumeAPDData.data[ymo]){    
                var nType4 = 0; var ch4Data = []
                while (nType4 < 7){
                    var chScore = "."; var tbScore = ""
                    if(resumeAPDData.data[ymo][resumeFilter.apd.unit]){
                        chScore = cForm(resumeAPDData.data[ymo][resumeFilter.apd.unit][resumeFilter.apd.group][apdTypeList_All[nType4]].score);
                        tbScore =  form(resumeAPDData.data[ymo][resumeFilter.apd.unit][resumeFilter.apd.group][apdTypeList_All[nType4]].score);
                    }

                    ch4Data.push(chScore)
                    resumeAPDData.table["table4"][1+nType4].push(tbScore)
                nType4++
                }
            } else {
                var ch4Data = [".",".",".",".",".","."]
                var nType4 = 0; var ch4Data = []
                while (nType4 < 7){
                    resumeAPDData.table["table4"][1+nType4].push("")
                nType4++
                }
            }
            resumeAPDData.chart["chart4"].dataset[n3Month] = {
                label: shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year,
                data : ch4Data,
                backgroundColor : color.increase[n3Month]
            }
            
            resumeAPDData.table["table4"][0].push(shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year)

        n3Month++
        }

        if(!(!(resumeAPDData.data[selectYMo]))){if(!(!(resumeAPDData.data[selectYMo][resumeFilter.apd.unit]))){
            var item = resumeAPDData.data[selectYMo][resumeFilter.apd.unit][resumeFilter.apd.group]
            resumeAPDData.chart["chart1"].dataset = [
                cForm(item[apdTypeList_All[0]].score),cForm(item[apdTypeList_All[1]].score),cForm(item[apdTypeList_All[2]].score),cForm(item[apdTypeList_All[3]].score),cForm(item[apdTypeList_All[4]].score),cForm(item[apdTypeList_All[5]].score),cForm(item[apdTypeList_All[6]].score)]
            resumeAPDData.chart["chart1"].barColor = [color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.total]
            resumeAPDData.table.table1[1] = ["n","","","","","","",item.n]
            resumeAPDData.table.table1[2] = ["Act",item[apdTypeList_All[0]].act,item[apdTypeList_All[1]].act,item[apdTypeList_All[2]].act,item[apdTypeList_All[3]].act,item[apdTypeList_All[4]].act,item[apdTypeList_All[5]].act,item[apdTypeList_All[6]].act]
            resumeAPDData.table.table1[3] = ["Opp",item[apdTypeList_All[0]].opp,item[apdTypeList_All[1]].opp,item[apdTypeList_All[2]].opp,item[apdTypeList_All[3]].opp,item[apdTypeList_All[4]].opp,item[apdTypeList_All[5]].opp,item[apdTypeList_All[6]].opp]
            resumeAPDData.table.table1[4] = ["Score",form(item[apdTypeList_All[0]].score),form(item[apdTypeList_All[1]].score),form(item[apdTypeList_All[2]].score),form(item[apdTypeList_All[3]].score),form(item[apdTypeList_All[4]].score),form(item[apdTypeList_All[5]].score),form(item[apdTypeList_All[6]].score)]
            
            var nProfesi = 0;
            resumeAPDData.table["table2"] = [["","n"].concat(apdItem[1])]
            while (nProfesi < 4){
                var item2 = resumeAPDData.data[selectYMo][resumeFilter.apd.unit][profesiList[nProfesi]]
                var data = {
                    label : profesiList[nProfesi],
                    data : [cForm(item2[apdTypeList_All[0]].score),cForm(item2[apdTypeList_All[1]].score),cForm(item2[apdTypeList_All[2]].score),cForm(item2[apdTypeList_All[3]].score),cForm(item2[apdTypeList_All[4]].score),cForm(item2[apdTypeList_All[5]].score),cForm(item2[apdTypeList_All[6]].score)],
                    backgroundColor: color.serial[nProfesi]
                }
                resumeAPDData.chart["chart2"].dataset.push(data)
                var tab2Row = [profesiList[nProfesi],item2.n,form(item2[apdTypeList_All[0]].score),form(item2[apdTypeList_All[1]].score),form(item2[apdTypeList_All[2]].score),form(item2[apdTypeList_All[3]].score),form(item2[apdTypeList_All[4]].score),form(item2[apdTypeList_All[5]].score),form(item2[apdTypeList_All[6]].score)]
                resumeAPDData.table["table2"].push(tab2Row)
            nProfesi++
            }

        }} 
        // console.log(resumeAPDData)
        // return     
    } else {
        resumeAPDData.chart["chart1"].label = profesiAxes;
        resumeAPDData.table["table1"][0] = [""].concat(profesiAxes)
        resumeAPDData.chart["chart1"].dataset = [,,,,,]

        resumeAPDData.chart["chart2"].label = profesiAxes.slice(0,4);
        resumeAPDData.chart["chart2"].dataset = [{label:apdTypeListAxes2[0]},{label:apdTypeListAxes2[1]},{label:apdTypeListAxes2[2]},{label:apdTypeListAxes2[3]},{label:apdTypeListAxes2[4]},{label:apdTypeListAxes2[5]},{label:apdTypeListAxes2[6]}]
        
        console.log(apdTypeListAxes2[5])

        resumeAPDData.table["table2"] = [[""].concat(resumeAPDData.chart["chart2"].label),["n",0,0,0,0],[apdTypeListAxes2[0],"","","",""],[apdTypeListAxes2[1],"","","",""],[apdTypeListAxes2[2],"","","",""],[apdTypeListAxes2[3],"","","",""],[apdTypeListAxes2[4],"","","",""],[apdTypeListAxes2[5],"","","",""],[apdTypeListAxes2[6],"","","",""]]

        resumeAPDData.chart["chart4"].label = profesiAxes
        resumeAPDData.chart["chart4"].dataset = [{},{},{}]
        resumeAPDData.table["table4"] = [[""],["Dokter"],["Perawat Bidan"],["Magang Siswa"],["Lain-lain"],["Total"]]

        var profesiList2 = profesiList.concat("All")
        
        var n3Month = 0
        while(n3Month < 3){
            var ymo = (threeMonth[n3Month].year.toString() + (threeMonth[n3Month].month.toString().length === 1 ? ("0"+ threeMonth[n3Month].month.toString()) : (threeMonth[n3Month].month.toString())))*1
            resumeAPDData.table["table4"][0].push(shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year)
            if(resumeAPDData.data[ymo]){    
                var nPro4 = 0; var ch4Data = [] 
                while(nPro4 < profesiList2.length){
                    var chScore = "."; var tbScore = ""
                    if(resumeAPDData.data[ymo][resumeFilter.apd.unit]){
                        chScore = cForm(resumeAPDData.data[ymo][resumeFilter.apd.unit][profesiList2[nPro4]].total.score);
                        tbScore =  form(resumeAPDData.data[ymo][resumeFilter.apd.unit][profesiList2[nPro4]].total.score);
                    }

                    ch4Data.push(chScore)
                    resumeAPDData.table["table4"][1+nPro4].push(tbScore)
                nPro4++
                }
            } else {
                var ch4Data = [".",".",".",".",".","."]
                var nPro4 = 0;
                while(nPro4 < profesiList2.length){
                    resumeAPDData.table["table4"][1+nPro4].push("")
                nPro4++
                }
            }
            resumeAPDData.chart["chart4"].dataset[n3Month] = {
                label: shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year,
                data : ch4Data,
                backgroundColor : color.increase[n3Month]
            }

        n3Month++
        }
        
        if(!(!(resumeAPDData.data[selectYMo]))){if(!(!(resumeAPDData.data[selectYMo][resumeFilter.apd.unit]))){
            var item = resumeAPDData.data[selectYMo][resumeFilter.apd.unit] 
            resumeAPDData.chart["chart1"].dataset = [cForm(item["Dokter"].total.score),cForm(item["Perawat Bidan"].total.score), cForm(item["Magang Siswa"].total.score), cForm(item["Lain-lain"].total.score), cForm(item.All.total.score)]

            resumeAPDData.table.table1[1] = ["n",item["Dokter"].n,item["Perawat Bidan"].n,item["Magang Siswa"].n,item["Lain-lain"].n,item["All"].n]
            resumeAPDData.table.table1[2] = ["Act",item["Dokter"].total.act,item["Perawat Bidan"].total.act,item["Magang Siswa"].total.act,item["Lain-lain"].total.act,item["All"].total.act]
            resumeAPDData.table.table1[3] = ["Opp",item["Dokter"].total.opp,item["Perawat Bidan"].total.opp,item["Magang Siswa"].total.opp,item["Lain-lain"].total.opp,item["All"].total.opp]
            resumeAPDData.table.table1[4] = ["Score",form(item["Dokter"].total.score),form(item["Perawat Bidan"].total.score),form(item["Magang Siswa"].total.score),form(item["Lain-lain"].total.score),form(item["All"].total.score)]

            resumeAPDData.chart["chart2"].dataset = []
            resumeAPDData.table["table2"] = [[""].concat(profesiAxes.slice(0,4)),["n",item["Dokter"].n,item["Perawat Bidan"].n,item["Magang Siswa"].n,item["Perawat Bidan"].n]]

            var nAPD2 = 0;
            while(nAPD2  < 7){
                var dataItem = []; var nDataItem = 0
                while(nDataItem < 4){
                    var val = cForm(item[profesiList[nDataItem]][apdTypeList_All[nAPD2]].score)
                    dataItem.push(val)
                nDataItem ++
                } 
                var c2Item = {
                    label : apdTypeListAxes2[nAPD2],
                    data : dataItem,
                    backgroundColor: (nAPD2 < 5 ? color.serial[nAPD2] : color.total)
                }
                resumeAPDData.chart["chart2"].dataset.push(c2Item)
                
                resumeAPDData.table["table2"].push([apdTypeListAxes2[nAPD2], form(item["Dokter"][apdTypeList_All[nAPD2]].score), form(item["Perawat Bidan"][apdTypeList_All[nAPD2]].score), form(item["Magang Siswa"][apdTypeList_All[nAPD2]].score),form(item["Lain-lain"][apdTypeList_All[nAPD2]].score)])
            nAPD2++
            }
        }}

        resumeAPDData.chart["chart1"].barColor = [color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.total]
    }

    
    var monthList = Object.keys(resumeAPDData.data)
    var nCh3 = 0; var nCh3Max = monthList.length; 
    resumeAPDData.chart["chart3"] = {label: [], data:[]}
    while(nCh3 < nCh3Max){
        var year = monthList[nCh3].toString().substring(0,4) * 1
        var month = monthList[nCh3].toString().substring(4) * 1
        resumeAPDData.chart.chart3.label.push(shortMonthText[month] + " " + year)
        var cScore = ".";
        if(resumeAPDData.data[monthList[nCh3]][resumeFilter.apd.unit]){
            cScore = cForm(resumeAPDData.data[monthList[nCh3]][resumeFilter.apd.unit][resumeFilter.apd.group].total.score)
        }
        resumeAPDData.chart.chart3.data.push(cScore)
    nCh3++
    }

    var unitData1 = resumeAPDData.data[selectYMo]
    resumeAPDData.table["table5"] = []
    if(resumeAPDData.data[selectYMo]){
        var nUnitData1 = 0; var nUnitData1Len = Object.keys(unitData1).length
        while(nUnitData1 < nUnitData1Len){
            
            if(Object.keys(unitData1)[nUnitData1] !== "All" && Object.keys(unitData1)[nUnitData1] !== "n" ){
                var unitName = Object.keys(unitData1)[nUnitData1]
                var unitData = resumeAPDData.data[selectYMo][unitName]  
                resumeAPDData.table["table5"].push([
                    unitData.All.total.score,
                    form(unitData.All.total.score),unitName,unitData.All.n,
                    unitData["Dokter"].n > 0 ? form(unitData["Dokter"].total.score) : "",
                    unitData["Perawat Bidan"].n > 0 ? form(unitData["Perawat Bidan"].total.score) : "",
                    unitData["Magang Siswa"].n > 0 ? form(unitData["Magang Siswa"].total.score) : "",
                    unitData["Lain-lain"].n > 0 ? form(unitData["Lain-lain"].total.score) : "",
                    form(unitData.All[apdTypeList_All[0]].score),form(unitData.All[apdTypeList_All[1]].score),form(unitData.All[apdTypeList_All[2]].score),form(unitData.All[apdTypeList_All[3]].score),form(unitData.All[apdTypeList_All[4]].score),form(unitData.All[apdTypeList_All[5]].score)
                ])
            }
        nUnitData1++
        }
        resumeAPDData.table["table5"].sort((a,b)=>{
            if(resumeFilter.apd.top == "1-0"){return (b[0]) - (a[0])
            } else {return (a[0]) - (b[0])}
        })
    }

    function form(val){if(val == "") {return ""} else {return (Math.floor(val*1000)/10) + "%"}}
    function cForm(val){var r = val; if(val === 0 || val === ""){r = "."}; return r}
    // console.log(resumeFilter)
    console.log(resumeAPDData)
}
function updateResume_apd_OnChange_Title(){
    var monthText = {
        1:"Januari", 2:"Februari", 3:"Maret", 4:"April", 5:"Mei", 6:"Juni", 
        7:"Juli", 8:"Agustus", 9:"September", 10:"Oktober", 11:"November", 12:"Desember"
    }
    if(resumeFilter.apd.unit == "All"){var unitText = "Semua Unit"}
    else{var unitText = "Unit " + resumeFilter.apd.unit}
    if(resumeFilter.apd.by == "Profesi"){
        var groupText = ""
    }
    else{
        if(resumeFilter.apd.group == "All"){var groupText = "Semua Kelompok Profesi | "}
        else{var groupText = "Kelompok " + resumeFilter.apd.group + " | "}
    }
    var perSelect = resumeFilter.apd.by == "apdType" ? "Jenis APD" : "Profesi" 
    document.querySelector("#res-apd-title-1 p:nth-child(1)").innerHTML = "Kepatuhan APD Berdasarkan " + perSelect
    document.querySelector("#res-apd-title-1 p:nth-child(2)").innerHTML = groupText + unitText + " | Bulan " + monthText[resumeFilter.apd.month * 1] + " " + (resumeFilter.apd.year * 1) 
    document.querySelector("#res-apd-title-2 p:nth-child(2)").innerHTML = unitText + " | Bulan " + monthText[resumeFilter.apd.month * 1] + " " + (resumeFilter.apd.year * 1)
    document.querySelector("#res-apd-title-3 p:nth-child(2)").innerHTML = groupText + unitText
    document.querySelector("#res-apd-title-4 p:nth-child(1)").innerHTML = "Kepatuhan APD per 3 Bulan Berdasarkan " + perSelect
    document.querySelector("#res-apd-title-4 p:nth-child(2)").innerHTML = groupText + unitText + " | Bulan " + monthText[resumeFilter.apd.month * 1] + " " + (resumeFilter.apd.year * 1)
    document.querySelector("#res-apd-title-5 p:nth-child(1)").innerHTML = "TOP 10 " + (resumeFilter.apd.top == "1-0" ? "Tertinggi" : "Terendah") + " Kepatuhan APD Pada Unit";
    document.querySelector("#res-apd-title-5 p:nth-child(2)").innerHTML = "Bulan " + monthText[resumeFilter.apd.month * 1] + " " + (resumeFilter.apd.year * 1)
}
function updateResume_apd_onChange_Chart(){  
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
            labels: resumeAPDData.chart["chart1"].label,
            datasets: [{
                data: resumeAPDData.chart["chart1"].dataset,
                borderWidth: 1,
                backgroundColor: resumeAPDData.chart["chart1"].barColor
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {
                tooltip:{enabled:true,callbacks: {label: function(context) {let label = "";if(context.parsed.y !== null) {label += (context.parsed.y*100) + "%";}return label;}}},title: {display: true,padding: {top: 10},text:""},legend: {display: false},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
        Elem("res-apd-canvas-1").innerHTML = ""
        Elem("res-apd-canvas-1").appendChild(canva1) 
    
    new Chart(canva2, {
        type: 'bar',
        data: {
            labels: resumeAPDData.chart.chart2.label,
            datasets: resumeAPDData.chart.chart2.dataset
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {tooltip:{enabled:true,callbacks: {label: function(context) {let label = "";if(context.parsed.y !== null) {label += (context.parsed.y*100) + "%";}return label;}}},title: {display: true,padding: {top: 10}, text:""},legend: {display: true, position: "bottom"},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    Elem("res-apd-canvas-2").innerHTML = ""
    Elem("res-apd-canvas-2").appendChild(canva2)   
    
    new Chart(canva3, {
        type: 'line',
        data: {
            labels: resumeAPDData.chart.chart3.label,
            datasets: [{
                data: resumeAPDData.chart.chart3.data,
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
    Elem("res-apd-canvas-3").innerHTML = ""
    Elem("res-apd-canvas-3").appendChild(canva3)
    var maxLongMonth = 13
    if(resumeAPDData.chart.chart3.label.length > maxLongMonth){
        Elem("res-apd-canvas-3").style.width = (resumeAPDData.chart.chart3.label.length/maxLongMonth*900)  +"px"
    }
    var scrollMonthIndex =  resumeAPDData.chart.chart3.label.indexOf(
        shortMonthText[resumeFilter.apd.month] + " " + resumeFilter.apd.year   
    )
    var x = scrollMonthIndex
    if(scrollMonthIndex < 0){
        var scrollMonth = Elem("res-apd-canvas-3").offsetWidth  
    } else {
        scrollMonth = ((x * 1) - 3 )  / resumeAPDData.chart.chart3.label.length * (Elem("res-apd-canvas-3").offsetWidth * 1) 
    }
    Elem("res-apd-canvas-3-parent").scrollTo(scrollMonth,0)

    new Chart(canva4, {
        type: 'bar',
        data: {
            labels: resumeAPDData.chart.chart4.label,
            datasets: resumeAPDData.chart.chart4.dataset
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return (Math.floor(value*1000)/10) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {tooltip:{enabled:true,callbacks: {label: function(context) {let label = "";if(context.parsed.y !== null) {label += (context.parsed.y*100) + "%";}return label;}}},title: {display: true,padding: {top: 10}, text:""},legend: {display: true, position: "bottom"},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    Elem("res-apd-canvas-4").innerHTML = ""
    Elem("res-apd-canvas-4").appendChild(canva4)
        
}
function updateResume_apd_onChange_Table(){
    var table1 = Elem("tab-res-apd-1")    
        var tab1Head = table1.querySelector("thead tr");tab1Head.innerHTML = ""
        var tab1Body = table1.querySelector("tbody");tab1Body.innerHTML = ""
        var tab1Foot = table1.querySelector("tfoot tr");tab1Foot.innerHTML = ""
        var nTab1Row = 0; var nTab1Col = 0; var nTab1ColMax = resumeAPDData.table["table1"][0].length
        while(nTab1Row < 5){
            if(nTab1Row > 0 && nTab1Row < 4){
                var trBody = document.createElement("tr")
            }
            while(nTab1Col < nTab1ColMax){
                if(nTab1Row === 0){
                    var thNew_head = document.createElement("th")
                    thNew_head.setAttribute("scope", "col")
                    thNew_head.innerHTML = resumeAPDData.table["table1"][0][nTab1Col]
                    tab1Head.appendChild(thNew_head)
                    // console.log(tab1Head)
                }
                else if(nTab1Row > 0 && nTab1Row < 4){
                    if(nTab1Col === 0){
                        var td = document.createElement("th")
                        td.setAttribute("scope", "row")
                    } else {var td = document.createElement("td")}
                    td.innerHTML = resumeAPDData.table["table1"][nTab1Row][nTab1Col]
                    // console.log(td)
                    trBody.appendChild(td)
                }
                else {
                    var thFoot = document.createElement("th")
                    thFoot.setAttribute("scope", "col")
                    thFoot.innerHTML = resumeAPDData.table["table1"][4][nTab1Col]
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
    var table2 = Elem("tab-res-apd-2")
        var tab2Head = table2.querySelector("thead tr");tab2Head.innerHTML = ""
        var tab2Body = table2.querySelector("tbody"); tab2Body.innerHTML = ""
        var tab2Foot = table2.querySelector("tfoot tr"); tab2Foot.innerHTML = ""
        var nTab2Row = 0; var nTab2Col = 0; var nTab2RowMax = resumeAPDData.table["table2"].length;var nTab2ColMax = resumeAPDData.table["table2"][0].length
        while(nTab2Row < nTab2RowMax){
            if(nTab2Row === 0){
                var nHeadCol = 0;
                while(nHeadCol < nTab2ColMax){
                    var thNew_head = document.createElement("th")
                    thNew_head.setAttribute("scope", "col")
                    thNew_head.innerHTML = resumeAPDData.table["table2"][0][nHeadCol]
                    tab2Head.appendChild(thNew_head)
                nHeadCol++
                }
            } else {
                if(nTab2RowMax === 9 && nTab2Row == 8){
                    var nFootCol = 0
                    while(nFootCol < nTab2ColMax){
                        var thNew_foot = document.createElement("th")
                            thNew_foot.setAttribute("scope", "col")
                            thNew_foot.innerHTML = resumeAPDData.table["table2"][8][nFootCol]
                            tab2Foot.appendChild(thNew_foot)
                    nFootCol++
                    }
                }
                else {
                    var trNew = document.createElement("tr")
                    var thBody = document.createElement("th")
                        thBody.setAttribute("score", "row")
                        thBody.innerHTML =  resumeAPDData.table["table2"][nTab2Row][0]
                        trNew.appendChild(thBody)
                    var nBodyCol = 1
                    while (nBodyCol<nTab2ColMax){
                        var tdBody = document.createElement("td")
                            tdBody.innerHTML = resumeAPDData.table["table2"][nTab2Row][nBodyCol]
                        trNew.appendChild(tdBody)
                    nBodyCol++
                    }
                    tab2Body.appendChild(trNew)
                }
            }
        nTab2Row++
        }
        
    var table4 = Elem("tab-res-apd-4")
        var tab4Head = table4.querySelector("thead tr");tab4Head.innerHTML = ""
        var tab4Body = table4.querySelector("tbody"); tab4Body.innerHTML = ""
        var tab4Foot = table4.querySelector("tfoot tr"); tab4Foot.innerHTML = ""
        var nTab4Row = 0; var nTab4RowMax = resumeAPDData.table.table4.length 
        while(nTab4Row < nTab4RowMax){
            var nTab4Col = 0;
            if (nTab4Row > 0 && nTab4Row !== (nTab4RowMax-1)){var trNew_Body = document.createElement("tr")}
            while(nTab4Col < 4){
                if(nTab4Row === 0){
                    var thNew_head = document.createElement("th"); thNew_head.setAttribute("scope", "col")
                    thNew_head.innerHTML = resumeAPDData.table.table4[0][nTab4Col]
                    tab4Head.appendChild(thNew_head)
                }
                else if (nTab4Row > 0 && nTab4Row !== (nTab4RowMax-1)){
                    if(nTab4Col === 0){var td = document.createElement("th"); td.setAttribute("scope","row")}
                    else {var td = document.createElement("td")}
                    td.innerHTML = resumeAPDData.table.table4[nTab4Row][nTab4Col]
                    trNew_Body.appendChild(td)
                } else {
                    var thNew_foot = document.createElement("th"); 
                    thNew_foot.setAttribute("scope", "col")
                    thNew_foot.innerHTML = resumeAPDData.table.table4[nTab4Row][nTab4Col]
                    tab4Foot.appendChild(thNew_foot)
                }
            nTab4Col++
            }    
            // console.log(trNew_Body)
            if (nTab4Row > 0 && nTab4Row !== (nTab4RowMax-1)){tab4Body.appendChild(trNew_Body)}
        nTab4Row++
        }
        
    var table5 = Elem("tab-res-apd-5")
    var table5Body = table5.querySelector("tbody")
        table5Body.innerHTML = ""
        if(resumeAPDData.table["table5"].length > 0){  
            for(var i = 0; i<10;i++){
                var tr = document.createElement("tr")
                var td1 = document.createElement("td")
                    td1.innerHTML = i+1;
                    td1.classList.add("border-end") 
                    tr.appendChild(td1)
                var j = 1
                while(j < 13){
                    var td = document.createElement("td")
                    td.innerHTML =  resumeAPDData.table.table5[i][j]
                    if(j > 3 && j < 8){
                        td.classList.add("d-none"); 
                        td.classList.add("res-apd-tab-group");
                        if(j === 4){td.classList.add("border-start")}
                    }
                    if(j > 7){
                        td.classList.add("d-none"); 
                        td.classList.add("res-apd-tab-type");
                        if(j === 8){td.classList.add("border-start")}
                    }
                    tr.appendChild(td)
                j++    
                }
                
                // return
                // var td2 = document.createElement("td")
                //     td2.innerHTML =  resumeAPDData.table["table5"][i][1];
                //     tr.appendChild(td2)
                // var td3 = document.createElement("td")
                //     td3.innerHTML = resumeAPDData.table["table5"][i].unitName; tr.appendChild(td3)
                // var td4 = document.createElement("td")
                //     td4.innerHTML = resumeAPDData.table["table5"][i].n; tr.appendChild(td4)
                // var tdDok = document.createElement("td"); tdDok.innerHTML = resumeAPDData.table["table5"][i]["Dokter"]; tdDok.classList.add("d-none"); tdDok.classList.add("res-apd-tab-group"); tr.appendChild(tdDok)    
                // var tdPer = document.createElement("td"); tdPer.innerHTML = resumeAPDData.table["table5"][i]["Perawat Bidan"]; tdPer.classList.add("d-none"); tdPer.classList.add("res-apd-tab-group"); tr.appendChild(tdPer)
                // var tdMag = document.createElement("td"); tdMag.innerHTML = resumeAPDData.table["table5"][i]["Magang Siswa"]; tdMag.classList.add("d-none"); tdMag.classList.add("res-apd-tab-group"); tr.appendChild(tdMag)
                // var tdLai = document.createElement("td"); tdLai.innerHTML = resumeAPDData.table["table5"][i]["Lain-lain"]; tdLai.classList.add("d-none"); tdLai.classList.add("res-apd-tab-group"); tr.appendChild(tdLai)
                // for(var j = 1; j<6; j++){var td = document.createElement("td"); td.innerHTML = resumeAPDData.table["table5"][i]["mo"+j]; ; td.classList.add("d-none"); td.classList.add("res-apd-tab-moment"); tr.appendChild(td) }
                table5Body.appendChild(tr)
            }
        }
}
// function tab5show(elem){
//     var cla = elem.getAttribute("tab5")
//     document.querySelectorAll("." + cla).forEach((p)=>{
//         p.classList.add("d-none")
//         if(elem.checked){p.classList.remove("d-none")}
//     })
// }