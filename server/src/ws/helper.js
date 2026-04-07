import mongoose from "mongoose";
import WebSocket from "ws";

//matchId -> key Set -> value
const matchSubscribers = new Map();

export function sendJson(socket, payload){
    if(socket.readyState !== WebSocket.OPEN) return ;
    socket.send(JSON.stringify(payload));
}

export function subscribe(matchId, socket){
    const key = matchId.toString(); // Convert to string for consistent key format
    
    if(!matchSubscribers.has(key)){
        matchSubscribers.set(key, new Set());
    }
    
    matchSubscribers.get(key).add(socket);
    socket.subscriptions.add(key);
}

export function unsubscribe(matchId, socket){
    const key = matchId.toString();
    const subscribers = matchSubscribers.get(key);
    if(!subscribers) return ;

    subscribers.delete(socket);
    socket.subscriptions.delete(key);

    if(subscribers.size === 0) matchSubscribers.delete(key);
}

export function broadcastMatch(matchId, payload){
    const key = matchId.toString();
    
    const subscribers = matchSubscribers.get(key);

    if(!subscribers || subscribers.size === 0) return ;

    for(const client of subscribers){
        sendJson(client, payload);
    }
}

export function broadcastToAll(wss, payload){
    for(const client of wss.clients){
        sendJson(client, payload);
    }
}
export function cleanUp(socket){
    if(!socket.subscriptions) return;
    for(const matchId of [...socket.subscriptions]){
        unsubscribe(matchId, socket);
    }
}

export function handleMessage(socket, payload){
    try{
        const data = payload.toString(); //Buffer -> String
        const message = JSON.parse(data); //String -> JSON

        if(message && message.type === "subscribe" && mongoose.Types.ObjectId.isValid(message?.matchId)){
            subscribe(message.matchId, socket);
            sendJson(socket, {type: "subscribed", payload: { matchId: message.matchId }});
        }

        else if(message?.type === "unsubscribe" && mongoose.Types.ObjectId.isValid(message?.matchId)){
            unsubscribe(message.matchId, socket);
            sendJson(socket, {type: "unsubscribed", payload: { matchId: message.matchId }});   
        }

    }catch(err){
        sendJson(socket, {type: "error", payload: {message: "Invalid JSON "}})
    }

}


