var editor = ace.edit("editor");
	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/html");



$(document).ready(function () {
	changeSize();
    $('.modal-trigger').leanModal();
    $('select').material_select();
    $('.button-collapse').sideNav({menuWidth: 240, activationWidth: 100});

    $('#new-file-modal-yes').click(function(){
        $('.button-collapse').sideNav('hide');
        toast('New File Created!', 4000) // 4000 is the duration of the toast
        editor.setValue(null);
    });

    //App settings changes
    $('#mode').on('change', function () {
        var newMode = $("#mode").val()
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

    //file open
    var fileInput = document.getElementById('fileinput');
    //var fileDisplayArea = editor.setValue();

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                editor.setValue(reader.result);
                toast('File Opened!', 4000) // 4000 is the duration of the toast
                $('#open-file-modal').closeModal();
                $('.button-collapse').sideNav('hide');
            }

            reader.readAsText(file);    
        } else {
            editor.setValue("File Not Supported!!!");
        }
    });

});

function changeSize() {
    var bodyheight = $(window).height();
    $("#editor").height(bodyheight - 109);
    $(".ace_content").height(bodyheight - 109);
    $(window).resize(function () {
        var bodyheight = $(window).height();
        $("#editor").height(bodyheight - 109);
        $(".ace_content").height(bodyheight - 109);
    });
}


$('#save-file-modal-yes').click(function(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, FileSystemSuccess, fail);
    var filename = document.getElementById('save-file-name').value
    window.resolveLocalFileSystemURL(fileSystem.root, function(dir) {
        console.log("got main dir",dir);
        dir.getFile(filename + ".txt", {create:true}, function(file) {
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
    //console.log("going to log "+log);
    logOb.createWriter(function(fileWriter) {
        
        fileWriter.seek(fileWriter.length);
        
        var blob = new Blob([log], {type:'text/plain'});
        fileWriter.write(blob);
        console.log("ok, in theory i worked");
        toast('File Saved!', 4000) // 4000 is the duration of the toast
    }, fail);
}

function FileSystemSuccess(fileSystem) {
    console.log("Got the filesystem!");
}

function fail(e) {
    console.log("FileSystem Error");
    console.dir(e);
    console.log(e.code);
    toast('Something Went Wrong D:', 4000) // 4000 is the duration of the toast
}