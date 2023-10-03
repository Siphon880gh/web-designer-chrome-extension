alert("panel.js loaded")


// let port = chrome.runtime.connect({name: "devtools-panel"});

// port.onMessage.addListener(function(message) {
//     // Handle the message from devtools.js
//     console.log(message);
// });

function fakeAlert() {
    alert("panel.js loaded - from devTools")
}

window.fakeAlert = fakeAlert;

// Example: Send a message to devtools.js
// port.postMessage({from: "panel", message: "Hello from panel.js!"});

// chrome.runtime.onMessage.addListener((msg) => {
//     if(msg.type === 'updateResultText') {
//       document.querySelector("#selected-html").textContent = msg.data; 
//       alert("Hey from content.js");
//     }
//   });