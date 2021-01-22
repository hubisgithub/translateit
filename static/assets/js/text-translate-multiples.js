var langs = ["en", "ge", "fr", "it", "es", "po", "ja", "ru", "zh", "ar"];
var open_file_name = "No File Selected.csv";
var source_lang = "UNKNOWN";
var save_file_name = "No File Selected.csv";

function openSourceFile(e) {
    var file_name = e.files[0].name;
    open_file_name = file_name;
    var node = e.parentElement.parentElement.getElementsByTagName("textarea")[0];
    if (file_name.endsWith(".csv")) {
        var language = file_name.substr(file_name.lastIndexOf("_") + 1, 2);
        if (langs.includes(language)) {
            //Only in case of source file open
            if (e.id === 'destinationCustomFile') source_lang = language;

            var reader = new FileReader();
            reader.onload = function () {
                var text = reader.result;

                if (language === "ar") {
                    node.setAttribute("dir", "rtl");
                } else {
                    node.setAttribute("dir", "ltl");
                }
                node.value = text;

            };
            reader.readAsText(e.files[0]);

        } else {
            alert("No compatible language found.")
        }
    } else {
        alert("Unknown File Type");
    }

}

function download(e) {
    if (e.id === 'saveDestCsv') {
        save_file_name = open_file_name;
    } else {
        var sel = e.parentElement.getElementsByTagName("select")[0];
        if (sel.value !== 'null') {
            save_file_name = open_file_name.replace(open_file_name.substr(open_file_name.lastIndexOf("_"), 3), "_" + sel.value)
        } else {
            alert("Please Select Destination Language");
            return;
        }
    }

    var node = e.parentElement.parentElement.getElementsByTagName("textarea")[0];
    var textToWrite = node.value;
    var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain;charset=utf-8;'});

    var downloadLink = document.createElement("a");
    downloadLink.download = save_file_name;
    downloadLink.innerHTML = "Download " + save_file_name;
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();

}

function addLanguage() {
    var container = document.getElementById("dests");
    var newChild = container.children[container.childElementCount - 1].cloneNode(true);
    container.appendChild(newChild);
}


function removeLanguage(e) {
    var container = document.getElementById("dests");
    container.removeChild(e.parentElement);

}

function destLangChange(e) {
    var node = e.parentElement.getElementsByTagName("textarea")[0];
    if (e.value === "ar") {
        node.setAttribute("dir", "rtl");
    } else {
        node.setAttribute("dir", "ltl");
    }
}

function tnslt(e) {
    var sel = e.parentElement.getElementsByTagName('select')[0];
    if (sel.value !== "null") {
        //Translate
        if (source_lang !== undefined) {
            translate(source_lang, sel.value, document.getElementById("multipleSourceTextarea").value, e.parentElement.getElementsByTagName('textarea')[0]);
        } else {
            alert("Source Language is not detected, please open a file in source to detect source language")
        }
    } else {
        alert("Please select destination language");
    }
}


function translate(from, to, content, node) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/translate", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    try {
        xhr.send(JSON.stringify({
            'source_lang': from,
            'dest_lang': to,
            'content': content

        }));
    } catch (e) {
        alert("There were an error.");
    }
    xhr.onload = function () {
        var data = JSON.parse(this.responseText);
        node.value = data.result;
    }

    xhr.onerror = function () {
        alert("There were an error.");

    }
}
