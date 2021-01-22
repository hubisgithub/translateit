var langs = ["en", "ge", "fr", "it", "es", "po", "ja", "ru", "zh", "ar"];
var open_file_name = "No File Selected.csv";
var source_lang;
var save_file_name = "No File Selected.csv";

function openSourceFile(e) {
    var file_name = e.files[0].name;
    open_file_name = file_name;
    var node = e.parentElement.parentElement.getElementsByTagName("textarea")[0];
    if (file_name.endsWith(".csv")) {
        var language = file_name.substr(file_name.lastIndexOf("_") + 1, 2);
        if (langs.includes(language)) {
            source_lang = language;
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
    //Calculate save file nae
    if (e.id === 'saveSourceCsv') {
        //save_file_name = open_file_name.replace(open_file_name.substr(open_file_name.lastIndexOf("_"), 3), "_"+source_lang)
        save_file_name = open_file_name;
    } else if (e.id === 'saveDestCsv') {
        var sel = document.getElementById("destLangSelect");
        if (sel.value !== "null") {
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

function destLangChange(e) {
    var node = document.getElementById("destinationTextarea");
    if (e.value === "ar") {
        node.setAttribute("dir", "rtl");
    } else {
        node.setAttribute("dir", "ltl");
    }
}


function translate(from, to, content, place_into_id) {
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
        document.getElementById(place_into_id).value = data.result;
    }

    xhr.onerror = function () {
        alert("There were an error.");

    }
}

document.body.onload = function (e) {
    document.getElementById("translateBtn").onclick = function (e) {
        var sel = document.getElementById("destLangSelect");
        if (sel.value !== "null" || source_lang == undefined) {
            //Translate
            if (source_lang !== undefined) {
                translate(source_lang, sel.value, document.getElementById("sourceTextarea").value, "destinationTextarea");
            } else {
                alert("Source Language is not detected, please open a file in source to detect source language")
            }

        } else {
            alert("Please select destination language");
        }
    }

}


