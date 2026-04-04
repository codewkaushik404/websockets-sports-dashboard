import { WebSocketServer, WebSocket } from "ws";

function sendJson(socket, payload){
    if(socket.readyState !== WebSocket.OPEN) return ;
    socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload){
    for(const client of wss.clients){
        sendJson(client, payload);
    }
}

export function createWebSocketServer(server){
    //1MB - 1024*1024
    const wss = new WebSocketServer({server, path: "/ws", maxPayload: 1024*1024 });
    wss.on("connection", function(socket){
        socket.isAlive = true;
        sendJson(socket, {type: "welcome", payload: {data: "Connection established" }});

        socket.on("error", (err) => console.error(err));
        socket.on("close", () => console.log("User disconnected"));

        socket.on("pong", () => socket.isAlive = true);
    })

    let interval = setInterval(()=>{

        for(const client of wss.clients){
            if(client.isAlive === false) return client.terminate();
            client.isAlive = false;
            client.ping();
        }

    }, 30*1000);

    wss.on("close", ()=> clearInterval(interval));

    function broadcastMatchCreated(match){
        broadcast(wss, {type: "match_created", payload: {data: match}})
    }

    return { broadcastMatchCreated };
}
