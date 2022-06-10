const compras_dom = (() => {
    // --------------- DOM ELEMENTS --------------- 
    const $crear_ok = document.getElementById('crear-ok');

    
    // --------------- LISTENERS ---------------
    $crear_ok.addEventListener("click",compras_functions.crearAutomata);
    //$createCancel.addEventListener("click", compras_functions.reiniciaCampos);
    
})();