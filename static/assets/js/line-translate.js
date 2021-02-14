var langs = ["en", "ge", "fr", "it", "es", "po", "ja", "ru", "zh", "ar"];
var seps = {
    "en": ",",
    "ge": ',',
    "fr": ',',
    "it": ',',
    "es": ",",
    "po": ",",
    "ja": "、",
    "ru": ",",
    "zh": "，",
    "ar": "،"
};

var open_file_name = "No File Selected.csv";
var open_target_file_name = "";
var source_lang = "UNKNOWN";
var save_file_name = "No File Selected.csv";
var direction = "ltl";
var target_direction = "ltl";
var no_of_cols = 0;
var target_lang = '';
var sep = ',';


function get_sep(lang_code) {
    if (document.getElementById('wordByWord').checked === true) {
        return seps[lang_code];
    } else {
        return ",";
    }

}

function get_text_to_translate(includeAt, table_name) {
    var sep = ","
    if (includeAt === true) {
        sep = "@,"
    }
    no_of_cols = document.querySelectorAll("#source_table tr")[0].childElementCount;
    var tBody = document.getElementById(table_name).children[0];
    var textToWrite = create_first_line();
    for (var i = 0; i < tBody.childElementCount; i++) {
        var tr = tBody.children[i];
        for (var col = 0; col < no_of_cols; col++) {
            if (col === 0) {
                textToWrite += (i+1) + tr.children[col].firstChild.innerText + sep;
            } else {
                if (col === no_of_cols - 1) {
                    textToWrite += tBody.children[i].children[col].firstChild.value;
                } else {
                    textToWrite += tBody.children[i].children[col].firstChild.value + sep;
                }

            }

        }
        textToWrite += "\n";

    }
    return textToWrite;
}




function get_text_to_translate_submission(includeAt, table_name) {
    var sep = ","
    if (includeAt === true) {
        sep = "@,"
    }
    no_of_cols = document.querySelectorAll("#source_table tr")[0].childElementCount;
    var tBody = document.getElementById(table_name).children[0];
    //var textToWrite = create_first_line();
    var textToWrite = '';
    for (var i = 0; i < tBody.childElementCount; i++) {
        var tr = tBody.children[i];
        for (var col = 0; col < no_of_cols; col++) {
            if (col === 0) {
                //textToWrite += (i+1) + tr.children[col].firstChild.innerText + sep;
            } else {
                if (col === no_of_cols - 1) {
                    textToWrite += tBody.children[i].children[col].firstChild.value;
                } else {
                    textToWrite += tBody.children[i].children[col].firstChild.value + sep;
                }

            }
        }

        textToWrite += "\n";
    }
    return textToWrite;
}

function openTargetFile(e) {
    var file_name = e.files[0].name;

    open_target_file_name = file_name;
    if (file_name.endsWith(".csv")) {
        var language = file_name.substr(file_name.lastIndexOf("_") + 1, 2);
        if (langs.includes(language)) {
            var reader = new FileReader();
            reader.onload = function () {
                var text = reader.result;

                if (language === "ar") direction = "rtl";
                var tBody = document.getElementById("target_table").children[0];
                tBody.innerHTML = '';
                var lines = text.split('\n');
                no_of_cols = lines[0].split(',').length;
                for (var line = 1; line < lines.length - 1; line++) {
                    tBody.appendChild(createNewRow(no_of_cols, lines[line], tBody, language, "direction", "targettd", "targettext", ","));
                }
            };
            reader.readAsText(e.files[0]);
        } else {
            alert("No compatible language found.")
        }
    } else {
        alert("Unknown File Type");
    }
}


function openSourceFile(e) {
    var file_name = e.files[0].name;
    open_file_name = file_name;
    if (file_name.endsWith(".csv")) {
        var language = file_name.substr(file_name.lastIndexOf("_") + 1, 2);
        if (langs.includes(language)) {
            //Only in case of source file open
            if (e.id === 'destinationCustomFile') {
                source_lang = language;
                document.getElementById("detectedLangSpan").innerText = source_lang
            }

            var reader = new FileReader();
            reader.onload = function () {
                var text = reader.result;

                if (language === "ar") direction = "rtl";
                var tBody = document.getElementById("source_table").children[0];
                tBody.innerHTML = '';
                var lines = text.split('\n');
                no_of_cols = lines[0].split(',').length;
                for (var line = 1; line < lines.length - 1; line++) {
                    tBody.appendChild(createNewRow(no_of_cols, lines[line], tBody, source_lang, direction, undefined, undefined, ","));
                }
                document.getElementById("addRowBtn").removeAttribute("disabled");
            };
            reader.readAsText(e.files[0]);
        } else {
            alert("No compatible language found.")
        }
    } else {
        alert("Unknown File Type");
    }
}

function createNewRow(no_of_cols, line, tBody, language, new_dir, td_class, text_class, spltr) {
    if (td_class === null || td_class === undefined) td_class = 'sourcetd';
    if (text_class === null || text_class === undefined) text_class = 'sourcetext';
    var tr = document.createElement("tr");
    var splitter = spltr;

    for (var col = 0; col < no_of_cols; col++) {
        var td = document.createElement("td");
        td.setAttribute("scope", "row");
        td.setAttribute("class", td_class);

        var text = line.split(splitter)[col];
        if (text === undefined) text = '';
        if (col === 0) {
            var input = document.createElement("input");
            input.style.width = '30px';
            input.setAttribute("dir", new_dir);
            input.setAttribute("type", "text");

            if (text === '' || text === ' ') {
                text = tBody.childElementCount + 1;
            }

            input.value = text;
            //td.style.textAlign = "center";

        } else {
            var input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("class", text_class);
            input.setAttribute("dir", new_dir);
            input.value = text;
        }
        td.appendChild(input);
        tr.appendChild(td);
    }
    return tr;
}


function createNewRowWithNos(no_of_cols, line, tBody, language, new_dir, td_class, text_class, spltr) {
    if (td_class === null || td_class === undefined) td_class = 'sourcetd';
    if (text_class === null || text_class === undefined) text_class = 'sourcetext';
    var tr = document.createElement("tr");
    var splitter = spltr;

    for (var col = 0; col < no_of_cols; col++) {


        var text = line.split(splitter)[col];
        if (text === undefined) text = '';
        if (col === 0) {
            var td = document.createElement("td");
            td.setAttribute("scope", "row");
            td.setAttribute("class", td_class);

            var input = document.createElement("input");
            input.style.width = '30px';
            input.setAttribute("dir", new_dir);
            input.setAttribute("type", "text");

            input.value = tBody.childElementCount + 1;
            td.style.textAlign = "center";
            td.appendChild(input);
            tr.appendChild(td);

             var td2 = document.createElement("td");
            td2.setAttribute("scope", "row");
            td2.setAttribute("class", td_class);

            var input2 = document.createElement("input");
            input2.setAttribute("type", "text");
            input2.setAttribute("class", text_class);
            input2.setAttribute("dir", new_dir);
            input2.value = text;

            td2.appendChild(input2);
            tr.appendChild(td2);

        } else {

            var td = document.createElement("td");
            td.setAttribute("scope", "row");
            td.setAttribute("class", td_class);

            var input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("class", text_class);
            input.setAttribute("dir", new_dir);
            input.value = text;

            td.appendChild(input);
            tr.appendChild(td);
        }

    }
    return tr;
}

function addRowToSource(e) {
    var tBody = document.getElementById("source_table").children[0];
    var line = '';
    tBody.appendChild(createNewRow(no_of_cols, line, tBody, source_lang, direction, undefined, undefined, ","));
}

function create_first_line() {
    var first_line = "title_no,"
    for (var i = 1; i < no_of_cols; i++) {
        if (i === no_of_cols - 1) {
            first_line += "line_" + pad(i);
        } else {
            first_line += "line_" + pad(i) + ","
        }

    }
    return first_line + "\n";
}

function downloadSource(e) {

    if (open_file_name === "No File Selected.csv") {
        alert("No file opened yet, please open a file first");
        return;
    } else {
        var lang_code;
        var tb_name = '';
        if (e.id === "saveSourceCsv") {
            tb_name = "source_table";
            lang_code = open_file_name.substr(open_file_name.lastIndexOf("_") + 1, 2);
            save_file_name = open_file_name.replace(open_file_name.substr(open_file_name.lastIndexOf("_"), 3), "_" + lang_code)
        } else {
            if (open_target_file_name !== "") {
                //opened, use open target file name
                lang_code = open_target_file_name.substr(open_target_file_name.lastIndexOf("_") + 1, 2);
                save_file_name = open_target_file_name.replace(open_target_file_name.substr(open_target_file_name.lastIndexOf("_"), 3), "_" + lang_code)
            } else {
                tb_name = "target_table";
                no_of_cols = no_of_cols + 1;
                save_file_name = open_file_name.replace(open_file_name.substr(open_file_name.lastIndexOf("_"), 3), "_" + inlineFormCustomSelectPref.value)

            }
        }
        var textToWrite = get_text_to_translate(false, tb_name);
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
}

function tnslt(e) {
    var sel = document.getElementById('inlineFormCustomSelectPref');
    if (sel.value !== "null") {
        //Translate
        target_lang = sel.value;
        if (source_lang !== "UNKNOWN") {
            var includeAt;
            if (document.getElementById('wordByWord').checked === true) {
                includeAt = false;
            } else {
                includeAt = true;
            }
            translate(source_lang, target_lang, get_text_to_translate_submission(false, "source_table"));
        } else {
            alert("Source Language is not detected, please open a file in source to detect source language")
        }
    } else {
        alert("Please select target language");
    }
}

function translate(from, to, content) {
    open_target_file_name = "";
    var xhr = new XMLHttpRequest();
    var url;
    if (document.getElementById('wordByWord').checked === true) {
        url = "/translate_word";
    } else {
        url = "/translate_batch";
    }
    xhr.open("POST", url, true);
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
        var text = data.result;

        var target_table_body = document.getElementById("target_table").children[0];
        target_table_body.innerHTML = '';
        var lines = text.split('\n');
        var splitter = get_sep(target_lang);
        no_of_cols = lines[0].split(splitter).length;
        for (var line = 0; line < lines.length; line++) {
            target_table_body.appendChild(createNewRowWithNos(no_of_cols, lines[line], target_table_body, target_lang, target_direction, "targettd", "targettext", splitter, true));

        }

        var source_trs = document.querySelectorAll("#source_table tr");
        var target_ts = document.querySelectorAll("#target_table tr");

        var tabindex = 0;

        for (var i = 0; i < source_trs.length; i++) {
            var inputs = source_trs[i].getElementsByTagName('input');
            var j;
            for (j = 0; j < inputs.length; j++) {
                inputs[j].setAttribute("tabindex", String(tabindex + j));
                inputs[j].id = tabindex + j;
            }
            tabindex = Number(inputs[j - 1].id) + 1;
            var inputs = target_ts[i].getElementsByTagName('input');
            var k;
            for (k = 0; k < inputs.length; k++) {
                inputs[k].setAttribute("tabindex", String(tabindex + k));
                inputs[k].id = tabindex + k;

            }
            tabindex = Number(inputs[k - 1].id) + 1;
        }
    }

    xhr.onerror = function () {
        alert("There were an error translating.");
    }
}


function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}
function destLangChange(e) {
    var node = document.getElementById('inlineFormCustomSelectPref');
    if (node.value === "ar") {
        target_direction = "rtl";
    }
}
