var app = {
    store: null,
    init: (store)=>{
        this.store = store;
    },
    observe: {
        DOMContentReady:()=>{
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
    },
    getState: {
        getSwapMode: ()=>{
            this.store.get('swapMode', function(result) {
                // alert('Value currently is ' + result.swapMode);
            });
        }
    }
}

app.init(chrome.storage.local);
app.observe.DOMContentReady();
