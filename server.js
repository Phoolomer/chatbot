const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

let users = {};

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Save user
    socket.on("join", (username) => {
        users[socket.id] = username;
        io.emit("userList", Object.values(users));
        io.emit("chat message", { user: "System", msg: `${username} joined the chat` });
    });

    // Handle message
    socket.on("chat message", (msg) => {
        const user = users[socket.id] || "Anonymous";
        io.emit("chat message", { user, msg });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        const user = users[socket.id];
        delete users[socket.id];
        io.emit("userList", Object.values(users));
        if (user) {
            io.emit("chat message", { user: "System", msg: `${user} left the chat` });
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
