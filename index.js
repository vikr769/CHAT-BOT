const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatBox = document.querySelector(".chatbox");
const chatBotToggler = document.querySelector(".chatbot-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "ADD API KEY HERE (OPEN AI API)"
// const inputHeight = chatInput.computedStyleMap.scrollHeight;
const inputHeight = chatInput.scrollHeight;


const createChatLi = (message,className) =>{
    const chatLi =document.createElement("Li");
    chatLi.classList.add("chat",className)
    let chatContent = className === 'outgoing' ? 
    `<P></P>` :
    `
    <span class="fa-solid fa-robot"></span>
    <p></p>
    `
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse =(incomingChatLi) =>{
    const API_URL="https://api.openai.com/v1/chat/completions"
    const messageElement= incomingChatLi.querySelector("p");
    const requestOption ={
        method : "post",
        headers :{
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${API_KEY}`
        },
        body :JSON.stringify({

           "model": "gpt-3.5-turbo",
        // "model": "gpt-4",
           "messages": [
             {
                "role":"user",
                "content": userMessage
             }
           ]

        })
    }
    // API_URL
    fetch(API_URL,requestOption)
    .then((res=>res.json()))
    // .then((data)=>{
    //     messageElement.textContent = data.choices[0].message.content;
    // })

    .then((data) => {
  if (data.choices && data.choices.length > 0) {
    messageElement.textContent = data.choices[0].message.content;
  } else {
    messageElement.classList.add("error");
    messageElement.textContent = data.error?.message || "Unexpected API response";
  }
})

    .catch((error)=>{
        messageElement.classList.add("error");
        messageElement.textContent = "Opps ! Something went wrong. please try again."
    })
    .finally(()=>chatBox.scrollTo(0,chatBox.scrollHeight));
}

const handleChat = () =>{
    userMessage=chatInput.value;
    if(!userMessage) return;
    chatInput.value = "";
    chatBox.append(createChatLi(userMessage,'outgoing'))
    chatBox.scrollTo(0,chatBox.scrollHeight);
    setTimeout(()=> {
       const incomingChatLi = createChatLi('Thinking...','incoming');
       chatBox.append(incomingChatLi);
       chatBox.scrollTo(0,chatBox.scrollHeight);
       generateResponse(incomingChatLi);
    },600);
}

sendChatBtn.onclick= () =>{
    handleChat();
}

chatBotToggler.onclick = () =>{
    document.body.classList.toggle('show-chatbot');
}

chatBotCloseBtn.onclick = () =>{
    document.body.classList.remove('show-chatbot');
}

chatInput.oninput = () =>{
    // chatInput.computedStyleMap.height = `${inputHeight}px`;
    // chatInput.computedStyleMap.height = `${chatInput.scrollHeight}px`;

    chatInput.style.height = `${inputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;

}

chatInput.onkeydown = (e) =>{
   if(e.key=== "Enter" && !e.shiftKey  && window.innerWidth >800)
   {
    e.preventDefault();
    handleChat();
   }
}