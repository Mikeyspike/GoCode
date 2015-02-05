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
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, FileSystemSuccess, fail);
    window.resolveLocalFileSystemURL("file:///storage/emulated/0/Files/file.txt", obtainFileSuccess, fail);
});

$('#file-save-button').click(function(){
    window.resolveLocalFileSystemURL("file:///storage/emulated/0/Files/", function(dir) {
        console.log("got main dir",dir);
        dir.getFile("log.txt", {create:true}, function(file) {
            console.log("got the file", file);
            logOb = file;
            var fileContent = editor.getValue();
            writeLog(fileContent);            
        });
    });
});

function writeLog(str) {
    if(!logOb) return;
    var log = str + " [" + (new Date()) + "]\n";
    console.log("going to log "+log);
    logOb.createWriter(function(fileWriter) {
        
        fileWriter.seek(fileWriter.length);
        
        var blob = new Blob([log], {type:'text/plain'});
        fileWriter.write(blob);
        console.log("ok, in theory i worked");
    }, fail);
}

function FileSystemSuccess(fileSystem) {
    console.log("Got the filesystem!");
}

function obtainFileSuccess(fileEntry) {
    console.log("Obtained File!");
    console.log(fileEntry.name);
        fileEntry.file(function(file) {
            var reader = new FileReader();
            reader.onloadend = function(e) {
                console.log("Opened File");
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