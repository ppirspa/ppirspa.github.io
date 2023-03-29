function SupShow(code){
    if(code == 'unitData'){
        document.getElementById('sup-unitData-container').classList.remove('hidden')
        Elem("sup-unitData-btn").classList.add('d-none')
    }
    if(code == 'listData'){
        document.getElementById('sup-listData-container').classList.remove('hidden')
        Elem("sup-listData-btn").classList.add('d-none')
    }
}
function SupHide(code){
    if(code == 'unitData'){
        document.getElementById('sup-unitData-container').classList.add('hidden')
        Elem("sup-unitData-btn").classList.remove('d-none')
    }
    if(code == 'listData'){
        document.getElementById('sup-listData-container').classList.add('hidden')
        Elem("sup-listData-btn").classList.remove('d-none')
    }
}
