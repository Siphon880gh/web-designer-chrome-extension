const buttons = document.querySelectorAll('button.where-to');
buttons.forEach(button => {
  button.addEventListener('click', (ev) => {
    buttons.forEach(btn => btn.classList.remove('active'));

    let currentTab = ev.target;
    if(!currentTab.matches("button")) {
        currentTab = currentTab.closest("button");
    }
    currentTab.classList.add('active');
  });
});


var tooltipHovers = document.querySelectorAll("[data-tooltip-target]");
tooltipHovers.forEach(tooltipHover=>{
    tooltipHover.addEventListener("mouseenter", function(ev) {
        var id = ev.target.getAttribute("data-tooltip-target");
        document.querySelector(`[data-tooltip-id=${id}]`).classList.add("active");
        console.log("hovered");
      });
    tooltipHover.addEventListener("mouseleave", function(ev) {
        var id = ev.target.getAttribute("data-tooltip-target");
        document.querySelector(`[data-tooltip-id=${id}]`).classList.remove("active");
        console.log("hovered");
    });
})
var tooltipCloses = document.querySelectorAll("[[data-tooltip-id]");
tooltipCloses.forEach(tooltipClose=>{
    tooltipClose.addEventListener("click", function(ev) {
        ev.target.classList.remove("active")
    });
})


document.querySelectorAll(".chose-bootstrap").forEach(chose=>{
        chose.addEventListener("click", async function() {
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
    })
})