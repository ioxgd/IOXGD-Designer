const API_SERVER_PORT = 12123;

let sockets = [ ];
let socketsId = 1;

let stringifyData = (evant, data) => `evant: ${evant}\ndata: ${Buffer.from(data).toString('base64')}\n\n`;

let parseData = (data) => {
    try {
        let parse = /^evant: (.*)\ndata: (.*)\n\n$/gm.exec(data);
        return { evant: parse[1], data: Buffer.from(parse[2], 'base64').toString('utf-8') };
    } catch (err) {
        throw "data parse error";
    }
}

let apiBroadcast = (evant, data) => {
    for (let socket of sockets) {
        socket.write(stringifyData(evant, data));
    }
};

const server = net.createServer((socket) => {
    socket.id = socketsId;
    socketsId++;

    sockets.push(socket);

    // console.log(`New connection id ${socket.id}`);

    socket.on('data', function(chunk) {
        let rawdata = chunk.toString();
        // console.log(`Data received from client: ${rawdata}.`);
        let { evant, data } = parseData(rawdata);
        // console.log(evant, data);
        if (evant === "i-want-page-data") {
            socket.write(stringifyData("page-data-update", allPageToJson()));
        }
    });
    
    socket.on('close', function() {
        // console.log(`Closing connection id ${socket.id}`);
        let inx = sockets.findIndex((s) => s.id === socket.id);
        sockets.splice(inx, 1);
    });

    socket.on('error', function(err) {
        console.error(err);
    });

    // socket.write(stringifyData("page-data-update", allPageToJson()));
});

setTimeout(() => {
    server.listen(API_SERVER_PORT, () => {
        console.log(`API server bound at port ${API_SERVER_PORT}`);
    });
}, 1000);

