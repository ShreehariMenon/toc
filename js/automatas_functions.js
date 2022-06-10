const compras_functions = (() => {
    const _createAutomata = (finalStates, initialStates, states, symbols, transitions)=>{
        console.log(response)
        response.data.transitions.forEach(element => {
            
        });


        return;        
    }


    const _createRow = (id, precioCompra, precioVenta, stock, talla, color, marca, modelo) => {
        const $row = document.createElement("tr");
        const $celda_id = document.createElement("th"); $celda_id.scope = "row"; $celda_id.classList.add("columnaID");  //$celda_id.classList.add("text-center");
        const $celda_pcompra = document.createElement("td"); //$celda_pcompra.classList.add("text-center");
        const $celda_pventa = document.createElement("td"); //$celda_pventa.classList.add("text-center");
        const $celda_stock = document.createElement("td"); //$celda_stock.classList.add("text-center");
        const $celda_talla = document.createElement("td"); //$celda_talla.classList.add("text-center");
        const $celda_color = document.createElement("td"); //$celda_color.classList.add("text-center");
        const $celda_marca = document.createElement("td"); //$celda_marca.classList.add("text-center");
        const $celda_modelo = document.createElement("td"); //$celda_modelo.classList.add("text-center");
        const $celda_acciones = document.createElement("td"); $celda_acciones.classList.add("text-center");
        const $btn_editar = _createButton("editar");
        const $btn_borrar = _createButton("borrar");

        $celda_id.innerText = _intToFixedLength(id,4);
        $celda_pcompra.innerText = '$'+precioCompra;
        $celda_pventa.innerText = '$'+precioVenta;
        $celda_stock.innerText = stock;
        $celda_talla.innerText = talla;
        $celda_color.innerText = color;
        $celda_marca.innerText = marca;
        $celda_modelo.innerText = modelo;

        $celda_acciones.appendChild($btn_editar);
        $celda_acciones.appendChild($btn_borrar);

        $row.appendChild($celda_id);
        $row.appendChild($celda_pcompra);
        $row.appendChild($celda_pventa);
        $row.appendChild($celda_stock);
        $row.appendChild($celda_talla);
        $row.appendChild($celda_color);
        $row.appendChild($celda_marca);
        $row.appendChild($celda_modelo);
        $row.appendChild($celda_acciones);

        document.getElementById("tablaCompras").appendChild($row);

        updateAfterCreate(stock);
    };

    const updateAfterCreate = (stock) => {
        contadorModelos=document.getElementById("contadorModelos");
        contadorProductos=document.getElementById("contadorProductos");
        const numModelos = parseInt(contadorModelos.innerText);
        const numProductos = parseFloat(contadorProductos.innerText.replace(',',''));
        contadorModelos.innerText = numModelos+1;
        contadorProductos.innerText = numProductos+stock;
    }

    const _createButton = (texto) => {
        const $button = document.createElement("button");
        const $icon = document.createElement("i");
        $button.appendChild($icon);
        var $cell;

        if (texto == "borrar") {
            $button.className = "btn btn-s-rojo mx-1";
            $icon.className = "bi bi-trash";
            $button.addEventListener("click", (event) => {
                if ($(event.target).is("i"))
                    $cell = event.target.parentElement.parentElement;
                else
                    $cell = event.target.parentElement;
                var $row = $cell.parentElement;
                var id = $row.querySelector('.columnaID').innerText;
                var aux = document.getElementById("delete_ok");
                aux.parentNode.replaceChild(aux.cloneNode(1), aux);
                aux = document.getElementById("delete_ok");
                aux.addEventListener("click", () => {
                    compras_fetch.delete("https://compras-develop.herokuapp.com/api/compras/"+id);
                    $row.parentNode.removeChild($row);
                    $('#modalConfirmarEliminar').modal('hide');
                });
                $('#modalConfirmarEliminar').modal('show');
            });
        } else if (texto == "editar"){
            $button.className = "btn btn-s-amarillo mx-1";
            $icon.className = "bi bi-pencil-square";
            $button.addEventListener("click", (event) => {
                if ($(event.target).is("i"))
                    $cell = event.target.parentElement.parentElement;
                else
                    $cell = event.target.parentElement;
                var $row = $cell.parentElement;
                var id = $row.querySelector('.columnaID').innerText;
                const columnas = $row.childNodes;
                var temp_id =       columnas[0].innerText;
                var temp_pventa =   columnas[1].innerText.replace('$','').replace(',','');
                var temp_pcompra =  columnas[2].innerText.replace('$','').replace(',','');
                var temp_stock =    columnas[3].innerText;
                var temp_talla =    columnas[4].innerText;
                var temp_color =    columnas[5].innerText;
                var temp_marca =    columnas[6].innerText;
                var temp_modelo =   columnas[7].innerText;
                document.getElementById("edit_input_id").value = temp_id;
                document.getElementById("edit_input_pventa").value = temp_pventa;
                document.getElementById("edit_input_pcompra").value = temp_pcompra;
                document.getElementById("edit_input_stock").value = temp_stock;
                document.getElementById("edit_input_talla").value = temp_talla;
                document.getElementById("edit_input_color").value = temp_color;
                document.getElementById("edit_input_marca").value = temp_marca;
                document.getElementById("edit_input_modelo").value = temp_modelo;
                var aux = document.getElementById("edit_ok");
                aux.parentNode.replaceChild(aux.cloneNode(1), aux);
                aux = document.getElementById("edit_ok");
                aux.addEventListener("click", () => {
                    var todoOK = document.getElementById("edit_Form").checkValidity();
                    if(todoOK){
                        data = {
                            idProducto: parseInt(document.getElementById("edit_input_id").value),
                            precioCompra: parseFloat(document.getElementById("edit_input_pcompra").value),
                            precioVenta: parseFloat(document.getElementById("edit_input_pventa").value),
                            stock: parseInt(document.getElementById("edit_input_stock").value),
                            talla: document.getElementById("edit_input_talla").value,
                            color: document.getElementById("edit_input_color").value,
                            marca: document.getElementById("edit_input_marca").value,
                            modelo: document.getElementById("edit_input_modelo").value
                        };
                        compras_fetch.put("https://compras-develop.herokuapp.com/api/compras/"+id, data);
                        columnas[1].innerText = '$'+data.precioCompra;
                        columnas[2].innerText = '$'+data.precioVenta;
                        columnas[3].innerText = data.stock;
                        columnas[4].innerText = data.talla;
                        columnas[5].innerText = data.color;
                        columnas[6].innerText = data.marca;
                        columnas[7].innerText = data.modelo;
                        $('#modalEditarProducto').modal('hide');
                    }
                });
                $('#modalEditarProducto').modal('show');
            });
        }else{
            $button.className = "btn btn-s-azul mx-1";
            $icon.className = "bi bi-eye";
        }

        return $button;
    }
//VALIDACIONES
    const _intToFixedLength = (int,len) =>{
        if(int.toString().length >= len){
            return String (int);
        }else{
            res = '0'.repeat(len-int.toString().length);
            return String (res.toString()+int.toString());
        }
    }

    const _fetchTotals = (response) =>{
        var sumaTotal=0;
        for (let index = 0; index < response.data.length; index++) {
            sumaTotal = sumaTotal + response.data[index].stock; 
        }
        document.getElementById("contadorModelos").innerText = response.data.length;
        document.getElementById("contadorProductos").innerText = sumaTotal;
    }

    const _updateInfo = (response)=>{
        console.log(response);
        compras_fetch.get("https://compras-develop.herokuapp.com/api/compras/", _fetchTotals, _logError);
    };

    const _reiniciaCampos = ()=> {
        document.getElementById("create_input_pcompra").value = "";
        document.getElementById("create_input_pventa").value = "";
        document.getElementById("create_input_stock").value = "";
        document.getElementById("create_input_talla").value = "";
        document.getElementById("create_input_color").value = "";
        document.getElementById("create_input_marca").value = "";
        document.getElementById("create_input_modelo").value = "";
        document.getElementById("create_Form").classList.remove("was-validated");
    };

    const _validateFloatNumber = (event) => {
        const input = event.target;
        const value = input.value;
        const invalid_tooltip = input.nextElementSibling;
        const reg = /^\d*\.?\d*$/;
        if (value === '' || reg.test(value)) {
            input.setCustomValidity('');
        } else {
            input.setCustomValidity('Debe ingresar un número entero o flotante mayor a 0');
            invalid_tooltip.innerText = 'Debe ingresar un número entero o flotante mayor a 0';
        }
    };

    const _validateIntegerNumber = (event) => {
        const input = event.target;
        const value = input.value;
        const invalid_tooltip = input.nextElementSibling;
        const reg = /^\d+$/;
        if (value === '' || reg.test(value)) {
            input.setCustomValidity('');
        } else {
            input.setCustomValidity('Debe ingresar un número entero mayor a 0');
            invalid_tooltip.innerText = 'Debe ingresar un número entero mayor a 0';
        }
    };

    const _validatePrice = (event) => {
        const pventa = parseFloat(document.getElementById("create_input_pventa").value);
        const pcompra = parseFloat(document.getElementById("create_input_pcompra").value);
        console.log(pventa,pcompra);
        if (isNaN(pventa) || isNaN(pcompra)) {
            return;
        }
        if  (pventa > pcompra) {
            document.getElementById("advertencia").classList.remove("d-block");
            document.getElementById("advertencia").classList.add("d-none");
        } else {
            document.getElementById("advertencia").classList.remove("d-none");
            document.getElementById("advertencia").classList.add("d-block");
        }
    };

    const _crearAutomata = (target) => {
        target.preventDefault();
        form = document.getElementById("create_Form");
        form.classList.add("was-validated");
        if (form.checkValidity()) {
            const regex = document.getElementById("crear-input-regex").value;
            console.log(regex, " es la regex enviada"); // para verificar que se envio la regex correctamente
            data={
                regex: regex,
            }
            console.log(data);
            automatas_fetch.post("https://automaton-web.herokuapp.com/regex/generate",data,_postExito,_logError);
        }


    }

    const _crearRegistro = (target) => {
        target.preventDefault();
        form = document.getElementById("create_Form");
        form.classList.add("was-validated");
        var todoOK = form.checkValidity();
        if (todoOK) {
            const pcompra = document.getElementById("create_input_pcompra").value;
            const pventa = document.getElementById("create_input_pventa").value;
            const stock = document.getElementById("create_input_stock").value;
            const talla = document.getElementById("create_input_talla").value;
            const color = document.getElementById("create_input_color").value;
            const marca = document.getElementById("create_input_marca").value;
            const modelo = document.getElementById("create_input_modelo").value;
            data = {
                precioCompra: pcompra,
                precioVenta: pventa,
                talla: talla,
                stock: stock,
                color: color,
                marca: marca,
                modelo: modelo
            };
            compras_fetch.post("https://compras-develop.herokuapp.com/api/compras/", data, _postExito, _logError);
            $('#modalAgregarProducto').modal('hide');
            form.classList.remove("was-validated");
            _reiniciaCampos();
        }
    };

    const _loadTable = (response) => {
        //sort response by id
        response.data = response.data.sort(function(a, b) {
            return a.idProducto - b.idProducto;
        });
        for (let index = 0; index < response.data.length; index++) {
            const idProducto = response.data[index].idProducto;
            const precioCompra = response.data[index].precioCompra;
            const precioVenta = response.data[index].precioVenta;
            const stock = response.data[index].stock;
            const talla = response.data[index].talla;
            const color = response.data[index].color;
            const marca = response.data[index].marca;
            const modelo = response.data[index].modelo;
            _createRow(idProducto, precioCompra, precioVenta, stock, talla, color, marca, modelo);
        }
        console.log("Content loaded successfully. response:",response);
    };

    const _filtrarTabla = () => {
        var input, filter, table, tr, td, i;
        input = document.getElementById("searchBar");
        filter = input.value.toUpperCase();
        table = document.getElementById("tablaCompras");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            tr[i].style.display = "none";
            td = tr[i].childNodes;
            if (td) {
                idValue = td[0].innerText;
                tallaValue = td[4].innerText.toUpperCase();
                colorValue = td[5].innerText.toUpperCase();
                marcaValue = td[6].innerText.toUpperCase();
                modeloValue = td[7].innerText.toUpperCase();
                if (idValue.indexOf(filter) > -1 || tallaValue.indexOf(filter) > -1 || colorValue.indexOf(filter) > -1 || marcaValue.indexOf(filter) > -1 || modeloValue.indexOf(filter) > -1) {
                    tr[i].style.display = "";
                }
            }
        }
    }

    const _postExito = (response) => {
        const finalStates = response.data.final;
        const initialStates = response.data.initial;
        const states = response.data.states;
        const symbols = response.data.symbols;
        const transitions = response.data.transitions;
        _createAutomata(finalStates, initialStates, states, symbols, transitions);
        console.log(response);
    };

    const _logError = (response) => {
        console.log(response, "Algo salió mal");
    };
    return {
        validateFloatNumber: _validateFloatNumber,
        validateIntegerNumber: _validateIntegerNumber,        
        reiniciaCampos: _reiniciaCampos,
        validatePrice: _validatePrice,
        crearRegistro: _crearRegistro,
        crearAutomata: _crearAutomata,
        loadTable: _loadTable,
        filtrarTabla: _filtrarTabla,
        postExito: _postExito,
        logError: _logError,
        createRow: _createRow,
        createButton: _createButton,
        intToFixedLength: _intToFixedLength,
        updateInfo: _updateInfo,
        fetchTotals: _fetchTotals
    }
})();