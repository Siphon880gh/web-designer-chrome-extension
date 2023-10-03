let panel, sidebar = null

chrome.devtools.panels.create("Tailwind-Bootcamp Templates", "icon.png", "panel.html", panel => {
    panel = panel;
    // code invoked on panel creation
    panel.onShown.addListener((extPanelWindow) => {

    });
});

// Background page

chrome.devtools.panels.elements.createSidebarPane("Templates", 
  function(sidebar) {
    sidebar = sidebar;

  sidebar.onShown.addListener(function() {
    // sidebar.setObject({someObject: true});
    // Panel content
    panel.setPage('popup.html')
    panel.setHeight('100px');

    sidebar.setPage('popup.html')
    sidebar.setHeight('100px');  
  });

});

// Listen for selection changes
chrome.devtools.panels.onSelectionChanged.addListener(() => {
  
  // Get selected element
  chrome.devtools.inspectedWindow.eval("$", (element) => {
    sidebar.setObject({selectedElement: element});; 
  });

});
