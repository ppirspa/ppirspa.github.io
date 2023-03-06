async function includeHTML(){
  var z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      let response = await fetch(file)
      elmnt.innerHTML = await response.text()
    }
  }
  // const myModal = document.getElementById('myModal')
  // const myInput = myModal.querySelector('.first-focus')

  // myModal.addEventListener('shown.bs.modal', () => {
  // myInput.focus()
  // })
} 