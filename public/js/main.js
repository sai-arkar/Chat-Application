let socket = io();

const chatMessages = document.querySelector(".chat-messages");

const senderId = document.getElementById("senderId").value;
const rId = document.getElementById("receiverId").value;


// Add Users
socket.emit("addUser", senderId);

// Get Users
socket.on("getusers", (users)=>{
    console.log(users);
})

const postChat = (btn)=>{
    const message = document.getElementById("msg").value;

    fetch('/conversation/chat/', {
         method: 'POST',
         body: JSON.stringify({
             receiverId: rId,
             text: message
         }),
         headers: {
             "Content-Type": "application/json",
             "Accept": "application/json"
         }
    })
    .then(data=>{
         return data.json();
    })
    .then((result)=>{
        
        socket.emit("sendMessage", {
            senderId: senderId,
            receiverId: rId,
            text: message
        })

        document.getElementById("msg").value = "";
        document.getElementById("msg").focus();
        console.log(result);

    })
    .catch(err=>{
        console.log(err);
    })
}

// Get Message From Server
socket.on("getMessage", ({ senderId, text})=>{
    console.log(senderId, text);
    outputMessage({senderId, text});
    document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight;
})

function outputMessage({senderId, text}){
    const li = document.createElement("li");
    li.classList.add("clearfix");
    li.innerHTML = `
         <div class="message-data text-right">
              <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar">
         </div>
         <div class="message other-message float-right">${text}</div>
    `;
    document.querySelector(".chat-messages").appendChild(li);
}