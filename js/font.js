let listFont = [];

listFont.push({
    name: "Roboto_16",
    size: 16,
    range: "0x0020-0x007F",
    variable: "lv_font_roboto_16",
    file: "font/Roboto-Regular.ttf"
});

function previewShow(fontPath, size, text) {
    var f = new FontFace('previewFontFamily', `url('${fontPath.replace(/\\/g, '/')}')`);

    f.load().then(function() {
        document.fonts.add(f);

        // console.log("Load end");

        let c = document.createElement("canvas");
        c.width = 800;
        c.height = 480;
        var ctx = c.getContext("2d");

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, c.width, c.height);  
        
        ctx.fillStyle = "#000000";
        ctx.font = `${size}px previewFontFamily`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, c.width / 2, c.height / 2);

        $("#img-preview").attr("src", c.toDataURL("image/png"));
    });
}

let HexToUTF8 = (hex) => eval(`'${hex.replace("0x", "\\u")}'`);

function textFilter(text, range) {
    if (range.length > 0) {
        let regexStr = "";
        regexStr += "[^";
        let m;

        const regex = /((0x[0-9a-fA-F]{4})-(0x[0-9a-fA-F]{4})|(0x[0-9a-fA-F]{4}))/gm;
        while ((m = regex.exec(range)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            if (typeof m[2] !== "undefined" && typeof m[3] !== "undefined") {
                // console.log("Found %s-%s", m[2], m[3])
                regexStr += `${HexToUTF8(m[2])}-${HexToUTF8(m[3])}`;
            } else if (typeof m[4] !== "undefined") {
                // console.log("Found %s", m[4])
                regexStr += `${HexToUTF8(m[4])}`;
            }
            regexStr += "|";
        }
        regexStr = regexStr.substring(0, regexStr.length-1);
        regexStr += "]";

        // console.log(regexStr);

        text = text.replace(RegExp(regexStr, 'g'), '');
    } else {
        text = "";
    }

    return text;
}

function reanderPreviewFromAdd() {
    let filePath = $("#font-file")[0].files[0].path;
    let size = parseInt($("#font-size").val());
    let range = $("#font-char").val().trim();
    let text = $("#font-preview-text").val();

    text = textFilter(text, range);

    // console.log(filePath);
    previewShow(filePath, size, text);
}

function updateFontList() {
    let html = "";
    listFont.forEach(function(item, index) {
        html += `<li data-font-index="${index}">`;
        html += '<div class="text">';
        html += `<p class="name">${item.name}</p>`;

        if (typeof item.variable !== "undefined") {
            html += `<p class="alt">Variable: ${item.variable}</p>`;
        } else if (typeof item.file !== "undefined") {
            html += `<p class="alt">File: ${item.file}</p>`;
        }
        
        html += '</div>';
        if (typeof item.variable === "undefined") {
            html += `<div class="delete">`;
            html += '<i class="fas fa-trash"></i>';
            html += '</div>';
        }
        html += '</li>';
    });
    $("#font-list").html(html);

    $("#font-list > li").mouseenter(function() {
        let index = parseInt($(this).attr("data-font-index"));

        let font = listFont[index];
        let text = $("#font-preview-text").val();

        text = textFilter(text, font.range);
        previewShow(font.file, font.size, text);
    });

    $("#font-list > li .delete").click(function() {
        let index = parseInt($(this).parents("li").attr("data-font-index"));

        listFont.splice(index, 1);
        updateFontList();
    });
}

function updateFontInArray() {
    for (font of listFont) {
        document.fonts.add(new FontFace(font.name, `url('${font.file.replace(/\\/g, '\\\\')}')`));
    }
}

let getFontFromName = (name) => listFont.find((item) => item.name === name);

$(function() {
    $("#font-file").change(reanderPreviewFromAdd);
    $("#font-size, #font-preview-text, #font-char").keyup(reanderPreviewFromAdd);

    $(".help-box > span").click(function() {
        let nowRange = $("#font-char").val().trim();
        let addRange = $(this).attr("data-range");

        if (nowRange.indexOf(addRange) < 0) {
            if (!nowRange.endsWith(",") && nowRange.length != 0) {
                nowRange += ",";
            }
            nowRange += addRange;
            $("#font-char").val(nowRange).keyup();
        }
    });

    $("#font-add-form").submit(function(e) { 
        e.preventDefault();

        if ($("#font-file")[0].files.length == 0) {
            dialog.showErrorBox('Oops! Something went wrong!', '.ttf/.woff file not select')
            return;
        }

        if (parseInt($("#font-size").val()) <= 0) {
            dialog.showErrorBox('Oops! Something went wrong!', 'please enter font size more then 0')
            return;
        }

        if (!(/((0x[0-9a-fA-F]{4})-(0x[0-9a-fA-F]{4})|(0x[0-9a-fA-F]{4}))/gm.test($("#font-char").val().trim()))) {
            dialog.showErrorBox('Oops! Something went wrong!', 'Range not validation')
            return;
        }
        
        let file = $("#font-file")[0].files[0].path;
        let size = parseInt($("#font-size").val());
        let range = $("#font-char").val().trim();

        let name = `${$("#font-file")[0].files[0].name.replace(/\..*$/, '')}_${size}`;

        listFont.push({
            name,
            file,
            size,
            range
        });

        var f = new FontFace(name, `url('${file.replace(/\\/g, '\\\\')}')`);

        f.load().then(function() {
            document.fonts.add(f);
        });

        $("#text-add-status").text(`Add ${name} to font list.`).show();
        setTimeout(() => $("#text-add-status").fadeOut(1000), 3000);
        $("#font-add-form")[0].reset();
    });

    $(".tabs > li").click(function() {
        $(".box-manage > article").hide();
        $(`.box-manage > article[data-name='${$(this).attr("data-content")}']`).show();

        $(".tabs > li").removeClass("active");
        $(this).addClass("active");
        updateFontList();
    });
});