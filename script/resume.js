

function ResetResume(){
    console.log("ResetResume")
    resumeNav(1)
    InputWithList()
}
function resumeNav(val){    
    if(val === 1){
        ResetResume_HH()
        // resumeHHUpdateChart()
    }
}
function chResFilter(elem){
    var t = elem.getAttribute("resume-filter-type")
    var type = t.substring(0, t.indexOf("-"))
    if(type == "hh"){
        var y = t.substring(t.indexOf("-")+1)
        resumeFilter.hh[y] = elem.value
        if(y == "month" || y == "year"){resumeFilter.hh[y] = elem.value * 1}
        if(y == "by"){
            if(elem.value == "Profesi"){
                Elem("resume-filter-hh-kelompok").value = "All"  
                resumeFilter.hh.group = "All"
                for(var i = 2; i < 6; i++){
                    document.querySelector("#resume-filter-hh-kelompok option:nth-child(" + i + ")").setAttribute("disabled","")
                }
            }
            else {
                for(var i = 2; i < 6; i++){
                    document.querySelector("#resume-filter-hh-kelompok option:nth-child(" + i + ")").removeAttribute("disabled")
                }
            }
        } 

        updateResume_HH()
    }
    
}
// function ResetResume_HH(){
//     console.log("ResetResume_HH")
//     var today = new Date()
//     Elem("resume-filter-hh-bulan").value = today.getMonth() 
//     Elem("resume-filter-hh-tahun").value = today.getFullYear()
//     var filterHHUnit = Elem("resume-filter-hh-unit")
//         filterHHUnit.innerHTML = ""
//         var firstOpt = Elem("resume-filter-hh-unit-first").cloneNode(true)
//         filterHHUnit.appendChild(firstOpt)
//         for(var i = 0; i < database.unitData.length; i++){
//             var opt = document.createElement("option")
//             opt.value = database.unitData[i].name
//             opt.innerHTML = database.unitData[i].name
//             filterHHUnit.appendChild(opt)
//         }
// }
// function resumeFilter(elem){
//     var typeText = elem.getAttribute("resume-filter-type")
//     switch (typeText.substring(0, typeText.indexOf("-"))){
//         case "hh":
//             resumeHHUpdateChart()   
//             break;
//         default :
//             return
//     }
// }
// function resumeHHUpdateChart(){
//     var monthText = {
//         1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"Mei", 6:"Jun", 
//         7:"Jul", 8:"Agu", 9:"Sep", 10:"Okt", 11:"Nov", 12:"Des"
//     }
//     var filterVal = {}
//     var filtNode = document.querySelectorAll("[resume-filter-type]")
//     var filt = Array.from(filtNode).filter((p)=>{
//         var t = p.getAttribute("resume-filter-type")
//         return t.substring(0, t.indexOf("-")) == "hh"
//     })
//     filt.forEach((p)=>{
//         var t = p.getAttribute("resume-filter-type")
//         var key = t.substring(t.indexOf("-")+1)
//         filterVal[key] = p.value
//     })

//     // console.log(filterVal)
//     var unitText = ""
//     var groupText = ""
//     if(filterVal.unit !== "All"){
//         unitText = "di Unit " + filterVal.unit + " "
//     }
//     if(filterVal.group !== "All"){
//         groupText = "Kelompok " + filterVal.group + " "
//     }
//     var bulanText = monthText[filterVal.month * 1] + " " + filterVal.year

//     var moData = {
//         min0 : {},
//         min1 : {},
//         min2 : {}
//     }

//     for(var j = 0; j < 3; j++){
//         var temp = {}
//         var m = (filterVal.month * 1) - j
//         var totOpp = 0
//         var totAct = 0
//         var totScore = ""
//         for(var i = 1; i < 6; i++){
//             var opp = database.hhData.filter((p)=>{
//                 return ((p["mo"+i] !== "") && (filterData(p, m)))
//             }).length
//             var act = database.hhData.filter((p)=>{
//                 return ((p["mo"+i]) && (filterData(p, m)))
//             }).length
//             var score = ""
//             if(opp > 0){var score = toDec(act/opp, 3)}  
//             temp["mo" + i] = {
//                 opp : opp,
//                 act : act,
//                 score : score
//             }
//             totOpp += opp
//             totAct += act
//             if(m === 0){
//                 document.querySelector("#table-resume-hh-1mo tbody tr:nth-child(1) td:nth-child("+(i+1)+")").innerHTML = act
//                 document.querySelector("#table-resume-hh-1mo tbody tr:nth-child(2) td:nth-child("+(i+1)+")").innerHTML = opp
//                 document.querySelector("#table-resume-hh-1mo tbody tr:nth-child(3) td:nth-child("+(i+1)+")").innerHTML = (Math.floor(score*1000) / 10) + '%'
//             }
//         }
//         if(totOpp > 0){totScore = totAct/totOpp}
//         temp["tot"] = {
//             opp : totOpp,
//             act : totAct,
//             score : toDec(totScore,3)
//         }
//         document.querySelector("#table-resume-hh-1mo tbody tr:nth-child(1) td:nth-child("+(7)+")").innerHTML = totAct
//         document.querySelector("#table-resume-hh-1mo tbody tr:nth-child(2) td:nth-child("+(7)+")").innerHTML = totOpp
//         document.querySelector("#table-resume-hh-1mo tbody tr:nth-child(3) td:nth-child("+(7)+")").innerHTML = (Math.floor(temp.tot.score*1000) / 10) + '%'

//         if(m<1){temp["month"] = monthText[m+12] + " " + (filterVal.year-1).toString().substring(2)}
//         else{temp["month"] = monthText[m] + " " + (filterVal.year).toString().substring(2)} 
//         moData["min"+j] = temp
//     }

//     function filterData(item, m){
//         if(filterVal.group !== "All" && (filterVal.group !== item.group)){return false}
//         if(filterVal.unit !== "All" && filterVal.unit !== item.unit){return false}
//         if(m * 1 < 1){
//             if(item.month * 1 !== (m * 1) + 12){return false}
//             if(item.year * 1 !== (filterVal.year * 1) - 1){return false}
//         }
//         else {
//             if(item.month * 1 !== m * 1){return false}
//             if(item.year * 1 !== filterVal.year * 1){return false}
//         }
//         return true
//     }

//     console.log(moData)
//     var div1 = Elem("chart-resume-hh-1mo"); 
//     var div2 = Elem("chart-resume-hh-3mo")
//     div1.innerHTML = ""; 
//     div2.innerHTML = "";
//     var canva1 = document.createElement("canvas"); 
//     var canva2 = document.createElement("canvas")

//     Chart.register(ChartDataLabels)
//     var char1 = new Chart(canva1, {
//         type: 'bar',
//         data: {
//             labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'Total'],
//             datasets: [{
//                 data: [ 
//                     // 0.8, 0.86, 0.99, 0.78, 0.8, 0.952],
//                     moData.min0.mo2.score,
//                     moData.min0.mo1.score, 
//                     moData.min0.mo3.score,
//                     moData.min0.mo4.score,
//                     moData.min0.mo5.score,
//                     moData.min0.tot.score
//                 ],
//                 borderWidth: 1,
//                 backgroundColor: ['rgba(166, 43, 43, 1)', 'rgba(166, 43, 43, 1)', 'rgba(166, 43, 43, 1)', 'rgba(166, 43, 43, 1)', 'rgba(166, 43, 43, 1)', 'rgba(33, 12, 221, 1)']
//             }]
//         },
//         options: {
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     min: 0,
//                     max: 1,
//                     ticks: {
//                         format: {
//                             style: 'percent'
//                         }
//                     }
//                 }
//             },
//             plugins: {
//                 title: {
//                     display: true,
//                     text: "Kepatuhan Handhygiene Per Moment",
//                     padding: {
//                         top: 10,
//                         bottom: 5
//                     }
//                 },
//                 legend: {
//                     display: false
//                 },
//                 subtitle: {
//                     display: true,
//                     padding: {
//                         top: 0,
//                         bottom: 20
//                     },
//                     text: groupText + unitText + "Pada Bulan " + bulanText
//                 },
//                 datalabels: {
//                     formatter: function(value, context) {
//                         return (Math.floor(value*1000) / 10) + '%';
//                       },
//                     color: 'black',
//                     anchor: 'end',
//                     align: 'end',
//                     offset: 1,
//                     font:{
//                         size: 10
//                     }
//                 }
//             }
//         }
//     }) 
//     div1.appendChild(canva1)

//     var twMoData = {
//         M1: [], M2: [], M3: [], M4: [], M5: [], Tot: [] 
//     }
//     for(var i = 2; i >= 0; i--){
//         for(var j = 1; j < 6; j++){
//             var score = moData["min"+i]["mo"+j]["score"]
//             twMoData["M"+j].push(moData["min"+i]["mo"+j]["score"])
//         }
//         twMoData["Tot"].push(moData["min"+i]["tot"]["score"])
//     }
//     var bulanText2 = moData.min2.month + " - " + moData.min0.month
//     // console.log(twMoData)
//     var char2 = new Chart(canva2, {
//         type: 'bar',
//         data: {
//             labels: [moData.min2.month, moData.min1.month, moData.min0.month],
//             datasets: [
//                 {
//                     label: 'M1',
//                     data: twMoData["M1"],
//                     backgroundColor: 'rgba(166, 43, 43, 1)'
//                 },
//                 {
//                     label: 'M2',
//                     data: twMoData["M2"],
//                     backgroundColor: '#40e0d0'
//                 },
//                 {
//                     label: 'M3',
//                     data: twMoData["M3"],
//                     backgroundColor: '#6495ed'
//                 },
//                 {
//                     label: 'M4',
//                     data: twMoData["M4"],
//                     backgroundColor: '#f5deb3'
//                 },
//                 {
//                     label: 'M5',
//                     data: twMoData["M5"],
//                     backgroundColor: '#8b008b'
//                 },
//                 {
//                     label: 'Total',
//                     data: twMoData["Tot"],
//                     backgroundColor: 'rgba(33, 12, 221, 1)',
//                     borderWidth: 2,
//                     borderColor: '#ff0000'
//                 },
//             ]
//         },
//         options: {
//             maintainAspectRatio: false,
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     min: 0,
//                     max: 1,
//                     ticks: {
//                         format: {
//                             style: 'percent'
//                         }
//                     }
//                 }
//             },
//             plugins: {
//                 title: {
//                     display: true,
//                     text: "Kepatuhan Handhygiene Per Moment 3 Bulanan",
//                     padding: {
//                         top: 10,
//                         bottom: 5
//                     }
//                 },
//                 legend: {
//                     display: true,
//                     position: 'bottom',
//                     font:{
//                         size: 10
//                     }
//                 },
//                 subtitle: {
//                     display: true,
//                     padding: {
//                         top: 0,
//                         bottom: 20
//                     },
//                     text: groupText + unitText + "Pada Bulan " + bulanText2
//                 },
//                 datalabels: {
//                     formatter: function(value, context) {
//                         return (Math.floor(value*1000) / 10) + '%';
//                       },
//                     color: 'black',
//                     anchor: 'end',
//                     align: 'end',
//                     offset: 1,
//                     font:{
//                         size: 8
//                     }
//                 }
//             }
//         }
//     })
//     div2.appendChild(canva2)

// }
