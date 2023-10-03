console.log("Content.js Designer")

chrome.runtime.onMessage.addListener((msg) => {
    if(msg.type === 'logUpdateHTMLSelected-success') {
      alert("Inspect Element: Success at devtools.js where sent here and to panel.js.");
    }
    else if(msg.type === 'logUpdateHTMLSelected-error') {
      alert("Inspect Element: Error at devtools.js where sent here.");
    }
  });