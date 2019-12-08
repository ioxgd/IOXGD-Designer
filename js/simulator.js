let simulator_run = () => {
    simulator.run();
    $("#status").text("Run simulator");
}

let simulator_bulid = async () => {
    let fontCode = await buildFontSaveFileGetCode(simulator.fontdir, (msg) => {
        $("#status").text(msg);
    });
    let code = await buildComponentsGetCode();

    await simulator.writeCode(code.content, `${fontCode}\n${code.header}`);

    await simulator.compile((msg) => {
        $("#status").text(msg);
    });

    $("#status").text("Bulid simulator");
}

let simulator_clean = async () => {
    await simulator.clean();
    $("#status").text("Clean simulator");
}

let simulator_stop = () => {
    try {
        execFileSync("taskkill", ["/IM", simulator.outputFile, "/F"]);
    } catch(err) {

    }
    $("#status").text("Stop simulator");
};

let simulator_bulid_and_run = async () => {
    simulator_stop();
    await simulator_bulid();
    simulator_run();
}

$(function() {
    $("#simulator-btn").click(simulator_bulid_and_run);
});
