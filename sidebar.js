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
var tooltipCloses = document.querySelectorAll("[data-tooltip-id]");
tooltipCloses.forEach(tooltipClose=>{
    tooltipClose.addEventListener("click", function(ev) {
        ev.target.classList.remove("active")
    });
})

async function useTemplateClicked(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    let templateBtn = ev.target;
    if(!templateBtn.matches(".chose-template")) {
        templateBtn = templateBtn.closest(".chose-template");
    }

    let templateElm = templateBtn.parentNode.children[0].children[0]; // inner container of the template
    let swapWith = templateElm.outerHTML;

    console.log("Swapping to:")
    console.log(swapWith)
    
    let swapModeWrapper = await chrome.storage.local.get('swapMode');
    let swapMode = swapModeWrapper?.swapMode;
    if(!swapMode) swapMode = "outerHTML"; // default

    // swapMode is innerHTML or outerHTML
    // insertMode is swapping element, prepending body, or appending body
    let insertMode = document.querySelector('button.active').dataset.value;
    console.log({insertMode})

    chrome.runtime.sendMessage({type:"swapHTML", data: swapWith, swapMode, insertMode});
};

// load templates

function redrawTemplateList() {
        // Select all list items
        const liItems = document.querySelectorAll('li');
    
        liItems.forEach(li => {
            // Create a new details element
            const details = document.createElement('details');
    
            // Create a new summary element and set its content to the first child of the li (should be the text node)
            const summary = document.createElement('summary');
            summary.innerHTML = li.firstChild.textContent;
            details.appendChild(summary);
    
            // Move all children (except the first one, which is the text) of the li to the details
            Array.from(li.childNodes).slice(1).forEach(child => {
                details.appendChild(child);
            });
    
            // Replace the li with the details
            li.parentNode.replaceChild(details, li);
        });
    
        const templateControlSlots = document.querySelectorAll('[type="text/x-template"]');
        templateControlSlots.forEach(templateControlSlot=>{
            const templateContainer = document.createElement('div');
            templateContainer.className="template-container"
            const templateControls = (()=>{
                let elms = [];
                elms.push(document.createElement('div'));
                elms.push(document.createElement('div'));
    
                var a = document.createElement('div');
                a.innerHTML = templateControlSlot.innerHTML;
                a.className = "template-inner-container"
                // elms[0].innerHTML = templateControlSlot.innerHTML; // script[..template..]'s innerHTML
                elms[0] = a;
    
                elms[1].className = "chose-template"
                elms[1].appendChild((()=>{
                    let elm = document.createElement('span'); // icon
                    elm.className = "icon";
                    elm.style.fontSize = "175%";
                    elm.innerHTML = "➕";
                    return elm;
                })());
                elms[1].appendChild((()=>{
                    let elm = document.createElement('br'); // next line
                    return elm;
                })());
                elms[1].appendChild((()=>{
                    let elm = document.createElement('span'); // text
                    elm.innerHTML = "Use Template";
                    return elm;
                })());
                elms[1].addEventListener('click', useTemplateClicked);
    
                return elms;
            })()
            templateContainer.append(...templateControls)
    
            var parentNode = templateControlSlot.parentNode;
            var siblingNode = parentNode.children[0];
            parentNode.insertBefore(templateContainer, templateControlSlot);
            // templateControlSlot.insertBefore(templateContainer, null);
            // templateControlSlot.remove();
        })
} // redrawTemplateList

fetch(chrome.runtime.getURL('templates.html'))
    .then(response => response.text())
    .then(html => {
        document.querySelector("#template-list").innerHTML = html;
        redrawTemplateList();
    })

