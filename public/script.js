const socket = io();
let username = prompt("Enter your name:") || "Anonymous";
socket.emit("join", username);

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const usersList = document.getElementById("users");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat message", function(data) {
  const item = document.createElement("li");
  item.textContent = `${data.user}: ${data.msg}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("userList", function(users) {
  usersList.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user;
    usersList.appendChild(li);
  });
});
