var injectedCSS = false;

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

document.querySelector("#wipeout").addEventListener("click", function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    chrome.runtime.sendMessage({type:"wipeout"});
})

async function useTemplateClicked(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    if(!injectedCSS) {
        injectedCSS = true;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let tab = tabs[0];
            chrome.scripting.insertCSS({
              target: {tabId: tab.id},
              files: ['assets-framework-css/bootstrap.min.css', 'assets-framework-css/tailwind.min.css']
            });

            // chrome.scripting.insertCSS({
            //     target: {tabId: tab.id},
            //     files: [
            //         'assets-framework-css/fa/font-awesome-v3.2.1.min.css', 
            //         'assets-framework-css/fa/font-awesome-v4.7.0.min.css',
            //         'assets-framework-css/fa/font-awesome-v5.13.1.min.css',
            //         'assets-framework-css/fa/font-awesome-v6.4.0.min.css'
            //     ]
            //   });     

            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ['assets-framework-css/bootstrap.bundle.min.js']
              });
            // alert("CSS and JS injected for Bootstrap 5 / Tailwind 2!")
          });
          
    }

    let templateBtn = ev.target;
    if(!templateBtn.matches(".chose-template")) {
        templateBtn = templateBtn.closest(".chose-template");
    }

    // let templateElm = templateBtn.parentNode.children[0].children[0]; // inner container of the template
    // let swapWith = templateElm.outerHTML;
    let swapWith = (()=>{
        if(!templateBtn.parentNode.children[0].className.includes("code")) {
            
            return templateBtn.parentNode.children[0].innerHTML; // inner container of the template
        } else {
            
            return templateBtn.parentNode.children[0].value; // it's a textarea where you can type in custom code
        }

    })()

    console.log("Sidebar.js will send swapHTML to devTools.js...")
    // console.log(swapWith)
    
    let swapModeWrapper = await chrome.storage.local.get('swapMode');
    let swapMode = swapModeWrapper?.swapMode;
    if(!swapMode) swapMode = "outerHTML"; // default

    // swapMode is innerHTML or outerHTML
    // insertMode is swapping element, prepending body, or appending body
    let insertMode = document.querySelector('button.active').dataset.value;
    // console.log({insertMode})

    chrome.runtime.sendMessage({type:"swapHTML", data: swapWith, swapMode, insertMode});
};

// load templates
function redrawTemplateList() {
        // Select all list items

        const liItems = document.querySelectorAll('#template-list li');
    
        liItems.forEach(li => {
            li.classList.add('template-listing');
    
            // Create a new summary element and set its content to the first child of the li (should be the text node, eg. <li>Chart Summary)
            // This is for presentation to the user
            const summary = document.createElement('summary');
            summary.innerHTML = li.firstChild.textContent;
            li.firstChild.remove();

            // Create a new details element that will show the summary tagline and carry toggleable information
            const details = document.createElement('details');
            li.prepend(details) // prepend because below siblings will be moved into details

            // Fill in the details that have a summary tagline and the rest of the contents that toggle on and off (1 and 2)
            // 1.
            details.appendChild(summary);
    
            // 2.
            // Move all of <li>'s siblings that are below the first sibling (which is <details>). 
            // You move into details because they will be the rest of the details body that are toggeable.
            Array.from(li.childNodes).slice(1).forEach(child => {
                details.appendChild(child);
            });
    
            // Replace the li with the details
            // li.parentNode.replaceChild(details, li);
            // li.parentNode.append()
        });
    
        const templateControlSlots = document.querySelectorAll('[type="text/x-template"]');
        templateControlSlots.forEach(templateControlSlot=>{
            const templateContainer = document.createElement('div');
            templateContainer.className="template-container"
            const templateControls = (()=>{
                let elms = [];
                elms.push(document.createElement('div'));
                elms.push(document.createElement('div'));
    
                var div = document.createElement('div');
                div.innerHTML = templateControlSlot.innerHTML;
                div.className = "template-inner-container"
                // elms[0].innerHTML = templateControlSlot.innerHTML; // script[..template..]'s innerHTML
                elms[0] = div;
    
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

        // Class name template-listing will be exempted from other css rules
        const ulItems = document.querySelectorAll('ul');
    
        ulItems.forEach(ul => {
            ul.classList.add('template-listing');
        });
} // redrawTemplateList


function enableFASwitcher() {
    document.querySelectorAll("details").forEach(switcher=>{
        switcher.addEventListener("toggle", function(ev) {
            const tagLine = switcher.innerText.toUpperCase().replaceAll("-","");
            const sideBarFA = document.querySelector("#fa-switcher"); // <link id="fa-switcher" data-fa="FA6" href="..." rel="stylesheet">
            const sideBarFATag = sideBarFA.dataset.fa;
            if(tagLine.includes("FA6")) {
                if(sideBarFATag!=="FA6") {
                    sideBarFA.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
                }
            } else if(tagLine.includes("FA5")) {
                if(sideBarFATag!=="FA5") {
                    sideBarFA.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css";
                }
            } else if(tagLine.includes("FA4")) {
                if(sideBarFATag!=="FA4") {
                    sideBarFA.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
                }
            } else if(tagLine.includes("FA3")) {
                if(sideBarFATag!=="FA3") {
                    sideBarFA.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/3.2.0/css/font-awesome.min.css";
                }
            } // elseif
        });
    });
} // enableFASwitcher

// Enter your own custom code to swap / insert
document.querySelectorAll("#template-coder .chose-template.code").forEach(btnUseCode=>{
    btnUseCode.addEventListener('click', useTemplateClicked);
})

// Future version will have paid tier with premium templates, personally modified template variations, and AI-filler with brand colors/fonts and content, if enough interest in this feature is shown.
// Likely connects to external server for premium templates
fetch(chrome.runtime.getURL('templates.html'))
// fetch('https://wengindustry.com/main/engine/chrome-templates/?apiKey=chrome-templates')
    .then(response => {
        if(!response.ok) {
            console.error("Error fetching templates.html");
            console.error(response.status);
            console.error(response.statusText);
        }
        return response.text()
    })
    .then(html => {
        document.querySelector("#template-list").innerHTML = html;
        redrawTemplateList();
        enableFASwitcher();
    })

