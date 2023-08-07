const socket = io.connect();

socket.on("connected_clients", (clients) => {
  const clientsList = document.getElementById("clients");
  clientsList.innerHTML = "";
  clients.forEach((client) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Client ID: ${client}`;
    clientsList.appendChild(listItem);
  });
});
