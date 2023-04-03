

var resumeSPVData = {data: {}, chart:{}, table:{}}

function ResetResume_SPV(){
    console.log("ResetResume_SPV")
    return
    var today = new Date()
    Elem("resume-filter-spv-bulan").value = today.getMonth() 
    Elem("resume-filter-spv-tahun").value = today.getFullYear() 
    var filterspvUnit = Elem("resume-filter-spv-unit")
        filterspvUnit.innerHTML = ""
        var firstOpt = Elem("resume-filter-spv-unit-first").cloneNode(true)
        filterspvUnit.appendChild(firstOpt)
        for(var i = 0; i < database.unitData.length; i++){
            var opt = document.createElement("option")
            opt.value = database.unitData[i].name
            opt.innerHTML = database.unitData[i].name
            filterspvUnit.appendChild(opt)
        }
    var resumeFilterspvDefault = {
        month : Elem("resume-filter-spv-bulan").value,
        year : Elem("resume-filter-spv-tahun").value,
        group: "All",
        unit: "All",
        by: "spvType",
        top: "1-0"
    }
    resumeFilter.spv = resumeFilterspvDefault
    updateResume_spv_Data()
    updateResume_spv_OnChange()
}
function updateResume_spv_OnChange(){
    console.log("updateResume_spv_OnChange")
    // spinner(true)
    Elem("resume-spv-tab5-profesi").checked = false; tab5show(Elem("resume-spv-tab5-profesi"))
    Elem("resume-spv-tab5-type").checked = false; tab5show(Elem("resume-spv-tab5-type"))
    updateResume_spv_OnChange_Pra()
    updateResume_spv_OnChange_Title()
    updateResume_spv_onChange_Chart()
    updateResume_spv_onChange_Table()
    
    // spinner(false)
}
function updateResume_spv_Data(){
    var profesiList_ALL = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain", "All"]
    resumespvData.data = {}
    console.log(database.spvData)
    var iData = 0; var len = database.spvData.length;
    var perUnitData = {}
    var nProfesiListAll = 0
    while(nProfesiListAll<profesiList_ALL.length){
        perUnitData[profesiList_ALL[nProfesiListAll]] = {n:0}
        var nspvType = 0; var spvType = spvItem[0].concat("total")
        while(nspvType < spvType.length){
            perUnitData[profesiList_ALL[nProfesiListAll]][spvType[nspvType]] = {
                act: 0, opp: 0, score: ""
            }
        nspvType++
        }
    nProfesiListAll++
    }
    
    while(iData < len){
        var item = database.spvData[iData]
        var yMo = (item.year.toString() + (item.month.toString().length === 1 ? ("0"+ item.month) : item.month.toString()))*1

        if(!(resumespvData.data[yMo])){resumespvData.data[yMo] = {}}
        if(!(resumespvData.data[yMo]["n"])){resumespvData.data[yMo]["n"] = 0}
        
        if(!(resumespvData.data[yMo]["All"])){
            resumespvData.data[yMo]["All"] = {}
            var nProfesiListAll = 0
            while(nProfesiListAll<profesiList_ALL.length){
                resumespvData.data[yMo]["All"][profesiList_ALL[nProfesiListAll]] = {n:0}
                var nspvType = 0; var spvType = spvItem[0].concat("total")
                while(nspvType < spvType.length){
                    resumespvData.data[yMo]["All"][profesiList_ALL[nProfesiListAll]][spvType[nspvType]] = {
                        act: 0, opp: 0, score: ""
                    }
                nspvType++
                }
            nProfesiListAll++
            }
        }
        if(!(resumespvData.data[yMo][item.unit])){
            resumespvData.data[yMo][item.unit] = {}
            var nProfesiListAll = 0
            while(nProfesiListAll<profesiList_ALL.length){
                resumespvData.data[yMo][item.unit][profesiList_ALL[nProfesiListAll]] = {n:0}
                var nspvType = 0; var spvType = spvItem[0].concat("total")
                while(nspvType < spvType.length){
                    resumespvData.data[yMo][item.unit][profesiList_ALL[nProfesiListAll]][spvType[nspvType]] = {
                        act: 0, opp: 0, score: ""
                    }
                nspvType++
                }
            nProfesiListAll++
            }
        }
                        
        resumespvData.data[yMo].n += 1
        resumespvData.data[yMo].All.All.n += 1
        resumespvData.data[yMo].All[item.group].n += 1
        resumespvData.data[yMo][item.unit].All.n += 1
        resumespvData.data[yMo][item.unit][item.group].n += 1

        nPro = 0
        while(nPro < spvItem[0].length){
            var spvItemSel = spvItem[0][nPro] 
            if(item[spvItemSel] !== ""){
                resumespvData.data[yMo][item.unit][item.group][spvItemSel].opp += 1
                resumespvData.data[yMo][item.unit][item.group].total.opp += 1
                resumespvData.data[yMo][item.unit].All[spvItemSel].opp += 1
                resumespvData.data[yMo][item.unit].All.total.opp += 1
                resumespvData.data[yMo].All[item.group][spvItemSel].opp += 1
                resumespvData.data[yMo].All[item.group].total.opp += 1
                resumespvData.data[yMo].All.All[spvItemSel].opp += 1
                resumespvData.data[yMo].All.All.total.opp += 1
                if(item[spvItemSel]){
                    resumespvData.data[yMo][item.unit][item.group][spvItemSel].act += 1
                    resumespvData.data[yMo][item.unit][item.group].total.act += 1
                    resumespvData.data[yMo][item.unit].All[spvItemSel].act += 1
                    resumespvData.data[yMo][item.unit].All.total.act += 1
                    resumespvData.data[yMo].All[item.group][spvItemSel].act += 1
                    resumespvData.data[yMo].All[item.group].total.act += 1
                    resumespvData.data[yMo].All.All[spvItemSel].act += 1
                    resumespvData.data[yMo].All.All.total.act += 1
                }
            }
            if(resumespvData.data[yMo][item.unit][item.group][spvItemSel].opp > 0){
                var s = resumespvData.data[yMo][item.unit][item.group][spvItemSel].act/resumespvData.data[yMo][item.unit][item.group][spvItemSel].opp
                resumespvData.data[yMo][item.unit][item.group][spvItemSel].score = Math.floor(s*1000)/1000
            }
            if(resumespvData.data[yMo][item.unit][item.group].total.opp > 0){
                var s = resumespvData.data[yMo][item.unit][item.group].total.act/resumespvData.data[yMo][item.unit][item.group].total.opp
                resumespvData.data[yMo][item.unit][item.group].total.score = Math.floor(s*1000)/1000
            }
            if(resumespvData.data[yMo][item.unit].All[spvItemSel].opp > 0){
                var s = resumespvData.data[yMo][item.unit].All[spvItemSel].act/resumespvData.data[yMo][item.unit].All[spvItemSel].opp
                resumespvData.data[yMo][item.unit].All[spvItemSel].score = Math.floor(s*1000)/1000
            }
            if(resumespvData.data[yMo][item.unit].All.total.opp > 0){
                var s = resumespvData.data[yMo][item.unit].All.total.act/resumespvData.data[yMo][item.unit].All.total.opp
                resumespvData.data[yMo][item.unit].All.total.score = Math.floor(s*1000)/1000
            }
            if(resumespvData.data[yMo].All[item.group][spvItemSel].opp > 0){
                var s = resumespvData.data[yMo].All[item.group][spvItemSel].act/resumespvData.data[yMo].All[item.group][spvItemSel].opp
                resumespvData.data[yMo].All[item.group][spvItemSel].score = Math.floor(s*1000)/1000
            }
            if(resumespvData.data[yMo].All[item.group].total.opp > 0){
                var s = resumespvData.data[yMo].All[item.group].total.act/resumespvData.data[yMo].All[item.group].total.opp
                resumespvData.data[yMo].All[item.group].total.score = Math.floor(s*1000)/1000
            }
            if(resumespvData.data[yMo].All.All[spvItemSel].opp > 0){
                var s = resumespvData.data[yMo].All.All[spvItemSel].act/resumespvData.data[yMo].All.All[spvItemSel].opp
                resumespvData.data[yMo].All.All[spvItemSel].score = Math.floor(s*1000)/1000
            }
            if(resumespvData.data[yMo].All.All.total.opp > 0){
                var s = resumespvData.data[yMo].All.All.total.act/resumespvData.data[yMo].All.All.total.opp
                resumespvData.data[yMo].All.All.total.score = Math.floor(s*1000)/1000
            }
        nPro++
        }
    iData++
    }
    console.log("resumespvData:")
    console.log(resumespvData)
}
function spvDataFilter(month, year, group, unit){
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
        act = database.spvData.filter((p)=>{
            var groupTrue = true;
            var unitTrue = true;
            if(group !== "All"){groupTrue = (p.group == group)}
            if(unit !== "All"){unitTrue = (p.unit == unit)}
            return (p["mo"+i]) && (p.month*1 == month*1) && (p.year*1 == year*1) && groupTrue && unitTrue
        }).length
        opp = database.spvData.filter((p)=>{
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
function updateResume_spv_OnChange_Pra(){
    var shortMonthText = {
        1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
        7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
    }
    var profesiList = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain"]
    var spvTypeListAxes = spvItem[1]
    var spvTypeListAxes2 = spvTypeListAxes.concat("Total")
    var spvTypeList_All = spvItem[0].concat("total")
    
    resumespvData.chart["chart1"] = {label:[], dataset:[], barColor:[]}
    resumespvData.table["table1"] = [[],["n","","","","","",""],["Act","","","","","",""],["Opp","","","","","",""],["Score","","","","","",""]]
    resumespvData.chart["chart2"] = {label:[], dataset:[]}
    resumespvData.chart["chart4"] = {label:[], dataset:[]}
    
    var selectYMo = (resumeFilter.spv.year.toString() + (resumeFilter.spv.month.toString().length === 1 ? ("0"+ resumeFilter.spv.month) : resumeFilter.spv.month.toString()))*1
    var threeMonth = [
        {
            month: resumeFilter.spv.month - 2 + (resumeFilter.spv.month < 3 ? 12 : 0),
            year: resumeFilter.spv.year - 1 + (resumeFilter.spv.month < 3 ? 0 : 1)
        },
        {
            month: resumeFilter.spv.month - 1 + (resumeFilter.spv.month < 2 ? 12 : 0),
            year: resumeFilter.spv.year - 1 + (resumeFilter.spv.month < 2 ? 0 : 1)
        },
        {month: resumeFilter.spv.month * 1, year: resumeFilter.spv.year * 1}
    ]
    
    if(resumeFilter.spv.by == "spvType"){
        resumespvData.chart["chart1"].label = spvTypeListAxes.concat("Total");
        resumespvData.chart["chart2"].label = spvTypeListAxes.concat("Total");
        resumespvData.table["table1"][0] = [""].concat(spvTypeListAxes).concat("Total")
        resumespvData.chart["chart1"].dataset = [,,,,,,]
        resumespvData.table["table2"] = [["","n"].concat(spvTypeListAxes).concat("Total"),["Dokter","","","","","","","",""],["Perawat Bidan","","","","","","","",""],["Magang Siswa","","","","","","","",""],["lain-lain","","","","","","","",""]]
        resumespvData.chart["chart4"].label = spvTypeListAxes.concat("Total");
        resumespvData.chart["chart4"].dataset = [{},{},{}]
        resumespvData.table["table4"] = [[""],[spvTypeListAxes[0]],[spvTypeListAxes[1]],[spvTypeListAxes[2]],[spvTypeListAxes[3]],[spvTypeListAxes[4]],[spvTypeListAxes[5]],["Total"]]
        
        var n3Month = 0
        while(n3Month < 3){
            var ymo = (threeMonth[n3Month].year.toString() + (threeMonth[n3Month].month.toString().length === 1 ? ("0"+ threeMonth[n3Month].month.toString()) : (threeMonth[n3Month].month.toString())))*1
            
            if(resumespvData.data[ymo]){    
                var nType4 = 0; var ch4Data = []
                while (nType4 < 7){
                    var chScore = "."; var tbScore = "-"
                    if(resumespvData.data[ymo][resumeFilter.spv.unit]){
                        chScore = cForm(resumespvData.data[ymo][resumeFilter.spv.unit][resumeFilter.spv.group][spvTypeList_All[nType4]].score);
                        tbScore =  form(resumespvData.data[ymo][resumeFilter.spv.unit][resumeFilter.spv.group][spvTypeList_All[nType4]].score);
                    }

                    ch4Data.push(chScore)
                    resumespvData.table["table4"][1+nType4].push(tbScore)
                nType4++
                }
            } else {
                var ch4Data = [".",".",".",".",".","."]
                var nType4 = 0; var ch4Data = []
                while (nType4 < 7){
                    resumespvData.table["table4"][1+nType4].push("")
                nType4++
                }
            }
            resumespvData.chart["chart4"].dataset[n3Month] = {
                label: shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year,
                data : ch4Data,
                backgroundColor : color.increase[n3Month]
            }
            
            resumespvData.table["table4"][0].push(shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year)

        n3Month++
        }

        if(!(!(resumespvData.data[selectYMo]))){if(!(!(resumespvData.data[selectYMo][resumeFilter.spv.unit]))){
            var item = resumespvData.data[selectYMo][resumeFilter.spv.unit][resumeFilter.spv.group]
            resumespvData.chart["chart1"].dataset = [
                cForm(item[spvTypeList_All[0]].score),cForm(item[spvTypeList_All[1]].score),cForm(item[spvTypeList_All[2]].score),cForm(item[spvTypeList_All[3]].score),cForm(item[spvTypeList_All[4]].score),cForm(item[spvTypeList_All[5]].score),cForm(item[spvTypeList_All[6]].score)]
            resumespvData.chart["chart1"].barColor = [color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.total]
            resumespvData.table.table1[1] = ["n","","","","","","",item.n]
            resumespvData.table.table1[2] = ["Act",item[spvTypeList_All[0]].act,item[spvTypeList_All[1]].act,item[spvTypeList_All[2]].act,item[spvTypeList_All[3]].act,item[spvTypeList_All[4]].act,item[spvTypeList_All[5]].act,item[spvTypeList_All[6]].act]
            resumespvData.table.table1[3] = ["Opp",item[spvTypeList_All[0]].opp,item[spvTypeList_All[1]].opp,item[spvTypeList_All[2]].opp,item[spvTypeList_All[3]].opp,item[spvTypeList_All[4]].opp,item[spvTypeList_All[5]].opp,item[spvTypeList_All[6]].opp]
            resumespvData.table.table1[4] = ["Score",form(item[spvTypeList_All[0]].score),form(item[spvTypeList_All[1]].score),form(item[spvTypeList_All[2]].score),form(item[spvTypeList_All[3]].score),form(item[spvTypeList_All[4]].score),form(item[spvTypeList_All[5]].score),form(item[spvTypeList_All[6]].score)]
            
            var nProfesi = 0;
            resumespvData.table["table2"] = [["","n"].concat(spvItem[1])]
            while (nProfesi < 4){
                var item2 = resumespvData.data[selectYMo][resumeFilter.spv.unit][profesiList[nProfesi]]
                var data = {
                    label : profesiList[nProfesi],
                    data : [cForm(item2[spvTypeList_All[0]].score),cForm(item2[spvTypeList_All[1]].score),cForm(item2[spvTypeList_All[2]].score),cForm(item2[spvTypeList_All[3]].score),cForm(item2[spvTypeList_All[4]].score),cForm(item2[spvTypeList_All[5]].score),cForm(item2[spvTypeList_All[6]].score)],
                    backgroundColor: color.serial[nProfesi]
                }
                resumespvData.chart["chart2"].dataset.push(data)
                var tab2Row = [profesiList[nProfesi],item2.n,form(item2[spvTypeList_All[0]].score),form(item2[spvTypeList_All[1]].score),form(item2[spvTypeList_All[2]].score),form(item2[spvTypeList_All[3]].score),form(item2[spvTypeList_All[4]].score),form(item2[spvTypeList_All[5]].score),form(item2[spvTypeList_All[6]].score)]
                resumespvData.table["table2"].push(tab2Row)
            nProfesi++
            }

        }} 
        // console.log(resumespvData)
        // return     
    } else {
        resumespvData.chart["chart1"].label = profesiAxes;
        resumespvData.table["table1"][0] = [""].concat(profesiAxes)
        resumespvData.chart["chart1"].dataset = [,,,,,]

        resumespvData.chart["chart2"].label = profesiAxes.slice(0,4);
        resumespvData.chart["chart2"].dataset = [{label:spvTypeListAxes2[0]},{label:spvTypeListAxes2[1]},{label:spvTypeListAxes2[2]},{label:spvTypeListAxes2[3]},{label:spvTypeListAxes2[4]},{label:spvTypeListAxes2[5]},{label:spvTypeListAxes2[6]}]
        
        console.log(spvTypeListAxes2[5])

        resumespvData.table["table2"] = [[""].concat(resumespvData.chart["chart2"].label),["n",0,0,0,0],[spvTypeListAxes2[0],"","","",""],[spvTypeListAxes2[1],"","","",""],[spvTypeListAxes2[2],"","","",""],[spvTypeListAxes2[3],"","","",""],[spvTypeListAxes2[4],"","","",""],[spvTypeListAxes2[5],"","","",""],[spvTypeListAxes2[6],"","","",""]]

        resumespvData.chart["chart4"].label = profesiAxes
        resumespvData.chart["chart4"].dataset = [{},{},{}]
        resumespvData.table["table4"] = [[""],["Dokter"],["Perawat Bidan"],["Magang Siswa"],["Lain-lain"],["Total"]]

        var profesiList2 = profesiList.concat("All")
        
        var n3Month = 0
        while(n3Month < 3){
            var ymo = (threeMonth[n3Month].year.toString() + (threeMonth[n3Month].month.toString().length === 1 ? ("0"+ threeMonth[n3Month].month.toString()) : (threeMonth[n3Month].month.toString())))*1
            resumespvData.table["table4"][0].push(shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year)
            if(resumespvData.data[ymo]){    
                var nPro4 = 0; var ch4Data = [] 
                while(nPro4 < profesiList2.length){
                    var chScore = "."; var tbScore = "-"
                    if(resumespvData.data[ymo][resumeFilter.spv.unit]){
                        chScore = cForm(resumespvData.data[ymo][resumeFilter.spv.unit][profesiList2[nPro4]].total.score);
                        tbScore =  form(resumespvData.data[ymo][resumeFilter.spv.unit][profesiList2[nPro4]].total.score);
                    }

                    ch4Data.push(chScore)
                    resumespvData.table["table4"][1+nPro4].push(tbScore)
                nPro4++
                }
            } else {
                var ch4Data = [".",".",".",".",".","."]
                var nPro4 = 0;
                while(nPro4 < profesiList2.length){
                    resumespvData.table["table4"][1+nPro4].push("")
                nPro4++
                }
            }
            resumespvData.chart["chart4"].dataset[n3Month] = {
                label: shortMonthText[threeMonth[n3Month].month] + " " + threeMonth[n3Month].year,
                data : ch4Data,
                backgroundColor : color.increase[n3Month]
            }

        n3Month++
        }
        
        if(!(!(resumespvData.data[selectYMo]))){if(!(!(resumespvData.data[selectYMo][resumeFilter.spv.unit]))){
            var item = resumespvData.data[selectYMo][resumeFilter.spv.unit] 
            resumespvData.chart["chart1"].dataset = [cForm(item["Dokter"].total.score),cForm(item["Perawat Bidan"].total.score), cForm(item["Magang Siswa"].total.score), cForm(item["Lain-lain"].total.score), cForm(item.All.total.score)]

            resumespvData.table.table1[1] = ["n",item["Dokter"].n,item["Perawat Bidan"].n,item["Magang Siswa"].n,item["Lain-lain"].n,item["All"].n]
            resumespvData.table.table1[2] = ["Act",item["Dokter"].total.act,item["Perawat Bidan"].total.act,item["Magang Siswa"].total.act,item["Lain-lain"].total.act,item["All"].total.act]
            resumespvData.table.table1[3] = ["Opp",item["Dokter"].total.opp,item["Perawat Bidan"].total.opp,item["Magang Siswa"].total.opp,item["Lain-lain"].total.opp,item["All"].total.opp]
            resumespvData.table.table1[4] = ["Score",form(item["Dokter"].total.score),form(item["Perawat Bidan"].total.score),form(item["Magang Siswa"].total.score),form(item["Lain-lain"].total.score),form(item["All"].total.score)]

            resumespvData.chart["chart2"].dataset = []
            resumespvData.table["table2"] = [[""].concat(profesiAxes.slice(0,4)),["n",item["Dokter"].n,item["Perawat Bidan"].n,item["Magang Siswa"].n,item["Perawat Bidan"].n]]

            var nspv2 = 0;
            while(nspv2  < 7){
                var dataItem = []; var nDataItem = 0
                while(nDataItem < 4){
                    var val = cForm(item[profesiList[nDataItem]][spvTypeList_All[nspv2]].score)
                    dataItem.push(val)
                nDataItem ++
                } 
                var c2Item = {
                    label : spvTypeListAxes2[nspv2],
                    data : dataItem,
                    backgroundColor: (nspv2 < 5 ? color.serial[nspv2] : color.total)
                }
                resumespvData.chart["chart2"].dataset.push(c2Item)
                
                resumespvData.table["table2"].push([spvTypeListAxes2[nspv2], form(item["Dokter"][spvTypeList_All[nspv2]].score), form(item["Perawat Bidan"][spvTypeList_All[nspv2]].score), form(item["Magang Siswa"][spvTypeList_All[nspv2]].score),form(item["Lain-lain"][spvTypeList_All[nspv2]].score)])
            nspv2++
            }
        }}

        resumespvData.chart["chart1"].barColor = [color.serial[0],color.serial[0],color.serial[0],color.serial[0],color.total]
    }

    
    var monthList = Object.keys(resumespvData.data)
    var nCh3 = 0; var nCh3Max = monthList.length; 
    resumespvData.chart["chart3"] = {label: [], data:[]}
    while(nCh3 < nCh3Max){
        var year = monthList[nCh3].toString().substring(0,4) * 1
        var month = monthList[nCh3].toString().substring(4) * 1
        resumespvData.chart.chart3.label.push(shortMonthText[month] + " " + year)
        // var cScore = ".";
        if(resumespvData.data[monthList[nCh3]][resumeFilter.spv.unit]){
            var score = {
                x: shortMonthText[month] + " " + year,
                y: cForm(resumespvData.data[monthList[nCh3]][resumeFilter.spv.unit][resumeFilter.spv.group].total.score)
            }; 
            resumespvData.chart.chart3.data.push(score)
            // cScore = cForm(resumespvData.data[monthList[nCh3]][resumeFilter.spv.unit][resumeFilter.spv.group].total.score)
            // resumespvData.chart.chart3.data.push(cScore)
        }
    nCh3++
    }

    var unitData1 = resumespvData.data[selectYMo]
    resumespvData.table["table5"] = []
    if(resumespvData.data[selectYMo]){
        var nUnitData1 = 0; var nUnitData1Len = Object.keys(unitData1).length
        while(nUnitData1 < nUnitData1Len){
            
            if(Object.keys(unitData1)[nUnitData1] !== "All" && Object.keys(unitData1)[nUnitData1] !== "n" ){
                var unitName = Object.keys(unitData1)[nUnitData1]
                var unitData = resumespvData.data[selectYMo][unitName]  
                resumespvData.table["table5"].push([
                    unitData.All.total.score,
                    form(unitData.All.total.score),unitName,unitData.All.n,
                    unitData["Dokter"].n > 0 ? form(unitData["Dokter"].total.score) : "",
                    unitData["Perawat Bidan"].n > 0 ? form(unitData["Perawat Bidan"].total.score) : "",
                    unitData["Magang Siswa"].n > 0 ? form(unitData["Magang Siswa"].total.score) : "",
                    unitData["Lain-lain"].n > 0 ? form(unitData["Lain-lain"].total.score) : "",
                    form(unitData.All[spvTypeList_All[0]].score),form(unitData.All[spvTypeList_All[1]].score),form(unitData.All[spvTypeList_All[2]].score),form(unitData.All[spvTypeList_All[3]].score),form(unitData.All[spvTypeList_All[4]].score),form(unitData.All[spvTypeList_All[5]].score)
                ])
            }
        nUnitData1++
        }
        resumespvData.table["table5"].sort((a,b)=>{
            if(resumeFilter.spv.top == "1-0"){return (b[0]) - (a[0])
            } else {return (a[0]) - (b[0])}
        })
    }

    function form(val){if(val === "") {return "-"} else {return (Math.floor(val*1000)/10) + "%"}}
    function cForm(val){
        var r = val; 
        if(val === "" || val == undefined){r = "."}; 
        return r
    }    
    
    console.log(resumespvData)
}
function updateResume_spv_OnChange_Title(){
    var monthText = {
        1:"Januari", 2:"Februari", 3:"Maret", 4:"April", 5:"Mei", 6:"Juni", 
        7:"Juli", 8:"Agustus", 9:"September", 10:"Oktober", 11:"November", 12:"Desember"
    }
    if(resumeFilter.spv.unit == "All"){var unitText = "Semua Unit"}
    else{var unitText = "Unit " + resumeFilter.spv.unit}
    if(resumeFilter.spv.by == "Profesi"){
        var groupText = ""
    }
    else{
        if(resumeFilter.spv.group == "All"){var groupText = "Semua Kelompok Profesi | "}
        else{var groupText = "Kelompok " + resumeFilter.spv.group + " | "}
    }
    var perSelect = resumeFilter.spv.by == "spvType" ? "Jenis spv" : "Profesi" 
    document.querySelector("#res-spv-title-1 p:nth-child(1)").innerHTML = "Kepatuhan spv Berdasarkan " + perSelect
    document.querySelector("#res-spv-title-1 p:nth-child(2)").innerHTML = groupText + unitText + " | Bulan " + monthText[resumeFilter.spv.month * 1] + " " + (resumeFilter.spv.year * 1) 
    document.querySelector("#res-spv-title-2 p:nth-child(2)").innerHTML = unitText + " | Bulan " + monthText[resumeFilter.spv.month * 1] + " " + (resumeFilter.spv.year * 1)
    document.querySelector("#res-spv-title-3 p:nth-child(2)").innerHTML = groupText + unitText
    document.querySelector("#res-spv-title-4 p:nth-child(1)").innerHTML = "Kepatuhan spv per 3 Bulan Berdasarkan " + perSelect
    document.querySelector("#res-spv-title-4 p:nth-child(2)").innerHTML = groupText + unitText + " | Bulan " + monthText[resumeFilter.spv.month * 1] + " " + (resumeFilter.spv.year * 1)
    document.querySelector("#res-spv-title-5 p:nth-child(1)").innerHTML = "TOP 10 " + (resumeFilter.spv.top == "1-0" ? "Tertinggi" : "Terendah") + " Kepatuhan spv Pada Unit";
    document.querySelector("#res-spv-title-5 p:nth-child(2)").innerHTML = "Bulan " + monthText[resumeFilter.spv.month * 1] + " " + (resumeFilter.spv.year * 1)
}
function updateResume_spv_onChange_Chart(){  
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
            labels: resumespvData.chart["chart1"].label,
            datasets: [{
                data: resumespvData.chart["chart1"].dataset,
                borderWidth: 1,
                backgroundColor: resumespvData.chart["chart1"].barColor
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {
                tooltip:{enabled:true,callbacks: {label: function(context) {let label = "";if(context.parsed.y !== null) {label += (context.parsed.y*100) + "%";}return label;}}},title: {display: true,padding: {top: 10},text:""},legend: {display: false},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
        Elem("res-spv-canvas-1").innerHTML = ""
        Elem("res-spv-canvas-1").appendChild(canva1) 
    
    new Chart(canva2, {
        type: 'bar',
        data: {
            labels: resumespvData.chart.chart2.label,
            datasets: resumespvData.chart.chart2.dataset
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {tooltip:{enabled:true,callbacks: {label: function(context) {let label = "";if(context.parsed.y !== null) {label += (context.parsed.y*100) + "%";}return label;}}},title: {display: true,padding: {top: 10}, text:""},legend: {display: true, position: "bottom"},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    Elem("res-spv-canvas-2").innerHTML = ""
    Elem("res-spv-canvas-2").appendChild(canva2)   
    
    new Chart(canva3, {
        type: 'line',
        data: {
            labels: resumespvData.chart.chart3.label,
            datasets: [{
                data: resumespvData.chart.chart3.data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return Math.floor(value*100) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 10}}}},
            plugins: {tooltip:{enabled:true,callbacks: {label: function(context) {let label = "";if(context.parsed.y !== null) {label += (context.parsed.y*100) + "%";}return label;}}},title: {display: true,padding: {top: 10}, text:""},legend: {display: false},datalabels: {formatter: function(value) {return (Math.floor(value.y*1000) / 10) + '%';},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    Elem("res-spv-canvas-3").innerHTML = ""
    Elem("res-spv-canvas-3").appendChild(canva3)
    var maxLongMonth = 13
    if(resumespvData.chart.chart3.label.length > maxLongMonth){
        Elem("res-spv-canvas-3").style.width = (resumespvData.chart.chart3.label.length/maxLongMonth*900)  +"px"
    }
    var scrollMonthIndex =  resumespvData.chart.chart3.label.indexOf(
        shortMonthText[resumeFilter.spv.month] + " " + resumeFilter.spv.year   
    )
    var x = scrollMonthIndex
    if(scrollMonthIndex < 0){
        var scrollMonth = Elem("res-spv-canvas-3").offsetWidth  
    } else {
        scrollMonth = ((x * 1) - 3 )  / resumespvData.chart.chart3.label.length * (Elem("res-spv-canvas-3").offsetWidth * 1) 
    }
    Elem("res-spv-canvas-3-parent").scrollTo(scrollMonth,0)

    new Chart(canva4, {
        type: 'bar',
        data: {
            labels: resumespvData.chart.chart4.label,
            datasets: resumespvData.chart.chart4.dataset
        },
        options: {
            maintainAspectRatio: false,
            scales: {y: {beginAtZero: true, min: 0,max: 1,ticks: {stepSize: 0.25 ,callback: function(value) {return (Math.floor(value*1000)/10) + '%'} , font:{size: 8}, format: {style: 'percent'}}},x : {ticks: {font:{size: 11}}}},
            plugins: {tooltip:{enabled:true,callbacks: {label: function(context) {let label = "";if(context.parsed.y !== null) {label += (context.parsed.y*100) + "%";}return label;}}},title: {display: true,padding: {top: 10}, text:""},legend: {display: true, position: "bottom"},datalabels: {formatter: function(value, context) {return (Math.floor(value*1000) / 10);},color: 'black',anchor: 'end',align: 'end',offset: 1,font:{size: 9}}}
        }
    })
    Elem("res-spv-canvas-4").innerHTML = ""
    Elem("res-spv-canvas-4").appendChild(canva4)
        
}
function updateResume_spv_onChange_Table(){
    var table1 = Elem("tab-res-spv-1")    
        var tab1Head = table1.querySelector("thead tr");tab1Head.innerHTML = ""
        var tab1Body = table1.querySelector("tbody");tab1Body.innerHTML = ""
        var tab1Foot = table1.querySelector("tfoot tr");tab1Foot.innerHTML = ""
        var nTab1Row = 0; var nTab1Col = 0; var nTab1ColMax = resumespvData.table["table1"][0].length
        while(nTab1Row < 5){
            if(nTab1Row > 0 && nTab1Row < 4){
                var trBody = document.createElement("tr")
            }
            while(nTab1Col < nTab1ColMax){
                if(nTab1Row === 0){
                    var thNew_head = document.createElement("th")
                    thNew_head.setAttribute("scope", "col")
                    thNew_head.innerHTML = resumespvData.table["table1"][0][nTab1Col]
                    tab1Head.appendChild(thNew_head)
                    // console.log(tab1Head)
                }
                else if(nTab1Row > 0 && nTab1Row < 4){
                    if(nTab1Col === 0){
                        var td = document.createElement("th")
                        td.setAttribute("scope", "row")
                    } else {var td = document.createElement("td")}
                    td.innerHTML = resumespvData.table["table1"][nTab1Row][nTab1Col]
                    // console.log(td)
                    trBody.appendChild(td)
                }
                else {
                    var thFoot = document.createElement("th")
                    thFoot.setAttribute("scope", "col")
                    thFoot.innerHTML = resumespvData.table["table1"][4][nTab1Col]
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
    var table2 = Elem("tab-res-spv-2")
        var tab2Head = table2.querySelector("thead tr");tab2Head.innerHTML = ""
        var tab2Body = table2.querySelector("tbody"); tab2Body.innerHTML = ""
        var tab2Foot = table2.querySelector("tfoot tr"); tab2Foot.innerHTML = ""
        var nTab2Row = 0; var nTab2Col = 0; var nTab2RowMax = resumespvData.table["table2"].length;var nTab2ColMax = resumespvData.table["table2"][0].length
        while(nTab2Row < nTab2RowMax){
            if(nTab2Row === 0){
                var nHeadCol = 0;
                while(nHeadCol < nTab2ColMax){
                    var thNew_head = document.createElement("th")
                    thNew_head.setAttribute("scope", "col")
                    thNew_head.innerHTML = resumespvData.table["table2"][0][nHeadCol]
                    tab2Head.appendChild(thNew_head)
                nHeadCol++
                }
            } else {
                if(nTab2RowMax === 9 && nTab2Row == 8){
                    var nFootCol = 0
                    while(nFootCol < nTab2ColMax){
                        var thNew_foot = document.createElement("th")
                            thNew_foot.setAttribute("scope", "col")
                            thNew_foot.innerHTML = resumespvData.table["table2"][8][nFootCol]
                            tab2Foot.appendChild(thNew_foot)
                    nFootCol++
                    }
                }
                else {
                    var trNew = document.createElement("tr")
                    var thBody = document.createElement("th")
                        thBody.setAttribute("score", "row")
                        thBody.innerHTML =  resumespvData.table["table2"][nTab2Row][0]
                        trNew.appendChild(thBody)
                    var nBodyCol = 1
                    while (nBodyCol<nTab2ColMax){
                        var tdBody = document.createElement("td")
                            tdBody.innerHTML = resumespvData.table["table2"][nTab2Row][nBodyCol]
                        trNew.appendChild(tdBody)
                    nBodyCol++
                    }
                    tab2Body.appendChild(trNew)
                }
            }
        nTab2Row++
        }
        
    var table4 = Elem("tab-res-spv-4")
        var tab4Head = table4.querySelector("thead tr");tab4Head.innerHTML = ""
        var tab4Body = table4.querySelector("tbody"); tab4Body.innerHTML = ""
        var tab4Foot = table4.querySelector("tfoot tr"); tab4Foot.innerHTML = ""
        var nTab4Row = 0; var nTab4RowMax = resumespvData.table.table4.length 
        while(nTab4Row < nTab4RowMax){
            var nTab4Col = 0;
            if (nTab4Row > 0 && nTab4Row !== (nTab4RowMax-1)){var trNew_Body = document.createElement("tr")}
            while(nTab4Col < 4){
                if(nTab4Row === 0){
                    var thNew_head = document.createElement("th"); thNew_head.setAttribute("scope", "col")
                    thNew_head.innerHTML = resumespvData.table.table4[0][nTab4Col]
                    tab4Head.appendChild(thNew_head)
                }
                else if (nTab4Row > 0 && nTab4Row !== (nTab4RowMax-1)){
                    if(nTab4Col === 0){var td = document.createElement("th"); td.setAttribute("scope","row")}
                    else {var td = document.createElement("td")}
                    td.innerHTML = resumespvData.table.table4[nTab4Row][nTab4Col]
                    trNew_Body.appendChild(td)
                } else {
                    var thNew_foot = document.createElement("th"); 
                    thNew_foot.setAttribute("scope", "col")
                    thNew_foot.innerHTML = resumespvData.table.table4[nTab4Row][nTab4Col]
                    tab4Foot.appendChild(thNew_foot)
                }
            nTab4Col++
            }    
            // console.log(trNew_Body)
            if (nTab4Row > 0 && nTab4Row !== (nTab4RowMax-1)){tab4Body.appendChild(trNew_Body)}
        nTab4Row++
        }
        
    var table5 = Elem("tab-res-spv-5")
    var table5Body = table5.querySelector("tbody")
        table5Body.innerHTML = ""
        if(resumespvData.table["table5"].length > 0){  
            for(var i = 0; i<10;i++){
                var tr = document.createElement("tr")
                var td1 = document.createElement("td")
                    td1.innerHTML = i+1;
                    td1.classList.add("border-end") 
                    tr.appendChild(td1)
                var j = 1
                while(j < 13){
                    var td = document.createElement("td")
                    td.innerHTML =  resumespvData.table.table5[i][j]
                    if(j > 3 && j < 8){
                        td.classList.add("d-none"); 
                        td.classList.add("res-spv-tab-group");
                        if(j === 4){td.classList.add("border-start")}
                    }
                    if(j > 7){
                        td.classList.add("d-none"); 
                        td.classList.add("res-spv-tab-type");
                        if(j === 8){td.classList.add("border-start")}
                    }
                    tr.appendChild(td)
                j++    
                }
                
                // return
                // var td2 = document.createElement("td")
                //     td2.innerHTML =  resumespvData.table["table5"][i][1];
                //     tr.appendChild(td2)
                // var td3 = document.createElement("td")
                //     td3.innerHTML = resumespvData.table["table5"][i].unitName; tr.appendChild(td3)
                // var td4 = document.createElement("td")
                //     td4.innerHTML = resumespvData.table["table5"][i].n; tr.appendChild(td4)
                // var tdDok = document.createElement("td"); tdDok.innerHTML = resumespvData.table["table5"][i]["Dokter"]; tdDok.classList.add("d-none"); tdDok.classList.add("res-spv-tab-group"); tr.appendChild(tdDok)    
                // var tdPer = document.createElement("td"); tdPer.innerHTML = resumespvData.table["table5"][i]["Perawat Bidan"]; tdPer.classList.add("d-none"); tdPer.classList.add("res-spv-tab-group"); tr.appendChild(tdPer)
                // var tdMag = document.createElement("td"); tdMag.innerHTML = resumespvData.table["table5"][i]["Magang Siswa"]; tdMag.classList.add("d-none"); tdMag.classList.add("res-spv-tab-group"); tr.appendChild(tdMag)
                // var tdLai = document.createElement("td"); tdLai.innerHTML = resumespvData.table["table5"][i]["Lain-lain"]; tdLai.classList.add("d-none"); tdLai.classList.add("res-spv-tab-group"); tr.appendChild(tdLai)
                // for(var j = 1; j<6; j++){var td = document.createElement("td"); td.innerHTML = resumespvData.table["table5"][i]["mo"+j]; ; td.classList.add("d-none"); td.classList.add("res-spv-tab-moment"); tr.appendChild(td) }
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