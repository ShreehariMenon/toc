$('#downloadPNG').on('click', function () {
    svg = $("#automatonPrint svg")[0];
    downloadSvgAsPng(svg, "Automata.png");
});

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

function drawGraph() {
    var dotString = noam.fsm.printDotFormat(automaton);
    var gvizXml = Viz(dotString, "svg");
    $("#automatonGraph").html(gvizXml);
    $("#automatonPrint").html(gvizXml);
    //reorderCirclesInAcceptingStates(automaton.acceptingStates);
    $("#automatonGraph svg").width($("#automatonGraph").width());
    $("#automatonGraph svg").width("75%");
    $("#automatonGraph svg").height("50%");
    //print
    $("#automatonPrint svg").attr("width", 1920);
    $("#automatonPrint svg").attr("height", 1080);
    //show number of states
    $("#display-states").text(automaton.states.length);
    //show number of transitions
    $("#display-accept").text(automaton.acceptingStates.length);
    //show regex
    $("#regex-show").removeClass("d-none");
    //show downloadPNG
    $("#downloadPNG").removeClass("d-none");
    //print table in automatonTable div
    $("#automatonTable").html(noam.fsm.printHtmlTable(automaton));
    $("#regex-show").text("Expresión regular" + ": " + $("#regex").val());

    //get list of all <text> elements inside <g> elements with id starting with "node"
    var labels = $("#automatonGraph svg g[id^='node'] text");
    //for each label, get replace the inner text with the state name
    labels.each(function () {
        //get the inner text of the label
        var text = $(this).text();
        //concatenate E+stateName
        var newText = "E" + text;
        //replace the inner text with the new text
        $(this).text(newText);
    }
    );

}

function initialize() {
    //prevent default submit behavior
    $("#create_Form").submit(function (e) {
        e.preventDefault();
    }
    );
}

initialize();
var regex = null;
var automaton = null;
var inputIsRegex = true;

$("#generateRegex").click(function () {
    regex = noam.re.string.random(5, "abcd", {});
    regex = noam.re.string.simplify(regex);
    $("#regex").val(regex);
    $("#regex").focus();
    onRegexOrAutomatonChange();
});

$("#createAutomaton").click(function () {
    regex = $("#regex").val();
    automaton = noam.re.string.toAutomaton(regex);
    automaton = noam.fsm.convertEnfaToNfa(automaton);
    automaton = noam.fsm.convertNfaToDfa(automaton);
    automaton = noam.fsm.minimize(automaton);
    automaton = noam.fsm.convertStatesToNumbers(automaton);
    $("#modal-crear-regex").modal("hide");
    drawGraph();
});

$("#regex").change(onRegexOrAutomatonChange);
$("#regex").keyup(onRegexOrAutomatonChange);

function onRegexOrAutomatonChange() {
    $("#createAutomaton").attr("disabled", true);
    $("#create_Form").removeClass("needs-validation");
    $("#create_Form").addClass("was-validated");
    validateRegex();
}

function validateRegex() {
    var regex = $("#regex").val();

    if (regex.length === 0) {
        //remove was validated, add needs validation
        $("#create_Form").removeClass("was-validated");
        $("#create_Form").addClass("needs-validation");
    } else {
        try {
            noam.re.string.toTree(regex);
            $("#createAutomaton").attr("disabled", false);
            $("#regex").get(0).setCustomValidity("");
        } catch (e) {
            $("#regex").get(0).setCustomValidity("invalid");
        }
    }
}
