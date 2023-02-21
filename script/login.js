async function login(user, password){
    spinner(true)
    var validLogin = false
    await fetch(dbAPI + "?req=login&user=" + user + "&password="  + password)
        .then(respon => respon.json())
        .then(respon => {
            if(respon.ok){
                validLogin = respon.isLogPass
            }
        })
    alert(validLogin)
    spinner(false)
    // spinner(true)
    //     Elem("showHTML").setAttribute("w3-include-html", "/html/main.html")
    //     includeHTML()
    // spinner(false)
  }