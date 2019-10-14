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
        codeGen = codeGen.replace(/\n/g, "\n  ");
        codeGen = codeGen.trim();

        let codePage = "";
        codePage += "/* ======== Generate by IOXGD Designer ======== */\n";
        codePage += "\n";
        codePage += "void load_page() {\n";
        codePage += `  ${codeGen}\n`;
        codePage += "}\n";

        console.log(codePage);

        return fs.writeFile(filePath, codePage, () => {
            $("#status").text(`Save code to ${filePath}`);
        });
    });
});