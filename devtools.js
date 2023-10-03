let panel

chrome.devtools.panels.create("Element Designer", "icon.png", "panel.html", panel => {
    panel = panel;
    // code invoked on panel creation
    panel.onShown.addListener((extPanelWindow) => {

    });
});

