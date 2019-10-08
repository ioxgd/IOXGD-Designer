const simulator = require("./simulator/compiler.js");
const { execFileSync } = require("child_process");

$(function() {
    $("#simulator-btn").click(async function(e) {
        let code = await buildComponentsGetCode();
        await simulator.writeCode(code);
        // simulator.clean();

        // Close
        try {
            execFileSync("taskkill", ["/IM", simulator.outputFile, "/F"]);
        } catch(err) {

        }
        
        await simulator.compile((msg) => {
            $("#status").text(msg);
        });
        simulator.run();
        $("#status").text("Run simulator");
    });
});
