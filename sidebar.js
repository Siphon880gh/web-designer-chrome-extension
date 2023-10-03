document.querySelector("#chose-bootstrap").addEventListener("click", async function() {
    let swapWith = "<div>Bootstrap</div>";

    console.log("Swapping to:")
    console.log(swapWith)
    
    let swapModeWrapper = await chrome.storage.local.get('swapMode');
    let swapMode = swapModeWrapper?.swapMode;
    if(!swapMode) swapMode = "outerHTML"; // default

    /* Will abandon for a background.js approach */
    chrome.runtime.sendMessage({type:"swapHTML", data: swapWith, swapMode})
});