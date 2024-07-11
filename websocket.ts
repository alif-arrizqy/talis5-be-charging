// src/websocket.ts
import { WebSocketServer } from "ws";

// Mengatur server WebSocket di port 3888
const wss = new WebSocketServer({ port: 3888 });

// Data monitoring yang dinamis
let monitoringData = {
  cpuUsage: 0,
  memoryUsage: 0,
  status: true,
};

// Fungsi untuk mengupdate data monitoring secara berkala
const updateMonitoringData = () => {
  monitoringData.cpuUsage = Math.random() * 100; // Simulasi penggunaan CPU
  monitoringData.memoryUsage = Math.random() * 100; // Simulasi penggunaan Memori
  monitoringData.status = Math.random() < 0.1 ? false : true; // Simulasi status server
};

// Mengirim data monitoring ke semua klien yang terhubung
const broadcastMonitoringData = () => {
  const data = JSON.stringify(monitoringData);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      console.log(data);
      client.send(data);
    }
  });
};

// Update dan kirim data monitoring setiap 5 detik
setInterval(() => {
  updateMonitoringData();
  broadcastMonitoringData();
}, 5000);

wss.on("connection", (ws) => {
  console.log("WebSocket Client connected");
  ws.on("message", (message) => {
    console.log(`Received message from client: ${message}`);
  });

  // Kirim data monitoring terbaru saat klien baru terhubung
  ws.send(JSON.stringify(monitoringData));

  ws.on("close", () => {
    console.log("WebSocket Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:3888");
