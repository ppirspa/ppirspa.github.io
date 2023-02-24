var rsAPI = "https://script.google.com/macros/s/AKfycbxqaLuBn2hKTGXQ-SSBbF-QXKCxohWXZSrvdCbTTgyQsstseStiMS79KuEGHOzn0tzt/exec";
var dbAPI = "https://script.google.com/macros/s/AKfycbzlrn6pg7AL6osPX3RDmojKK9TSoVE_9mlO11NhHJnAfu1FgKME3K_vyC-baowTFDSq/exec"
var sendform = {
    userName : "",
    userAgent: ""
};
var globalVar = {};
    globalVar["staffData"] = []
    globalVar["unitData"] = []
    globalVar["hhData"] = []
    globalVar["uniqueObserver"] = []
var inputListCurrentFocus
var TableDivider = {
    "hh":10
} 
var TableMinimal = {
    "hh": 0
}
var loginPass = true
// ============================================================================
function spinner(bo) {
  if (bo){
      Elem("loader").style.display = "flex";
  } else if (!(bo)) { Elem("loader").style.display = "none" }
}

function Elem(id) {
  return document.getElementById(id)
}

function Toast(text){
  var toastDiv = Elem('liveToast')
  toastDiv.querySelector(".toast-body").innerHTML = text
  const toast = new bootstrap.Toast(toastDiv)
  toast.show()
}

function onload(){
  includeHTML()
  // login("arga", "ppirspa")
  // spinner(false)
}

function NavbarTo(elem){
  var target = elem.querySelector("a").innerText.substring(1)
  var navLink = document.querySelectorAll(".menu-nav .nav-link")
  navLink.forEach((p)=>{
    p.classList.remove("active");
    if(p.innerText.substring(1) === target){p.classList.add("active")}
  })
  if(target === "Hand Hygiene"){
    Elem("bodyContent").setAttribute("w3-include-html", "/html/C1-hh.html");
    Elem("navbarTitle").innerHTML = "Form " + target
  }
  if(target === "Kepatuhan APD"){
    Elem("bodyContent").setAttribute("w3-include-html", "/html/C2-apd.html")
    Elem("navbarTitle").innerHTML = "Form " + target
  }
  if(target === "Supervisi Ruangan"){
    Elem("bodyContent").setAttribute("w3-include-html", "/html/C3-supervisi.html")
    Elem("navbarTitle").innerHTML = target
  }
  if(target === "Resume"){
    Elem("bodyContent").setAttribute("w3-include-html", "/html/C4-resume.html")
    Elem("navbarTitle").innerHTML = target
  }
  if(target === "Setting"){
    Elem("bodyContent").setAttribute("w3-include-html", "/html/C5-setting.html")
    Elem("navbarTitle").innerHTML = target
  }
  
  includeHTML();
  Elem("sideNavCanvasBody").click()
  let timeout = setTimeout(ResetInput(target), 1000);
}

function ResetInput(target) {
  if(target === "Hand Hygiene"){ResetHHInput()}
  if(target === "Kepatuhan APD"){}
  if(target === "Supervisi Ruangan"){}
  if(target === "Resume"){}
  if(target === "Setting"){}
}