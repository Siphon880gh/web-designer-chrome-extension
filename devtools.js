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


chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    switch(request.type) {
        case "swapHTML":
            swapHTML = request.data;
            swapMode = request.swapMode;
            insertMode = request.insertMode;
            break;
    }
}); // addListener

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
                    inspectedWindow.eval(`var div = document.createElement('div'); document.body.append(div); div.outerHTML = '${swapHTML}'; `, (result, isException) => {
                        if(isException) {
                            console.log(isException);
                        }
                    });
                } else if (insertMode==="prepend") {
                    inspectedWindow.eval(`var div = document.createElement('div'); document.body.prepend(div); div.outerHTML = '${swapHTML}'; `, (result, isException) => {
                        if(isException) {
                            console.log(isException);
                        }
                    });
                } else if(swapMode==="outerHTML") {
                    inspectedWindow.eval(`$0.outerHTML = '<div>${swapHTML}</div>'`, (result, isException) => {});
                } else if(swapMode==="innerHTML") {
                    inspectedWindow.eval(`$0.innerHTML = '<div>${swapHTML}</div>'`, (result, isException) => {});
                }
                
                // Reset swapHTML for next selection and template insertion/swap
                swapHTML = null;
            }
        }, 10);
        // Asked ChatGPT but it seems like their code is not reliable. But to juggle some thoughts anyways:
        // https://chat.openai.com/c/51b4ce96-af44-433d-b6d8-f6214946162f

    });
});