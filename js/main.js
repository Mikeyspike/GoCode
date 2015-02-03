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
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
    window.resolveLocalFileSystemURl("file:///storage/emulated/0/Files/file.txt", onResolveSuccess, fail);
});

function onFileSystemSuccess(fileSystem) {
        console.log("on FileSystem Success");
        console.log(fileSystem.name);
    }

    function onResolveSuccess(fileEntry) {
        console.log("on Resolve Success");
        console.log(fileEntry.name);
         fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                console.log("Text is: "+this.result);
                //document.querySelector("#textArea").innerHTML = this.result;
                editor.setValue(this.result);
            }

            reader.readAsText(file);
        });
    }

function fail(e) {
    console.log("FileSystem Error");
    console.dir(e);
    console.log(e.code);
}