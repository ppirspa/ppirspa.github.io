async function login(user, password){
    spinner(true)
    var validLogin = false
    await fetch(dbAPI + "?req=login&user=" + user + "&password="  + password + "&device=" + window.navigator.userAgent)
        .then(respon => respon.json())
        .then(respon => {
            if(respon.ok){
                validLogin = respon.isLogPass
            }
        })
    if(validLogin){
        Elem("showHTML").setAttribute("w3-include-html", "/html/main.html")
        includeHTML()
    }
    else{alert("Username dan password tidak sesuai")}
    spinner(false)
  }