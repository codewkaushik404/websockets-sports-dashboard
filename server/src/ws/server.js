import { WebSocketServer, WebSocket } from "ws";
import { wsArcjet } from "../../arcjet";

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
    wss.on("connection", async function(socket, req){

        if(!wsArcjet){
            socket.close(1011, "Internal Server Error");
            return ;
        }

        const decision = await wsArcjet.protect(req);
        if(decision.isDenied()){
            //1013 - The server is temporarily unable to handle the request.
            //1008 — Policy Violation Used for auth/permission errors
            const object = decision.reason.isRateLimit() 
                            ? {code: 1013, reason: "Too many requests"} 
                            : {code: 1008, reason: "Forbidden"} ;
            socket.close(object.code, object.reason);
            return ;
        }
        
        sendJson(socket, {type: "welcome", payload: {data: "Connection established" }});
        socket.isAlive = true;
    
        socket.on("error", (err) => console.error(err));

        //this event handler will run after the connections is closed, 
        // so u cant send anything to client in this handler
        socket.on("close", (code, reason) => {
            console.log({ message: "User disconnected", payload: {code, reason} });
        });

        socket.on("pong", () => socket.isAlive = true);
    })

    let interval = setInterval(()=>{
        //Heart-beat (ping-pong) mechanism for detecting dead connections. It runs every 30s
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
