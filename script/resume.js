function resumeNav(val){    
    document.querySelectorAll(".resume-page").forEach((p)=>{
        p.classList.add("d-none")
        Elem("resume-page-"+val).classList.remove("d-none")
    })
    Elem("resume-nav-container-1").value = val
}
function ResetResume(){
    console.log("ResetResume")
    var today = new Date()
    Elem("resume-filter-hh-bulan").value = today.getMonth() + 1
    Elem("resume-filter-hh-tahun").value = today.getFullYear()
    // hhFilterPreset()
    // hhTableFilterShort = hhTableFilterShortDefault
    // UpdateHHTable()
    InputWithList()
    // Elem("moment-clear-button").click()
}


// function chartTest(){   
//     const ctx = document.getElementById('myChart');
//      var j = new Chart(ctx, {
//         type: 'bar',
//         data: {
//             labels: ['Moment 1', 'Moment 2', 'Moment 3', 'Moment 4', 'Moment 5'],
//             datasets: [{
//                 label: '# of Votes',
//                 data: [12, 19, 30, 50, 24],
//                 borderWidth: 5,
//                 borderColor: '#FF6384',
//                 backgroundColor: 'rgb(54, 162, 235)'
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     max: 100,
//                     min: 0,
//                     display: false
//                 }
//             }
//         }
//     })
// }
