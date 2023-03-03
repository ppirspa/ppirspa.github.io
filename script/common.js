var rsAPI = "https://script.google.com/macros/s/AKfycbxqaLuBn2hKTGXQ-SSBbF-QXKCxohWXZSrvdCbTTgyQsstseStiMS79KuEGHOzn0tzt/exec";
var dbAPI = "https://script.google.com/macros/s/AKfycbw5mmypfqM-9vplv606gw0fRUM-NHt9DN5-siJu7-IXSiWEuq2AF7Pq_UuoGXHrqPZF/exec"
var sendform = {
    userName : "",
    userAgent: ""
};
var database = {};
    database["staffData"] = []
    database["unitData"] = []
    database["hhData"] = []
    database["uniqueObserver"] = []
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
async function onload(){
  await includeHTML()
  login("argo", "ppirspa")
  // console.log(Elem("ini-test-class"))
}
let timeout;

async function NavbarTo(target){  
  console.log("Nav to : "+target)
  var navLinkNodes = document.querySelectorAll(".nav-item .nav-link span")
  navLinkNodes.forEach((p)=>{
    p.parentElement.classList.remove("active");
    if(p.innerHTML == target){
      p.parentElement.classList.add("active");
    }
  })
  // return
  if(target === "Hand Hygiene"){
    Elem("bodyContent").setAttribute("w3-include-html", "/html/C1-hh.html");
    Elem("navbarTitle").innerHTML = "Form " + target
  }
  if(target === "Kepatuhan APD"){
    Elem("bodyContent").setAttribute("w3-include-html", "/html/C2-apd.html")
    Elem("navbarTitle").innerHTML = "Form " + target
  }
  if(target === "Supervisi"){
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
  Elem("bodyContent").innerHTML = ""
  let response = await fetch(Elem("bodyContent").getAttribute("w3-include-html"))
  Elem("bodyContent").innerHTML = await response.text()
  ResetInput(target)
  Elem("sideNavCanvasBodyBtn").click()
}
function MenuNavTo(elem){
  NavbarTo(elem.innerText)
}
function ResetInput(target) {
  if(target === "Hand Hygiene"){ResetHHInput()}
  if(target === "Kepatuhan APD"){}
  if(target === "Supervisi"){}
  if(target === "Resume"){}
  if(target === "Setting"){}
  InputWithList()
  onChangeAddEvent()
}
function InputWithList(){
  document.querySelectorAll(".input-with-list").forEach((elem) => {
    elem.addEventListener('input', function(){
          filterInputList(elem.id, elem.value, elem.getAttribute("list-name"))
      })
      function filterInputList(inputID, text, listTargetID){
          var listElem = Elem(listTargetID)
          listElem.innerHTML = ""
          
          if(!(Elem(inputID).classList.contains("no-list-add"))){var listTambah =  document.querySelector("#tambah-list-template > ul").cloneNode(true)}

          var filteredData = database[listElem.getAttribute("list-data-to-filter")].filter((x) => x["name"].toString().toLowerCase().includes(text.toLowerCase()))
          
          if(text.length < 1){return false;}

          inputListCurrentFocus = -1
          if(text.length > 0){
              if(!(Elem(inputID).classList.contains("no-list-add"))){
                  listElem.appendChild(listTambah)
                  
                  document.querySelector("#" + listTargetID + " > ul > .tambah-list > div > span").innerHTML = text;
                  document.querySelector("#" + listTargetID + " > ul > .tambah-list > div").setAttribute("onclick", listElem.getAttribute("tambah-list-function").replace("()","('"+text+"')"+"; document.getElementById('"+listElem.getAttribute("input-to-paste-id")+"').value = ''"))
              }
              else{var ulNew = document.createElement("ul");
                  listElem.appendChild(ulNew);
              } 

              if(filteredData.length > 0){
                  var ulNew = document.createElement("ul")
                  listElem.appendChild(ulNew)
                  for(var i = 0; i < filteredData.length; i++){
                      var liNew = Elem("list-li").cloneNode(true)
                      var liName = liNew.querySelector("div:nth-child(1)")
                      liName.innerHTML = filteredData[i].name
                      
                      var addFunc1 = ""
                      if(Elem(listTargetID).getAttribute("list-data-to-filter") == "staffData"){
                        addFunc1 = "SelectStaffBase('"+ filteredData[i].baseGroup + "', '" + filteredData[i].baseUnit+"'); "; 
                      }

                      liName.setAttribute("onclick",
                          "Elem('"+inputID+"').value = '"+filteredData[i].name+"';" 
                          + "Elem('"+ listTargetID +"').innerHTML = ''; "
                          + "inputChange(Elem('"+ inputID + "')); "
                          + addFunc1
                      )

                      ulNew.appendChild(liNew)
                  }   
              }
          }
      }
    elem.addEventListener("keydown", function(e) {
        var list = document.getElementById(elem.getAttribute("list-name"));
        var x = []
        if (list) {
            x = list.querySelectorAll("li");
            x.forEach((p)=> p.classList.remove("listCurrActive"))
        }

        if((e.keyCode === 40 || e.keyCode === 38) && x.length > 0){
          if (e.keyCode === 40 && inputListCurrentFocus < x.length-1) {
            inputListCurrentFocus ++
            
          }
          else if (e.keyCode === 38 && inputListCurrentFocus > 0 ){
            inputListCurrentFocus --
          }
        }
        else {
          if (e.keyCode === 13) {
            e.preventDefault();
            if(inputListCurrentFocus > -1 && x.length > 0){
              x[inputListCurrentFocus].querySelector("div:nth-child(1)").click();
            }
          } else if (e.keyCode === 9) {
            Elem(elem.getAttribute('list-name')).innerHTML = ""
          }
          inputListCurrentFocus = -1
        }
        if(inputListCurrentFocus >= 0){
          addActive(x[inputListCurrentFocus])
          SlideTo(x[inputListCurrentFocus], x[inputListCurrentFocus].parentNode)
        }
        console.log(inputListCurrentFocus)

        return
        if (e.keyCode == 40 && x.length > 0 && inputListCurrentFocus < x.length-1) {
          e.preventDefault()
          inputListCurrentFocus++;
          addActive(x[inputListCurrentFocus]);
          if(inputListCurrentFocus > 0){
            SlideTo(x[inputListCurrentFocus], x[inputListCurrentFocus].parentNode);
            }
        } else if (e.keyCode == 38 && x.length > 0 && inputListCurrentFocus > 0) { //up
          e.preventDefault()
          inputListCurrentFocus--;
          addActive(x[inputListCurrentFocus]);
          if(inputListCurrentFocus>0){
            SlideTo(x[inputListCurrentFocus], x[inputListCurrentFocus].parentNode);
            }
        } else if (e.keyCode == 13) {
          e.preventDefault();
          if(inputListCurrentFocus > -1 && x.length > 0){
            x[inputListCurrentFocus].querySelector("div:nth-child(1)").click();
          }
        } else if (e.keyCode == 9) {
          Elem(elem.getAttribute('list-name')).innerHTML = ""
        }
        console.log(inputListCurrentFocus)
    });
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
      function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("input-list");
          for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != elem) {
              x[i].innerHTML=""
            }
          }
      }
      function addActive(elem){
        elem.classList.add("listCurrActive")
    }
    
  })
}
function SelectStaffBase(group, unit){
  if(!(group === "")){document.querySelectorAll(".input-kelompok").forEach((p)=>{p.value = group})}
  else{document.querySelectorAll(".input-kelompok").forEach((p)=>{p.selectedIndex=0})}
  document.querySelectorAll(".input-unit").forEach((p)=>{p.value = unit})
}
function SlideTo(elm, container){
  var pPos = elm.parentNode.getBoundingClientRect(), // parent pos
  cPos = elm.getBoundingClientRect(), // target pos
  pos = {
      top: "",
      right: "",
      bottom: "",
      left: ""    
  }   
  pos.top = cPos.top - pPos.top;
  pos.right = cPos.right - pPos.right;
  pos.bottom = cPos.bottom - pPos.bottom;
  pos.left = cPos.left - pPos.left;
  container.scrollTop += pos.top
  // console.log(pos.top)
}
function onChangeAddEvent(){
  var obyekDataField = document.querySelectorAll("[input-value-group='hh']")
  obyekDataField.forEach((p)=>{
    p.addEventListener("change", function(){
      inputChange(p)
    })
  })
  // console.log(obyekDataField)
}
function inputChange(elem){
  var inputGroup = elem.getAttribute("input-value-group")
  // var inputType = elem.getAttribute("input-value-type")
  if(inputGroup === "hh"){hhInputChange(elem)}
  // console.log(inputGroup)
}
function EditStaff(id){
  alert("EditStaff-"+id)
}
function EditUnit(id){
  alert("EditUnit-"+id)
}
function TambahStaff(nama){
  alert(nama)
}
function TambahUnit(nama){
  alert(nama)
}