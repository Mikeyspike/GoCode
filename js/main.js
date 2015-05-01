$(document).ready(function () {
    /*Initial javascript set up*/
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
    /*Initialise materialize functions*/
    $('.modal-trigger').leanModal();
    $('select').material_select();
    $('.button-collapse').sideNav({menuWidth: 240, activationWidth: 100});

    /*This is the initial save fuinction that is ran once the user touches the save button in the save file modal.
    This should save the file in the app's local directory, however this area may not be accessable without root device access.
    Code references: 
    http://docs.phonegap.com/en/edge/cordova_file_file.md.html
    http://www.w3.org/TR/2012/WD-file-system-api-20120417/
    https://gist.github.com/deedubbu/1590941
    */
    var saveFileButton = document.getElementById("save-file-modal-yes");
    saveFileButton.addEventListener('click', function(e){
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, FileSystemSuccess, fail);
        console.log("app Local Storage = " + cordova.file.applicationStorageDirectory);
        console.log("Save button Clicked");
        var filename = document.getElementById('save-file-name').value;
        var dirName = document.getElementById('save-file-dir').value;
        var saveDir = cordova.file.applicationStorageDirectory;
        console.log("Saving to "+saveDir);
        window.resolveLocalFileSystemURL(saveDir, function(dir) {
            console.log("got main dir",dir);
            dir.getFile(filename + ".txt", {create:true}, function(file) {
                console.log("got the file", file);
                logOb = file;
                var fileContent = myCodeMirror.getValue();
                writeLog(fileContent);            
            });
        }, function(e){
            fail(e);
        });
    });

    /*New file function, this simply sets the value of the editor to nothing.*/
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

    /*File open function
    Code obtained from: http://www.raymondcamden.com/2014/07/15/Cordova-Sample-Reading-a-text-file
    */
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
            $('#open-file-modal').closeModal();
            $('.button-collapse').sideNav('hide');
        };
    });

    /*These two functions are ready made CodeMirror methods.*/
    $('#find').on("click", function(){
        myCodeMirror.execCommand("find");
    });
    $('#replace').on("click", function(){
        myCodeMirror.execCommand("replace");
    });

    /*The code below simply gets the information from the Select/Option input from the HTML file, 
    and displayes the selected value inside the editor */
    var templateadd = document.getElementById('templates-modal-add');
    var templatenew = document.getElementById('templates-modal-new');
    var selectedTemplate = document.getElementById('templates-modal-select').value;
    $('#templates-modal-select').on('change', function () {
        selectedTemplate = $("#templates-modal-select").val();
    });
    templateadd.addEventListener('click', function(e){
        myCodeMirror.replaceSelection(selectedTemplate);
    });
    templatenew.addEventListener('click', function(e){
        myCodeMirror.setValue(selectedTemplate);
    });
    
});

/*
The code below will change the size of the editor to fit the size of the screen that is not taken up by the top and bottom bar.
This function is called once when the document loads, and then every time the window resizes. 
it will also change the size if the user changes orientation.
*/
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

/*These three functions are apart of the save file function
Code references: 
    http://docs.phonegap.com/en/edge/cordova_file_file.md.html
    http://www.w3.org/TR/2012/WD-file-system-api-20120417/
    https://gist.github.com/deedubbu/1590941
*/
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
    //console.log(fileSystem.name);
    //console.log(fileSystem.root.name);
    //console.log(fileSystem.root.fullPath);
    console.log("Got the filesystem!");
}

function fail(e) {
    console.log("FileSystem Error");
    console.dir(e);
    console.log(e.code);
    toast('Something Went Wrong D:', 4000 ); 
}

