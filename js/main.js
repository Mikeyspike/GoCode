var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/html");


$(document).ready(function () {
    changeSize();
    editor.setValue("<!DOCTYPE html>\n\
<html>\n\
<head>\n\
    <title>GoCode v7</title>\n\
</head>\n\
<body>\n\
    Welcome to GoCode!\n\
</body>\n\
</html>");
});

function changeSize() {
    var bodyheight = $(window).height();
    $("#editor").height(bodyheight - 101);
    $(".ace_content").height(bodyheight - 101);
    $(window).resize(function () {
        var bodyheight = $(window).height();
        $("#editor").height(bodyheight - 101);
        $(".ace_content").height(bodyheight - 101);
    });
}

$('#new-file-confirm').click(function(){
    editor.setValue("");
});

$('#mode').on('change', function () {
    var newMode = $("#mode").val();
    editor.getSession().setMode("ace/mode/"+newMode);
});
$('#theme').on('change', function () {
    var newTheme = $("#theme").val();
    editor.setTheme(newTheme);
});
$('#fontsize').on('change', function () {
    var fontSize = $("#fontsize").val();
    $('#editor').css("font-size", fontSize);
});

$('#file-open-button').click(function(){
    win();
});

function win(file) {
    var reader = new FileReader();
    reader.onloadend = function (evt) {
        console.log("read success");
        console.log(evt.target.result);
    };
    reader.readAsText(file);
};

var fail = function (error) {
    console.log(error.code);
};