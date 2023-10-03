document.querySelector("#chose-bootstrap").addEventListener("click", function() {
    let swapWith = "<div>Bootstrap</div>";

    console.log("Swapping to:")
    console.log(swapWith)
    
    let swapMode = app.getState.getSwapMode();
    if(!swapMode) swapMode = "outerHTML"; // default

    /* Will abandon for a background.js approach */
    chrome.runtime.sendMessage({type:"swapHTML", data: swapWith, swapMode})
});
