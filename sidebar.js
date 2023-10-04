const buttons = document.querySelectorAll('button.where-to');
buttons.forEach(button => {
  button.addEventListener('click', (ev) => {
    buttons.forEach(btn => btn.classList.remove('active'));
    ev.target.classList.add('active');
  });
});

document.querySelector("#chose-bootstrap").addEventListener("click", async function() {
    let swapWith = "<div>Bootstrap</div>";

    console.log("Swapping to:")
    console.log(swapWith)
    
    let swapModeWrapper = await chrome.storage.local.get('swapMode');
    let swapMode = swapModeWrapper?.swapMode;
    if(!swapMode) swapMode = "outerHTML"; // default

    /* Will abandon for a background.js approach */
    // swapMode is innerHTML or outerHTML
    // insertMode is swapping element, prepending body, or appending body
    let insertMode = document.querySelector('button.active').dataset.value;
    console.log({insertMode})
    chrome.runtime.sendMessage({type:"swapHTML", data: swapWith, swapMode, insertMode})
});