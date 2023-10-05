/* SECTION: Sidebar.html */

let sidebar = null;
let swapHTML = null;
let swapMode = null;
let insertMode = null;
let poller = null;

chrome.devtools.panels.elements.createSidebarPane("Bootstrap-Tailwind Templates", (mySidebar) => {
    sidebar = mySidebar;
    mySidebar.setPage('sidebar.html')

    mySidebar.onShown.addListener(function(content) {

    });
}); // created sidebar


chrome.devtools.panels.elements.onSelectionChanged.addListener((info) => {
    // Assure it's an element selection instead of a DevTools item selection
    chrome.devtools.inspectedWindow.eval("$0.outerHTML", (result, isException) => {
        if (isException) {
            return;
            // chrome.runtime.sendMessage({type:"logUpdateHTMLSelected-error", data: result})
            // alert("Error selecting element")
        }
        
        let inspectedWindow = chrome.devtools.inspectedWindow
        poller = setInterval(()=>{

            // Assure the template selected has HTML
            if(swapHTML!==null) {
                console.log(swapMode);
               
                // If appending or prepending, it's to doc body
                // If swapping, it's to the selected element either innerHTML or outerHTML
                if(insertMode==="append") {
                    inspectedWindow.eval(`var div = document.createElement('div'); div.className='btw-template'; document.body.append(div); div.outerHTML = \`${swapHTML}\`; `, (result, isException) => {
                        if(isException) {
                            console.log(isException);
                        }
                    });
                } else if (insertMode==="prepend") {
                    inspectedWindow.eval(`var div = document.createElement('div'); div.className='btw-template'; document.body.prepend(div); div.outerHTML = \`${swapHTML}\`; `, (result, isException) => {
                        if(isException) {
                            console.log(isException);
                        }
                    });
                } else if(swapMode==="outerHTML") {
                    inspectedWindow.eval(`$0.outerHTML = \`<div class='btw-template'>${swapHTML}</div>\``, (result, isException) => {
                        if(isException) {
                            console.log(isException);
                        }
                    });
                } else if(swapMode==="innerHTML") {
                    inspectedWindow.eval(`$0.innerHTML = \`<div class='btw-template'>${swapHTML}</div>\``, (result, isException) => {
                        if(isException) {
                            console.log(isException);
                        }
                    });
                }
                
                // Reset swapHTML for next selection and template insertion/swap
                swapHTML = null;
            }
        }, 10);
        

    });
});


/* SECTION: Panel.html */
let panelWindow;
chrome.devtools.panels.create("Design Aspects Identifier", "icon.png", "panel.html", panel => {

    // code invoked on panel creation
    panel.onShown.addListener((window) => {
        panelWindow = window;
        
            // Get stats
            // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            //     var currentTab = tabs[0];
            //     chrome.runtime.sendMessage(
            //       currentTab.id,
            //       {type: "getColors"},
            //       function(response) {
            //         console.log(response.payload);  // Handle the response from the content script
            //       }
            //     );
            //   });

            // Update panel with stats
            // panelWindow.document.querySelector("#colors section").append((()=>{
            //     return document.createElement("div");
            // })())
            // panelWindow.document.querySelector("#fonts section").append((()=>{
            //     return document.createElement("div");
            // })())
            // panelWindow.document.querySelector("#spacing section").append((()=>{
            //     return document.createElement("div");
            // })())
    }); // shown panel

});

/* SECTION: Utilities */

/* Utils */
function colorToValue(colorName, format = 'rgb') {
    var document = panelWindow.document; // else wont work in DevTools

    // Create a temporary div to use the browser's color parsing
    let tempDiv = document.createElement('div');
    tempDiv.style.display = 'none';
    tempDiv.style.color = colorName;
    document.body.appendChild(tempDiv);

    // Get computed color
    let computedColor = window.getComputedStyle(tempDiv).color;

    // Cleanup
    document.body.removeChild(tempDiv);

    // Parse RGB values
    let matches = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!matches) return null;

    let [_, r, g, b] = matches.map(Number);

    switch (format) {
        case 'hex':
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        case 'rgb':
            return `rgb(${r}, ${g}, ${b})`;
        case 'rgba':
            return `rgba(${r}, ${g}, ${b}, 1)`;
        default:
            return null;
    }
} // colorToValue

/* SECTION: Listeners to affect content */
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    switch(request.type) {
        case "swapHTML":
            swapHTML = request.data;
            swapMode = request.swapMode;
            insertMode = request.insertMode;


            console.log("devTools.js received swapHTML", swapHTML)
            break;
        case "wipeout":
            console.log("devTools.js wipeout command");
            chrome.devtools.inspectedWindow.eval("document.body.innerHTML = '';", (result, isException) => {
                if (isException) {
                    return;
                    // chrome.runtime.sendMessage({type:"logUpdateHTMLSelected-error", data: result})
                    // alert("Error selecting element")
                }
            });
            break;
    } // switch
}); // addListener

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "content-script");
    port.onMessage.addListener(function(request) {
        switch(request.type) {

            case "report-colors":
                console.log("devTools.js reporting colors");
                console.log(request.data);

                setTimeout(()=>{
                    panelWindow.document.querySelector("#colors section").innerHTML = "";

                        var colorElms = [];
                        request.data.forEach(color=>{
                            colorElms.push((()=>{
                                var div = document.createElement("div");
                                div.className = "color-row";
                                
                                // Imperative: Create color text and color swatch. Append each to div.
                                (()=>{
                                    var span = document.createElement("span");
                                    span.textContent = color;
                                    var swatch = document.createElement("input");
                                    swatch.type = "color";
                                    swatch.value = colorToValue(color, "hex");
                                    swatch.style.padding = "0"
                                    swatch.style.width = "15px"
                                    swatch.style.height = "15px"
                                    swatch.style.marginLeft = "5px"
                                    swatch.style.display = "inline-block";
                                    return [span, swatch]
                                })().forEach(elm=>{
                                    div.append(elm);
                                });

                                return div;
                            })()) // colorElms.push
                        }); // request.data's colors.forEach

                        console.log(colorElms)


                    panelWindow.document.querySelector("#colors section").append(...colorElms);
                        
                }, 500);
                    
                break;
        } // switch
    });
  });