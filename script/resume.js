var momentAxes = ['M1', 'M2', 'M3', 'M4', 'M5', 'Total']
var profesiAxes = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain", "Total"]
var color = {serial:["#a62b2b", "#0d7d4b", "#ae7828", "#6a1c96", "#6b7914", "#210cdd"], total:"#210cdd",increase:["#f49191","#d45858","#a62b2b"]}

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
    spinner(true)
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
    // console.log("end schResFilter:" + + Date.now())
    spinner(false)
}
