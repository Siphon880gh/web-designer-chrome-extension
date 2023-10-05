/* Panel JS loads */
window.injectedJS = false;
async function panelJSLoads() {

    if(!injectedJS) {
        injectedJS = true;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let tab = tabs[0];
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                files: ['panel-retrieves-colors-etc-at-content.js']
              });
              // alert("Content retrieval script loaded!")
              
              let waitForSaved1 = setInterval(()=>{
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    function: function() {
                      return document.querySelector('#ds-vm-colors')?.innerHTML;
                    }
                  }, (results) => {
                    // console.log("#ds-vm-colors innerHTML", results);
                    if (results[0].result) {
                      rawData = JSON.parse(results[0].result);
                      clearInterval(waitForSaved1);
                      chrome.runtime.sendMessage({type:"report-colors", data:rawData});
                    }
                }); // executeScript
              }, 50); // waitForSaved

              let waitForSaved2 = setInterval(()=>{
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    function: function() {
                      return document.querySelector('#ds-vm-fonts')?.innerHTML;
                    }
                  }, (results) => {
                    // console.log("#ds-vm-fonts innerHTML", results);
                    if (results[0].result) {
                      rawData = JSON.parse(results[0].result);
                      clearInterval(waitForSaved2);
                      chrome.runtime.sendMessage({type:"report-fonts", data:rawData});
                    }
                }); // executeScript
              }, 50); // waitForSaved

              let waitForSaved3 = setInterval(()=>{
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    function: function() {
                      return document.querySelector('#ds-vm-spaces')?.innerHTML;
                    }
                  }, (results) => {
                    // console.log("#ds-vm-spaces innerHTML", results);
                    if (results[0].result) {
                      rawData = JSON.parse(results[0].result);
                      clearInterval(waitForSaved3);
                      chrome.runtime.sendMessage({type:"report-spaces", data:rawData});
                    }
                }); // executeScript
              }, 50); // waitForSaved

          }); // query tab
          
    }

};
panelJSLoads();