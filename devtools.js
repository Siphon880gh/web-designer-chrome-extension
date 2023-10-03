let sidebar = null;

chrome.devtools.panels.elements.createSidebarPane("Bootstrap-Tailwind Templates", (mySidebar) => {
    sidebar = mySidebar;
    mySidebar.setPage('sidebar.html')

    mySidebar.onShown.addListener(function(content) {

    });
}); // created sidebar

chrome.devtools.panels.elements.onSelectionChanged.addListener((info) => {
    chrome.devtools.inspectedWindow.eval("$0.outerHTML", (result, isException) => {
        if (isException) {
            // alert("1");
            return;
            //chrome.runtime.sendMessage({type:"logUpdateHTMLSelected-error", data: result})
        }
        // alert("2")
        result.innerHTML = "Hello World";
        
        //chrome.runtime.sendMessage({type:"logUpdateHTMLSelected-success", data: result})
        // port.postMessage({from: "devtools", message: "Inspect Element: devtools.js sent to panel.js, changing HTML selected preview"});
    });
});