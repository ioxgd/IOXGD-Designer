$(function() {
    $("#get-it-btn").click(async function() {
        let result = await dialog.showSaveDialog({
            filters: [{ 
                name: 'Arduino', 
                extensions: ['ino'] 
            }, { 
                name: 'C', 
                extensions: ['c'] 
            }, { 
                name: 'C++', 
                extensions: ['cpp'] 
            }]
        });

        if (result.canceled) {
            return;
        }

        let filePath = result.filePath;

        let codeGen = await buildComponentsGetCode();
        codeGen.content = codeGen.content.replace(/\n/g, "\n  ");
        codeGen.content = codeGen.content.trim();

        let fontCode = await buildFontSaveFileGetCode(path.dirname(filePath), (msg) => {
            $("#status").text(msg);
        }, true);

        let codePage = "";
        codePage += "/* ======== Generate by IOXGD Designer ======== */\n";
        codePage += "\n";
        if (fontCode.length > 0) {
            codePage += fontCode;
            codePage += "\n";
        }
        if (codeGen.header.length > 0) {
            codePage += codeGen.header;
            codePage += "\n";
        }
        codePage += "void load_page() {\n";
        codePage += `  ${codeGen.content}\n`;
        codePage += "}\n";

        console.log(codePage);

        return fs.writeFile(filePath, codePage, () => {
            $("#status").text(`Save code to ${filePath}`);
        });
    });
});