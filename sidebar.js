document.querySelector("#chose-bootstrap").addEventListener("click", function() {
    localStorage.setItem("swapWith", "bootstrap");
});

setInterval(()=>{
    var swapWith = localStorage.getItem("swapWith");
    if(swapWith) {
        console.log("Swapping to:")
        console.log(swapWith);
        localStorage.removeItem("swapWith");
        
        /* Will abandon for a background.js approach */
        chrome.runtime.sendMessage({type:"swapHTML", data: swapWith})
    }
}, 500)