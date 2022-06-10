const compras_dom = (() => {
    // --------------- DOM ELEMENTS --------------- 
    const $create_input_pcompra = document.getElementById("create_input_pcompra");
    const $create_input_pventa = document.getElementById("create_input_pventa");
    const $create_input_stock = document.getElementById("create_input_stock");
    const $create_input_talla = document.getElementById("create_input_talla");
    const $edit_input_pcompra = document.getElementById("edit_input_pcompra");
    const $edit_input_pventa = document.getElementById("edit_input_pventa");
    const $edit_input_stock = document.getElementById("edit_input_stock");
    const $edit_input_talla = document.getElementById("edit_input_talla");
    const $createOK = document.getElementById("create_ok");
    const $btnReload = document.getElementById("btnTEST");
    const $createCancel = document.getElementById("create_cancel");
    const $searchBar = document.getElementById("searchBar");
    
    // --------------- LISTENERS ---------------
    $createOK.addEventListener("click",compras_functions.crearRegistro);
    $createCancel.addEventListener("click", compras_functions.reiniciaCampos);
    $create_input_pcompra.addEventListener("keyup", compras_functions.validateFloatNumber); 
    $create_input_pventa.addEventListener("keyup", compras_functions.validateFloatNumber);  
    $create_input_pcompra.addEventListener("keyup", compras_functions.validatePrice); 
    $create_input_pventa.addEventListener("keyup", compras_functions.validatePrice);  
    $create_input_stock.addEventListener("keyup", compras_functions.validateIntegerNumber); 
    $create_input_talla.addEventListener("keyup", compras_functions.validateFloatNumber);   
    $edit_input_pcompra.addEventListener("keyup", compras_functions.validateFloatNumber); 
    $edit_input_pventa.addEventListener("keyup", compras_functions.validateFloatNumber);  
    $edit_input_stock.addEventListener("keyup", compras_functions.validateIntegerNumber); 
    $edit_input_talla.addEventListener("keyup", compras_functions.validateFloatNumber);
    $btnReload.addEventListener("click", () => { location.reload() });
    $searchBar.addEventListener("keyup", compras_functions.filtrarTabla);

    // --------------- CALLS ---------------
    compras_fetch.get("https://compras-develop.herokuapp.com/api/compras/", compras_functions.loadTable, compras_functions.logError);
})();