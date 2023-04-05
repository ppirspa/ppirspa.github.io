var momentAxes = ['M1', 'M2', 'M3', 'M4', 'M5', 'Total']
var profesiAxes = ["Dokter", "Perawat Bidan", "Magang Siswa", "Lain-lain", "Total"]
var color = {serial:["#a62b2b", "#0d7d4b", "#ae7828", "#6a1c96", "#6b7914", "#210cdd"], total:"#210cdd",increase:["#f49191","#d45858","#a62b2b"]}
var resumeFilter = {
    hh:{}, apd: {}, spv:{}
}

function ResetResume(){
    console.log("ResetResume")
    resumeNav(1)
    InputWithList()
}
function resumeNav(val){    
    if(val === 1){
        ResetResume_HH()
    }
    if(val === 2){
        ResetResume_APD()
    }
    if(val === 3){
        ResetResume_SPV()
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
    if(type == "apd"){
        var y = t.substring(t.indexOf("-")+1)
        resumeFilter.apd[y] = elem.value
        if(y == "month" || y == "year"){resumeFilter.apd[y] = elem.value * 1}
        if(y == "by"){
            if(elem.value == "Profesi"){
                Elem("resume-filter-apd-kelompok").value = "All"  
                resumeFilter.apd.group = "All"
                for(var i = 2; i < 6; i++){
                    document.querySelector("#resume-filter-apd-kelompok option:nth-child(" + i + ")").setAttribute("disabled","")
                }
            }
            else {
                for(var i = 2; i < 6; i++){
                    document.querySelector("#resume-filter-apd-kelompok option:nth-child(" + i + ")").removeAttribute("disabled")
                }
            }
        }
        console.log(resumeFilter.apd)
        updateResume_APD_OnChange()
    }
    if(type == "spv"){
        var y = t.substring(t.indexOf("-")+1)
        resumeFilter.spv[y] = elem.value
        if(y == "month" || y == "year"){resumeFilter.spv[y] = elem.value * 1}
        updateResume_spv_byFilter()
        console.log(resumeFilter.spv)
    }
    
    // console.log("end schResFilter:" + + Date.now())
    spinner(false)
}
