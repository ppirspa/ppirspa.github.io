var rsAPI = "https://script.google.com/macros/s/AKfycbxqaLuBn2hKTGXQ-SSBbF-QXKCxohWXZSrvdCbTTgyQsstseStiMS79KuEGHOzn0tzt/exec";
var dbAPI = "https://script.google.com/macros/s/AKfycbxvkxWqys8mKB_WQYYnOBeYUXX7zR55LEBj8Owwn8kIJ-57OKvzWf3Pk4VpRgtTvjwY/exec"
var sendform = {
    userName : "",
    userAgent: ""
};
var database = {};
    database["staffData"] = []
    database["unitData"] = []
    database["hhData"] = []
    database["userList"] = {}
var inputListCurrentFocus
var TableDivider = {
    "hh":10
} 
var TableMinimal = {
    "hh": 0
}
var loginPass = true
var UserInfo = {
  username : "",
  fullName : "",
  id : ""
}

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
// ===============================================================================
async function onload(){
  await includeHTML()
  // await login("arga", "ppirspa")
  // await NavbarTo("Hand Hygiene")
  // await NavbarTo("Kepatuhan APD")
  // await NavbarTo("Resume")
  // Elem("apd-tab").click()
  // console.log(database)

}
let timeout;
// ============================================================================
async function NavbarTo(target){  
  console.log("Nav to : "+target)
  var navLinkNodes = document.querySelectorAll(".nav-item .nav-link span")
  navLinkNodes.forEach((p)=>{
    p.parentElement.classList.remove("active");
    if(p.innerHTML == target){
      p.parentElement.classList.add("active");
    }
  })
  
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
  if(target === "Kepatuhan APD"){ResetAPDInput()}
  if(target === "Supervisi"){}
  if(target === "Resume"){ResetResume()}
  if(target === "Setting"){}
  // InputWithList()
  onChangeAddEvent()
}
function InputWithList(){
  // console.log("inpwithlist")
  document.querySelectorAll(".input-with-list").forEach((elem) => {
      elem.removeEventListener('input', filterInputList)
      elem.addEventListener('input', filterInputList)
      
      function filterInputList(){
        var inputID = elem.id
        var text = elem.value
        var listTargetID = elem.getAttribute("list-name")
        var listElem = Elem(listTargetID)
        listElem.innerHTML = ""
        
        if(!(Elem(inputID).classList.contains("no-list-add"))){var listTambah =  document.querySelector("#tambah-list-template > ul").cloneNode(true)}

        var filteredData = database[listElem.getAttribute("list-data-to-filter")].filter((x) => {
          var j = false
          if(listElem.getAttribute("list-data-to-filter") == "unitData"){
            if(x["alternatif"].toString().toLowerCase().includes(text.toLowerCase())){j = true}
          }
          return x["name"].toString().toLowerCase().includes(text.toLowerCase()) || j 
        })
        
        if(text.length < 1){return false;}

        inputListCurrentFocus = -1
        if(text.length > 0){
            if(!(Elem(inputID).classList.contains("no-list-add"))){
                listElem.appendChild(listTambah)
                
                document.querySelector("#" + listTargetID + " > ul > .tambah-list > div > span").innerHTML = text;
                document.querySelector("#" + listTargetID + " > ul > .tambah-list > div").setAttribute("onclick", listElem.getAttribute("tambah-list-function").replace("()","('"+text+ "')" + 
                "; document.getElementById('"+inputID+"').value = ''"))
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
                        + "inputChange(Elem('"+ inputID + "')); Elem('"+inputID+"').onchange(); "
                        + addFunc1
                    )
                    var liEdit = liNew.querySelector("div:nth-child(2)")
                    if(Elem(inputID).classList.contains("no-list-add")){
                      liEdit.classList.add("d-none")
                    }
                    else{
                      liEdit.setAttribute("onclick", Elem(inputID).getAttribute("edit-function") + "(" + filteredData[i].id + ")")
                    }
                    ulNew.appendChild(liNew)
                }   
            }
        }
      }
      elem.removeEventListener("keydown", function(e){})
      elem.addEventListener("keydown", function(e){
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
      });
    
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
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
  if(inputGroup === "hh"){hhInputChange(elem)}
  else if(inputGroup === "apd"){apdInputChange(elem)}
  // console.log(inputGroup)
}
async function EditStaff(id){
  var ids = database.staffData.map((p)=>{return p.id})
  var index = ids.indexOf(id) 
  var nama = database.staffData[index].name
  var group = database.staffData[index].baseGroup 
  var unit = database.staffData[index].baseUnit

  var myModal = Elem("myModal")
  // title
  Elem("myModalLabel").innerHTML = "Edit Data Staff"

  // body
  var body = Elem("staffModal-body").cloneNode(true)
  var modalBody = myModal.querySelector(".modal-body")
  modalBody.innerHTML = ""
  modalBody.appendChild(body)
  modalBody.querySelector("#staff-input-id").value = id
  modalBody.querySelector("#staff-input-id").classList.remove("d-none")
  modalBody.querySelector("#staff-input-nama").value = nama
  modalBody.querySelector("#staff-input-kelompok").value = group
  modalBody.querySelector("#staff-input-unit").value = unit

  //footer
  var footer = Elem("staffModal-footer").cloneNode(true)
  footer.querySelectorAll(".modal-btn").forEach((p)=>{
    p.classList.add("d-none")
  })

  var btnTambah = footer.querySelector(".modal-tambah")
  btnTambah.classList.remove("d-none")
  btnTambah.addEventListener("click",function(){
    staffAPI("Tambah")
    document.querySelector(".modal-tutup").click()
  })
  var btnSimpan = footer.querySelector(".modal-simpan")
  btnSimpan.classList.remove("d-none")
  btnSimpan.addEventListener("click",function(){
    staffAPI("Simpan")
    document.querySelector(".modal-tutup").click()
  })
  var btnHapus = footer.querySelector(".modal-hapus")
  btnHapus.classList.remove("d-none")
  btnHapus.addEventListener("click",function(){
    staffAPI("Hapus")
    document.querySelector(".modal-tutup").click()
  })
  myModal.querySelector(".modal-footer").innerHTML = ""
  myModal.querySelector(".modal-footer").appendChild(footer)

  Elem("myModalButton").click()
  InputWithList()
}
async function TambahStaff(nama){
  var myModal = Elem("myModal")
  // title
  Elem("myModalLabel").innerHTML = "Tambah Data Staff"
  
  // body
  var body = Elem("staffModal-body").cloneNode(true)
  var modalBody = myModal.querySelector(".modal-body")
  modalBody.innerHTML = ""
  modalBody.appendChild(body)
  modalBody.querySelector("#staff-input-nama").value = nama
  modalBody.querySelector("#staff-input-id").classList.add("d-none")
  modalBody.querySelector("#staff-input-id").value = ""

  //footer
  var footer = Elem("staffModal-footer").cloneNode(true)
  footer.querySelectorAll(".modal-btn").forEach((p)=>{
    p.classList.add("d-none")
  })
  var btnTambah = footer.querySelector(".modal-tambah")
  btnTambah.classList.remove("d-none")
  btnTambah.addEventListener("click",function(){
    staffAPI("Tambah")
    document.querySelector(".modal-tutup").click()
  })
  
  myModal.querySelector(".modal-footer").innerHTML = ""
  myModal.querySelector(".modal-footer").appendChild(footer)
  
  Elem("myModalButton").click()
  InputWithList()
}
async function EditUnit(id){
  var ids = database.unitData.map((p)=>{return p.id})
  const formAssignObj = groupBy(database.unitData, "formAssign")
  function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      const curGroup = acc[key] ?? [];
      return { ...acc, [key]: [...curGroup, obj] };
    }, {});
  }
  var formAssignList = []
  Object.keys(formAssignObj).forEach((p)=>{
    var units = formAssignObj[p].map((p)=>{return p.name})
    formAssignList.push([p, units.join(", ")])
  })
  
  var index = ids.indexOf(id) 
  var unitName = database.unitData[index].name
  var altName = database.unitData[index].alternatif
  var formAssign = database.unitData[index].formAssign 
  
  var myModal = Elem("myModal")
  // title
  Elem("myModalLabel").innerHTML = "Edit Data Unit / Ruang"

  // body
  var body = Elem("unitModal-body").cloneNode(true)
  var modalBody = myModal.querySelector(".modal-body")
  modalBody.innerHTML = ""
  modalBody.appendChild(body)
  modalBody.querySelector("#unit-input-id").value = id
  modalBody.querySelector("#unit-input-id").classList.remove("d-none")
  modalBody.querySelector("#unit-input-nama").value = unitName
  modalBody.querySelector("#unit-input-alternate").value = altName
  var formAssignInput = modalBody.querySelector("#unit-input-formAssign") 
  formAssignInput.innerHTML = ""
  formAssignList.forEach((p)=>{
    var opt = document.createElement("option")
    opt.setAttribute("value", p[0])
    opt.innerHTML = p[0] + ": " + p[1]
    formAssignInput.appendChild(opt)
  })
  formAssignInput.value = ""
  if(formAssign !== ""){formAssignInput.value = formAssign}

  //footer
  var footer = Elem("unitModal-footer").cloneNode(true)
  footer.querySelectorAll(".modal-btn").forEach((p)=>{
    p.classList.add("d-none")
  })

  var btnTambah = footer.querySelector(".modal-tambah")
  btnTambah.classList.remove("d-none")
  btnTambah.addEventListener("click",function(){
    unitAPI("Tambah")
    document.querySelector(".modal-tutup").click()
  })
  var btnSimpan = footer.querySelector(".modal-simpan")
  btnSimpan.classList.remove("d-none")
  btnSimpan.addEventListener("click",function(){
    unitAPI("Simpan")
    document.querySelector(".modal-tutup").click()
  })
  var btnHapus = footer.querySelector(".modal-hapus")
  btnHapus.classList.remove("d-none")
  btnHapus.addEventListener("click",function(){
    unitAPI("Hapus")
    document.querySelector(".modal-tutup").click()
  })
  myModal.querySelector(".modal-footer").innerHTML = ""
  myModal.querySelector(".modal-footer").appendChild(footer)

  Elem("myModalButton").click()
  InputWithList()
}
async function TambahUnit(nama){
  // var ids = database.unitData.map((p)=>{return p.id})
  const formAssignObj = groupBy(database.unitData, "formAssign")
  function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      const curGroup = acc[key] ?? [];
      return { ...acc, [key]: [...curGroup, obj] };
    }, {});
  }
  var formAssignList = []
  Object.keys(formAssignObj).forEach((p)=>{
    var units = formAssignObj[p].map((p)=>{return p.name})
    formAssignList.push([p, units.join(", ")])
  })
  
  var myModal = Elem("myModal")
  // title
  Elem("myModalLabel").innerHTML = "Tambah Unit / Ruang"

  // body
  var body = Elem("unitModal-body").cloneNode(true)
  var modalBody = myModal.querySelector(".modal-body")
  modalBody.innerHTML = ""
  modalBody.appendChild(body)
  modalBody.querySelector("#unit-input-id").value = ""
  modalBody.querySelector("#unit-input-id").classList.add("d-none")
  modalBody.querySelector("#unit-input-nama").value = nama
  modalBody.querySelector("#unit-input-alternate").value = ""
  
  var formAssignInput = modalBody.querySelector("#unit-input-formAssign") 
  formAssignInput.innerHTML = ""
  var firstOpt = document.createElement("option")
  firstOpt.setAttribute("disabled", "")
  firstOpt.setAttribute("selected", "")
  firstOpt.innerHTML = "Jenis Formulir Supervisi"
  formAssignInput.appendChild(firstOpt)
  formAssignList.forEach((p)=>{
    var opt = document.createElement("option")
    opt.setAttribute("value", p[0])
    opt.innerHTML = p[0] + ": " + p[1]
    formAssignInput.appendChild(opt)
  })
  formAssignInput.selectedIndex = 0

  //footer
  var footer = Elem("unitModal-footer").cloneNode(true)
  footer.querySelectorAll(".modal-btn").forEach((p)=>{
    p.classList.add("d-none")
  })

  var btnTambah = footer.querySelector(".modal-tambah")
  btnTambah.classList.remove("d-none")
  btnTambah.addEventListener("click",function(){
    unitAPI("Tambah")
    document.querySelector(".modal-tutup").click()
  })
  var btnSimpan = footer.querySelector(".modal-simpan")
  btnSimpan.classList.add("d-none")
  
  var btnHapus = footer.querySelector(".modal-hapus")
  btnHapus.classList.add("d-none")

  myModal.querySelector(".modal-footer").innerHTML = ""
  myModal.querySelector(".modal-footer").appendChild(footer)

  Elem("myModalButton").click()
  InputWithList()
}
async function staffAPI(code){
  if (confirm(code + " data?") == true){
    spinner(true)
    var staffDataModal = document.querySelector("#myModal")
    var stafID = staffDataModal.querySelector("#staff-input-id").value
    var nama = staffDataModal.querySelector("#staff-input-nama").value.toString().toUpperCase()
    var groupBase = staffDataModal.querySelector("#staff-input-kelompok").value
    var unitBase = staffDataModal.querySelector("#staff-input-unit").value.toString().toUpperCase()
    if(code == "Tambah"){
      console.log("Req Send: Tambah ....")
      await fetch(rsAPI + "?req=objins&name=" + nama + "&baseUnit="  + unitBase + "&baseGroup=" + groupBase)
        .then(respon => respon.json())
        .then(respon => {
            if(respon.ok){
                console.log("Respon: ok...")
                database.staffData = respon.data; 
            }
        })
    }
    else if(code == "Hapus"){
      console.log("Req Send: Hapus ....")
      await fetch(rsAPI + "?req=objdel&id="  + stafID)
        .then(respon => respon.json())
        .then(respon => {
            if(respon.ok){
                console.log("Respon: ok...")
                database.staffData = respon.data; 
            }
        })
    }
    else if(code == "Simpan"){
      console.log("Req Send: Simpan ....")
      await fetch(rsAPI + "?req=objupd&name=" + nama + "&id="  + stafID + "&baseUnit="  + unitBase + "&baseGroup=" + groupBase)
        .then(respon => respon.json())
        .then(respon => {
            if(respon.ok){
                console.log("Respon: ok...")
                database.staffData = respon.data; 
            }
        })
    }
    spinner(false)  
    Toast(code + " - Success")
    return
  }
  else {
    return
  }
}
async function unitAPI(code){
  if (confirm(code + " data?") == true){
    spinner(true)
    var myModal = document.querySelector("#myModal")
    var unitName = myModal.querySelector("#unit-input-nama").value.toString().toUpperCase()
    var unitAltName = myModal.querySelector("#unit-input-alternate").value.toString().toUpperCase()
    var unitID = myModal.querySelector("#unit-input-id").value
    var unitForm = myModal.querySelector("#unit-input-formAssign").value.toString().toUpperCase()
    if(code == "Tambah"){
      console.log("Req Send: Tambah ....")
      await fetch(rsAPI + "?req=untins&name=" + nama + "&alternatif="  + unitAltName + "&formAssign=" + unitForm)
        .then(respon => respon.json())
        .then(respon => {
            if(respon.ok){
                console.log("Respon: ok...")
                database.unitData = respon.data; 
            }
        })
    }
    else if(code == "Hapus"){
      console.log("Req Send: Hapus ....")
      await fetch(rsAPI + "?req=untdel&id="  + unitID)
        .then(respon => respon.json())
        .then(respon => {
            if(respon.ok){
                console.log("Respon: ok...")
                database.unitData = respon.data; 
            }
        })
    }
    else if(code == "Simpan"){
      console.log("Req Send: Simpan ....")
      await fetch(rsAPI + "?req=untupd&name=" + nama + "&id="  + unitID + "&alternatif="  + unitAltName + "&formAssign=" + unitForm)
        .then(respon => respon.json())
        .then(respon => {
            if(respon.ok){
                console.log("Respon: ok...")
                database.unitData = respon.data; 
            }
        })
    }
    Toast(code + " - Success")
    spinner(false)
    return
  }
  else {
    return
  }
}
function capitalInput(elem){
  var value = elem.value
  elem.value = value.toString().toUpperCase()
}
function toDec(num, nDec){
  var j = Math.floor(num * Math.pow(10,nDec))
  return j / Math.pow(10,nDec)
}
function monthDiff(d1, d2){
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}
function getMonthSequenceList(d1, d2){
  var nMonth = monthDiff(d1, d2) + 1
  // return nMonth
  var res = []
  for (var i = 0; i < nMonth; i++){
    var m0 = d1.getMonth()
    var y0 = d1.getFullYear()
    var mAdd = m0 + i

    res.push(new Date(y0 + Math.floor(mAdd/12), mAdd%12, 1))
  }
  return res
}