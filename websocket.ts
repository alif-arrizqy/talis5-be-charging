// src/websocket.ts
import { WebSocketServer } from "ws";

// create connection websocket
export default class WebSocketConn {
  private static instance: WebSocketConn;
  public wss: WebSocketServer;

  constructor() {
    this.wss = new WebSocketServer({ port: 3888 });
    console.log("WebSocket Client connected");

    this.wss.on("connection", (ws) => {
      ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
      });
    });
  }

  public static getInstance(): WebSocketConn {
    if (!WebSocketConn.instance) {
      WebSocketConn.instance = new WebSocketConn();
    }
    return WebSocketConn.instance;
  }
}
