const http = require("http");
const app = require("./app");

const PORT = process.env.SRV_PORT || 3000;

// Server
const server = http.createServer(app);
server.listen(PORT, console.log(`Server is running on port ${PORT}`));
