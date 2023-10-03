console.log("Loaded content.js")

/* Will abandon for a background.js approach */
chrome.runtime.onMessage.addListener((msg) => {
    if(msg.type === 'swapHTML') {
      alert("Swapping html");
    }
});