$(document).ready(function () {
    var myCodeMirror = CodeMirror(document.getElementById("editor"), {
      value: "Welcome to GoCode!",
      mode:  "htmlmixed",
      theme: "monokai",
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      matchTags: true,
      autoCloseTags: true
    });
    changeSize();
	
    $('.modal-trigger').leanModal();
    $('select').material_select();
    $('.button-collapse').sideNav({menuWidth: 240, activationWidth: 100});

    /*
    $('#new-file-modal-yes').click(function(){
        $('.button-collapse').sideNav('hide');
        toast('New File Created!', 4000 );
        myCodeMirror.setValue("");
        console.log("I wokred");
    });
    */

    var newFileButton = document.getElementById('new-file-modal-yes');

    newFileButton.addEventListener('click', function(e){
        $('.button-collapse').sideNav('hide');
        toast('New File Created!', 4000 );
        myCodeMirror.setValue("");
        console.log("I worked");
    });

    //App settings changes
    $('#mode').on('change', function () {
        var newMode = $("#mode").val();
        myCodeMirror.setOption("mode", newMode);
    });
    $('#theme').on('change', function () {
        var newTheme = $("#theme").val();
        myCodeMirror.setOption("theme", newTheme);
    });
    $('#fontsize').on('change', function () {
        var fontSize = $("#fontsize").val();
        $('#editor').css("font-size", fontSize);
    });

    //file open
    var fileInput = document.getElementById('fileinput');
    var fileDisplayArea = myCodeMirror.value;

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                myCodeMirror.setValue(reader.result);
                toast('File Opened!', 4000 ); 
                $('#open-file-modal').closeModal();
                $('.button-collapse').sideNav('hide');
            }

            reader.readAsText(file);    
        } else {
            myCodeMirror.setValue("File Not Supported!!!");
        }
    });

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, FileSystemSuccess, fail);

    /*
    $('#save-file-modal-yes').click(function(){
        console.log("Save button Clicked")
        var filename = document.getElementById('save-file-name').value;
        //var directory = document.getElementById('save-file-dir').value;
        window.resolveLocalFileSystemURL("file:///storage/emulated/0/Files/", function(dir) {
            console.log("got main dir",dir);
            dir.getFile(filename + ".txt", {create:true}, function(file) {
                console.log("got the file", file);
                logOb = file;
                var fileContent = myCodeMirror.getValue();
                writeLog(fileContent);            
            });
        });
    });
    */

    var saveFileButton = document.getElementById("save-file-modal-yes");

    newFileButton.addEventListener('click', function(e){
        console.log("Save button Clicked")
        var filename = document.getElementById('save-file-name').value;
        //var directory = document.getElementById('save-file-dir').value;
        window.resolveLocalFileSystemURL("file:///storage/emulated/0/Files/", function(dir) {
            console.log("got main dir",dir);
            dir.getFile(filename + ".txt", {create:true}, function(file) {
                console.log("got the file", file);
                logOb = file;
                var fileContent = myCodeMirror.getValue();
                writeLog(fileContent);            
            });
        });
    });
});

function changeSize() {
    var bodyheight = $(window).height();
    $("#editor").height(bodyheight - 101);
    $(".CodeMirror").height(bodyheight - 101);
    $(".CodeMirror-gutters").height(bodyheight - 101);
    $(window).resize(function () {
        var bodyheight = $(window).height();
        $("#editor").height(bodyheight - 101);
        $(".CodeMirror").height(bodyheight - 101);
        $(".CodeMirror-gutters").height(bodyheight - 101);
    });
}

$('#find-all-modal-findall').on("click", function(){
        toast("Not Yet Supported!", 4000 );
    });
    $('#replace-modal-replaceall').on("click", function(){
        toast("Not Yet Supported!", 4000 );
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
        toast('File Saved!', 4000 ); 
    }, fail);
}

function FileSystemSuccess(fileSystem) {
    console.log("Got the filesystem!");
}

function fail(e) {
    console.log("FileSystem Error");
    console.dir(e);
    console.log(e.code);
    toast('Something Went Wrong D:', 4000 ); 
}

