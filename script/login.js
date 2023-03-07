async function login(user, password){ 
    spinner(true)
    var validLogin = false
    var ppiOnly = false
    var hhData = []
    if(user === "out"){
        console.log("log out...")
        Elem("showHTML").setAttribute("w3-include-html", "/html/B-landLogin.html")
        includeHTML()
        spinner(false)
    }
    else {
        console.log("login...trying...")
        await fetch(dbAPI + "?req=login&user=" + user + "&password="  + password + "&device=" + window.navigator.userAgent)
        .then(respon => respon.json())
        .then(respon => {
            if(respon.ok){
                console.log("respon.ok")
                validLogin = respon.isLogPass; 
                ppiOnly = respon.isPPI;
                hhData = respon.hhData
            }
        })
        console.log("validLogin is " + validLogin)
        if(validLogin){
            database["hhData"] = hhData
            Elem("showHTML").setAttribute("w3-include-html", "/html/C-body.html");
            await includeHTML()
            Elem("userLoginName").innerHTML = user
            UserName = user
            console.log("ppiOnly-" + ppiOnly)
            if(ppiOnly){
                document.querySelectorAll(".ppi-only").forEach((p)=>{p.classList.remove("disabled")})
                document.querySelectorAll(".ppi-only-div").forEach((p)=>{p.classList.remove("disabled")})
            }
            else {
                document.querySelectorAll(".ppi-only").forEach((p)=>{p.classList.add("disabled")})
                document.querySelectorAll(".ppi-only-div").forEach((p)=>{p.classList.add("disabled")})
            }
            
            var urlRS = rsAPI + "?req=allget"
            await fetch(urlRS)
                .then(respon => respon.json())
                .then(respon => {
                    if(respon.ok){
                        Toast("RSAPI - Success")
                        database["staffData"] = respon.staffData
                        database["unitData"] = respon.unitData
                    }
                })
            // console.log(database)
            spinner(false)

            return
        }
        else{alert("Username dan password tidak sesuai");spinner(false)}
    }
    // spinner(false)
  }
