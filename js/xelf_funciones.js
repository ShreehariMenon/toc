/*
Función anónima llamada al hacer click sobre el botón de Descargar PNG.
Llama a la función downloadSvgAsPng, que descarga el archivo PNG del SVG del automata.
*/
$('#downloadPNG').on('click', function () {
    svg = $("#automatonPrint svg")[0];
    downloadSvgAsPng(svg, "Automata.png");
});

/*
Función que descarga un archivo PNG del SVG del automata.
Utiliza XMLSerializer para serializar el SVG, y luego lo guarda en un archivo PNG.
Recibe como parámetros el SVG y el nombre que tendrá el archivo descargado.
*/
function downloadSvgAsPng(svgElement, name) {
    var svg = new XMLSerializer().serializeToString(svgElement);
    var canvas = document.createElement("canvas");
    canvas.width = svgElement.width.baseVal.value;
    canvas.height = svgElement.height.baseVal.value;
    var ctx = canvas.getContext("2d");
    var data = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
    var img = new Image();
    img.src = data;
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        var canvasdata = canvas.toDataURL("image/png");
        var a = document.createElement("a");
        a.download = name;
        a.href = canvasdata;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

/*
Dibuja el automata en el div #automatonGraph.
*/
function draw() {
    try {
        data = vis.parseDOTNetwork($("#data").val());
        network.setData(data);
    } catch (err) {
        var match = /\(char (.*)\)/.exec(err);
        if (match) {
            var pos = Number(match[1]);
            var textarea = $("#data")[0];
            if (textarea.setSelectionRange) {
                textarea.focus();
                textarea.setSelectionRange(pos, pos);
            }
        }
    }
}

/*
Función que valida la expresión regular, y si es válida, crea el automata utilizando la función createAutomaton.
de la librería noam.js. Una vez creado, se exporta el automata en formato DOT,
este se utiliza como dato para crear el gráfico del automata utilizando vis network.
*/
$("#createAutomaton2").click(function () {
    $("#automata-network").removeClass("d-none");
    $("#automatonGraph").addClass("d-none");
    var regex = $("#regex2").val();
    regex = regex.replace(/\|/g, "+");
    automaton = noam.re.string.toAutomaton(regex);
    automaton = noam.fsm.convertEnfaToNfa(automaton);
    automaton = noam.fsm.convertNfaToDfa(automaton);
    automaton = noam.fsm.minimize(automaton);
    automaton = noam.fsm.convertStatesToNumbers(automaton);
    var automatonDot = noam.fsm.printDotFormat(automaton);
    var automatonDotLines = automatonDot.split("\n");
    var automatonDotLinesNew = [];
    var numberOfStates=0;
    var numberOfValidStates=0;
    var startIsEnd = false;
    for (var i = 0; i < automatonDotLines.length; i++) {
        if (automatonDotLines[i].includes("secret")) {
            automatonDotLinesNew.push("");
        } else if (automatonDotLines[i].includes("doublecircle")) {
            var line = automatonDotLines[i].split("]");
            var lineNew = line[0] + "] " + line[1].replace(/\d+/g, function (match) {
                numberOfValidStates++;
                if(match==0 || match=='0'){startIsEnd=true; return ""}else
                return "E" + match;
            }).replace(/\s+/g, " ");
            automatonDotLinesNew.push(lineNew.replace("shape = doublecircle", "fontcolor=black,color=#68cc83,shadow.enabled=true"));
            automatonDotLinesNew.push("edge [length=200, color=gray, font.strokeWidth=0.1, fontcolor=white, physics=false]");
            if (startIsEnd) {
                automatonDotLinesNew.push("node [fontcolor=black,color=#68cc83,shadow.color=#e8be82, shadow.enabled=true]; E0 ;");
            }else{
                automatonDotLinesNew.push("node [fontcolor=black,color=#e8be82,shadow.color=#e8be82, shadow.enabled=true]; E0 ;");
            }
            automatonDotLinesNew.push("node [fontcolor=black,color=#739be6,shadow.enabled=true];");
        } else if (automatonDotLines[i].startsWith("  node [shape = circle];")) {
            automatonDotLinesNew.push("");
        } else {
            var lineSplit = automatonDotLines[i].split("[");
            if (lineSplit.length > 1) {
                var lineSplit0 = lineSplit[0].replace(/\d+/g, function (match) {
                    if(parseInt(match)+1>numberOfStates){numberOfStates= parseInt(match)+1;}
                    return "E" + match;
                }).replace(/\s+/g, "");
                var lineSplitNew = lineSplit0 + "[" + lineSplit[1];
                automatonDotLinesNew.push(lineSplitNew);
            } else {
                automatonDotLinesNew.push(automatonDotLines[i]);
            }
        }
    }
    automatonDot = automatonDotLinesNew.join("\n");
    $("#modal-crear-regex2").modal("hide");
    var container = document.getElementById("automata-network");
    var options = {
        physics: {
            stabilization: false,
            barnesHut: {
                springLength: 150,
            },
        },
    };
    var data = {};
    var network = new vis.Network(container, data, options);
    try {
        data = vis.parseDOTNetwork(automatonDot);
        network.setData(data);
    } catch (err) {
    }
    network = new vis.Network(container, data, options);
    $(window).load(draw);
    showRegex2();
    $("#downloadPNG").addClass("d-none");
    $("#display-states").text(numberOfStates);
    $("#display-accept").text(numberOfValidStates);
    showTable();
    //display info1 and info2
    $("#info1").removeClass("d-none");
    $("#info2").removeClass("d-none");
});

/*
Función que crea el automata utilizando la función createAutomaton de la librería noam.js.
Una vez creado el formato DOT, se crea el automata en SVG, y se guarda en el div #automatonGraph.
Una copia de este autómata es guardada en el div #automatonPrint.
El autómata del div #automatonGraph recibe atributos de alto y ancho relativos al tamaño de la pantalla.
El autómata del div #automatonPrint recibe atributos de alto y ancho fijos, que se utilizan para la descarga del archivo PNG.
*/
function drawGraph() {
    var dotString = noam.fsm.printDotFormat(automaton);
    var gvizXml = Viz(dotString, "svg");
    $("#automatonGraph").html(gvizXml);
    $("#automatonPrint").html(gvizXml);
    $("#automatonGraph svg").width($("#automatonGraph").width());
    $("#automatonGraph svg").width("75%");
    $("#automatonGraph svg").height("50%");
    $("#automatonPrint svg").attr("width", 1920);
    $("#automatonPrint svg").attr("height", 1080);
    $("#display-states").text(automaton.states.length);
    $("#display-accept").text(automaton.acceptingStates.length);
    $("#downloadPNG").removeClass("d-none");
    showTable();
    showRegex();

    var labels = $("#automatonGraph svg g[id^='node'] text");
    labels.each(function () {
        var text = $(this).text();
        var newText = "E" + text;
        $(this).text(newText);
    }
    );
}

/*
Estas funciones muestra el elemento regex-show, que contiene la expresión regular que se ha introducido y hacen visible la tabla.
*/
function showRegex() {
    var regex = $("#regex").val();
    var regexNew = regex.replace(/\+/g, "|");
    $("#regex-show").text("Expresión regular" + ": " + regexNew);
    $("#regex-show").removeClass("d-none");
}
function showRegex2() {
    var regex = $("#regex2").val();
    var regexNew = regex.replace(/\+/g, "|");
    $("#regex-show").text("Expresión regular" + ": " + regexNew);
    $("#regex-show").removeClass("d-none");
}
function showTable(){
    $("#automatonTable").html(noam.fsm.printHtmlTable(automaton));
}

/*
Estas funciones crean una expresión regular valida en el campo de texto del formulario en el que están
*/
function createRegex() {
    var regexNew = regex.replace(/\+/g, "|");
    $("#regex").val(regexNew);
}
function createRegex() {
    var regexNew = regex.replace(/\+/g, "|");
    $("#regex").val(regexNew);
}

/*
Esta función se encarga de manipular el comportamiento de los formularios utilizados para crear el automata.
Evita el comportamiento por default del formulario, así la página no se recarga por sí sola.
*/
function initialize() {
    $("#create_Form").submit(function (e) {
        e.preventDefault();
    }
    );
    $("#create_Form2").submit(function (e) {
        e.preventDefault();
    }
    );
}

/*
Aquí se llama a la función initialize, y se definen las variables globales regex y automaton.
*/
initialize();
var regex = null;
var automaton = null;
var inputIsRegex = true;
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
/*
Función anónima que se encarga de generar una expresión regular aleatoria valida.
*/
$("#rand1").click(function () {
    regex = noam.re.string.random(5, "abcd", {});
    regex = noam.re.string.simplify(regex);
    regex = regex.replace(/\+/g, "|");
    $("#regex").val(regex);
    $("#regex").focus();
    onRegexOrAutomatonChange();
});
$("#rand2").click(function () {
    regex = noam.re.string.random(5, "abcd", {});
    regex = noam.re.string.simplify(regex);
    regex = regex.replace(/\+/g, "|");
    $("#regex2").val(regex);
    $("#regex2").focus();
    onRegexOrAutomatonChange();
});

/*
Función anónima que se encarga de generar un automata utilizando la Expresión regular del campo de texto.
Utiliza los métodos de la librería noam.js Para generar el automata.
Una vez generado, lo dibuja utilizando la función drawGraph.
*/
$("#createAutomaton").click(function () {
    $("#automata-network").addClass("d-none");
    $("#automatonGraph").removeClass("d-none");
    regex = $("#regex").val();
    //replace all | with +
    regex = regex.replace(/\|/g, "+");
    automaton = noam.re.string.toAutomaton(regex);
    automaton = noam.fsm.convertEnfaToNfa(automaton);
    automaton = noam.fsm.convertNfaToDfa(automaton);
    automaton = noam.fsm.minimize(automaton);
    automaton = noam.fsm.convertStatesToNumbers(automaton);
    $("#modal-crear-regex").modal("hide");
    drawGraph();
    //display info1 and info2
    $("#info1").addClass("d-none");
    $("#info2").addClass("d-none");
});

/*
Listeners para los eventos de los campos de texto, llaman a la validación cada vez que el contenido
del campo de texto cambia.
*/
$("#regex").change(onRegexOrAutomatonChange);
$("#regex").keyup(onRegexOrAutomatonChange);

function onRegexOrAutomatonChange() {
    $("#createAutomaton").attr("disabled", true);
    $("#create_Form").removeClass("needs-validation");
    $("#create_Form").addClass("was-validated");
    validateRegex();
}

/*
Función que se encarga de validar la expresión regular.
Si la expresión regular es válida, se habilita el botón de crear automata.
Si la expresión regular no es válida, se deshabilita el botón de crear automata y se muestra
un mensaje de error al usuario.
*/
function validateRegex() {
    //replace all | with + to make it valid regex
    var regex = $("#regex").val();
    var regexNew = regex.replace(/\|/g, "+");

    if (regexNew.length === 0) {
        $("#create_Form").removeClass("was-validated");
        $("#create_Form").addClass("needs-validation");
    } else {
        try {
            noam.re.string.toTree(regexNew);
            $("#createAutomaton").attr("disabled", false);
            $("#regex").get(0).setCustomValidity("");
        } catch (e) {
            $("#regex").get(0).setCustomValidity("invalid");
        }
    }
}
