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
    $("#editor").height(bodyheight - 97);
    $(".ace_content").height(bodyheight - 97);
    $(window).resize(function () {
        var bodyheight = $(window).height();
        $("#editor").height(bodyheight - 97);
        $(".ace_content").height(bodyheight - 97);
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