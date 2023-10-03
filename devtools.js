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
            return;
            // chrome.runtime.sendMessage({type:"logUpdateHTMLSelected-error", data: result})
            // alert("Error selecting element")
        }
        
        // chrome.runtime.sendMessage({type:"updateHTMLSelected-success", data: result})
        // alert("Selected element's outer HTML: " + result)

        // TODO: If a button is pressed at sidebar.js, then run:
        // chrome.devtools.inspectedWindow.eval("$0.outerHTML = '<div>Swapped HTML</div>'", (result, isException) => {});
        // Asked ChatGPT but it seems like their code is not reliable. But to juggle some thoughts anyways:
        // https://chat.openai.com/c/51b4ce96-af44-433d-b6d8-f6214946162f

    });
});