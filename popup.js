var app = {
    store: null,
    init: (store)=>{
        this.store = store;
    },
    observe: {
        DOMContentReady:async()=>{

            let swapModeWrapper = await chrome.storage.local.get("swapMode")
            let swapMode = swapModeWrapper?.swapMode;
            if(!swapMode) swapMode = "outerHTML"; // default
            if(swapMode==="outerHTML") {
                document.querySelector("#html-level-outer").checked = true;
                document.querySelector("#html-level-inner").checked = false;
            } else {
                document.querySelector("#html-level-outer").checked = false;
                document.querySelector("#html-level-inner").checked = true;
            }

            document.querySelectorAll('[name="htmlLevel"]').forEach(inputRadio=>{
               inputRadio.addEventListener('change', function(ev){
                    switch(ev.target.value) {
                        case "outerHTML":
                            app.setState.setOuterHTML();
                            break;
                        case "innerHTML":
                            app.setState.setInnerHTML();
                            break;
                    }
                }); // inputRadio on change
            }); // all input radios
        } // DOMContentReady
    }, // observe
    setState: {
        setOuterHTML: ()=>{
            this.store.set({swapMode: 'outerHTML'}, function() {
                // alert('Value is set to ' + 'outerHTML');
            });
        },
        setInnerHTML: ()=>{
            this.store.set({swapMode: 'innerHTML'}, function() {
                // alert('Value is set to ' + 'innerHTML');
            });
        }
    }
}

app.init(chrome.storage.local);
app.observe.DOMContentReady();
