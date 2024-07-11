import WebSocket from "ws";


const setup = () => {
	const ws = new WebSocket("ws://localhost:3888");

	let shouldReconnect = true;

	ws.on("open", () => {
		console.log("Connected to server");
		ws.send("Hello, server!");
	});

	ws.on("message", (message: string) => {
		// parse the message
		const data = JSON.parse(message);
		const { cpuUsage, memoryUsage, status } = data;
		if (status) {
			console.log(`CPU Usage: ${cpuUsage.toFixed(2)}%`);
			console.log(`Memory Usage: ${memoryUsage.toFixed(2)}%`);
			console.log(`Status: ${status}`);
		} else {
			// close the connection
			console.log("Status is false, closing connection...");
			ws.close();
		}
		// console.log(`Received message from server: ${message}`);
	});

	ws.on("close", () => {
		console.log("Disconnected from server");
		if (shouldReconnect) {
			setTimeout(setup, 3000); // Reconnect after 3 seconds
		}
	});

	ws.on("error", (error) => {
		console.error("WebSocket error:", error);
		ws.close(); // Ensure the 'close' event is triggered
	});
};

setup();