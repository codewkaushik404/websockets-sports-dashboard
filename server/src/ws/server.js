import { WebSocketServer, WebSocket } from "ws";
import { wsArcjet } from "../../arcjet.js";
import { sendJson, broadcastToAll, handleMessage, cleanUp, broadcastMatch } from "./helper.js";

export function createWebSocketServer(server){
    //1MB - 1024*1024
    const wss = new WebSocketServer({noServer: true, path: "/ws", maxPayload: 1024*1024 });

    //Here we are still in HTTP so thats why socket.write and .destroy() no ws connection has been made so far
    server.on("upgrade", async (req, socket, head) => {
        const {pathname} = new URL(req.url, `http://${req.headers.host}`);
        
        if(pathname !== "/ws"){
            socket.write("HTTP/1.1 404 Invalid path\r\n\r\n");
            socket.destroy();
            return ;
        }

        try{
            if(!wsArcjet){
                socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
                socket.destroy();
                return ;
            }

            const decision = await wsArcjet.protect(req);
            if(decision.isDenied()){
                //1013 - The server is temporarily unable to handle the request.
                //1008 — Policy Violation Used for auth/permission errors
                if(decision.reason.isRateLimit()) socket.write('HTTP/1.1 429 Too many requests \r\n\r\n');
                else socket.write('HTTP/1.1 403 Forbidden \r\n\r\n');
                socket.destroy();
                return ;
            }
        }catch(err){
            socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
            socket.destroy();
            return;
        }

        wss.handleUpgrade(req, socket, head, (ws)=>{
            wss.emit("connection", ws, req);
        })
    })

    wss.on("connection", async function(socket, req){
    
        sendJson(socket, {type: "welcome", payload: {data: "Connection established" }});
        socket.isAlive = true;
        socket.subscriptions = new Set();
    
        socket.on("error", (err) => {
            console.error(err)
            socket.terminate();
        });

        //this event handler will run after the connections is closed, 
        // so u cant send anything to client in this handler
        socket.on("close", (code, reason) => {
            cleanUp(socket);
            console.log({ message: "User disconnected", payload: {code, reason} });
        });

        socket.on("pong", () => socket.isAlive = true);
        socket.on("message", (data)=>{
            handleMessage(socket, data);
        })
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
        broadcastToAll(wss, {type: "match_created", payload: {data: match}})
    }

    function broadcastCommentary(matchId, commentary){
        broadcastMatch(matchId, {type: "commentary", payload: {data: commentary }});
    }

    return { broadcastMatchCreated, broadcastCommentary };
}
