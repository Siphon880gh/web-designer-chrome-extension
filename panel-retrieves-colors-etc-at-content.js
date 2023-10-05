function removeDuplicatesAndSortByFrequency(arr) {

    // Count frequency of each item
    const freq = {};
    for(let i=0; i<arr.length; i++) {
      let item = arr[i];
      if(!(item in freq)) {
        freq[item] = 0; 
      }
      freq[item]++;
    }
    
    // Sort by frequency descending
    arr.sort((a,b) => freq[b] - freq[a]);
    
    // Remove duplicates
    return arr.filter((item, index) => !arr.includes(item, index + 1));
  
} // removeDuplicatesAndSortByFrequency

window.getColors = () => {
    let colors = new Array();
    colors.add = colors.push;
    // let colors = new Set();

    // document.styleSheets is a read-only property that returns a StyleSheetList
    // of StyleSheet objects representing the stylesheets applied to a document.
    // This includes both external stylesheets linked via <link> tags and internal
    // styles defined within <style> tags in the HTML document.
    Array.from(document.styleSheets).forEach(sheet => {
        try {
            // Access the cssRules property of each StyleSheet object to get the CSS rules
            // within each stylesheet.
            Array.from(sheet.cssRules || []).forEach(rule => {
                if (rule.style) {
                    if (rule.style.color) colors.add(rule.style.color);
                    if (rule.style.backgroundColor) colors.add(rule.style.backgroundColor);
                }
            });
        } catch (e) {
            // Accessing the cssRules property of a stylesheet from a different origin
            // will throw a security error due to CORS restrictions, unless the server
            // sends the appropriate CORS headers allowing access to the resource.
            console.warn('Cannot access stylesheet:', sheet.href);
        }
    });

    // Get colors from computed styles and inline styles
    let allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        let style = getComputedStyle(el);
        colors.add(style.color);
        colors.add(style.backgroundColor);
        if (el.style.color) colors.add(el.style.color);
        if (el.style.backgroundColor) colors.add(el.style.backgroundColor);
    });

    // Get colors from CSS Variables
    let rootStyles = getComputedStyle(document.documentElement);
    for (let prop of rootStyles) {
        if (prop.startsWith('--')) {
            let value = rootStyles.getPropertyValue(prop).trim();
            if (value) {
                let resolvedValue = resolveCssVariableValue(prop);
                colors.add(resolvedValue);
            }
        }
    }

    colors = Array.from(colors);
    colors = colors.filter(color => color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)' && color !== 'currentcolor' && color !== 'initial' && color !== 'inherit' && color !== 'unset' );
    colors = colors.filter(color => !color.includes("var("))
    colors = colors.filter(color => color.trim().length>0)
    colors = colors.sort();

    colors = removeDuplicatesAndSortByFrequency(colors);
    return colors;
} // getColors

window.getFonts = async() => {
    let fontFamilies = new Set();
    
    async function parseStyleSheet(sheet) {
        for (const rule of sheet.cssRules) {
            if (rule instanceof CSSStyleRule && rule.style.fontFamily) {
                fontFamilies.add(rule.style.fontFamily);
            } 
            // Handling @font-face rule here.
            else if (rule instanceof CSSFontFaceRule && rule.style.fontFamily) {
                fontFamilies.add(rule.style.fontFamily);
            } 
            // Handling @import rule here.
            else if (rule instanceof CSSImportRule && rule.styleSheet) {
                await parseStyleSheet(rule.styleSheet);
            }
        } // for
    }
    
    // Extract from inline styles and internal style blocks
    document.querySelectorAll('[style]').forEach(el => {
        const fontFamily = el.style.fontFamily;
        if (fontFamily) fontFamilies.add(fontFamily);
    });
    
    // document.styleSheets includes both internal style blocks and external stylesheets.
    Array.from(document.styleSheets).forEach(sheet => {
        try {
        parseStyleSheet(sheet);
        } catch (e) {
        console.error('Error parsing stylesheet', e);
        }
    });
    
    // Extract from external stylesheets
    for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
        // try {
        const response = await fetch(link.href);
        const text = await response.text();
        const blob = new Blob([text], { type: 'text/css' });
        const blobURL = URL.createObjectURL(blob);
        const sheet = await new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = blobURL;
            link.onload = () => resolve(link.sheet);
            link.onerror = reject;
            document.head.appendChild(link);
        });
        await parseStyleSheet(sheet);
        URL.revokeObjectURL(blobURL);


        if(document.head.contains(link) && link)
            document.head.removeChild(link);
        // } catch (e) {
        // console.error('Error fetching or parsing external stylesheet', e);
        // }
    }
    
    // Create and append a dropdown with the font families
    // const select = document.createElement('select');
    // Array.from(fontFamilies).forEach(fontFamily => {
    //     const option = document.createElement('option');
    //     option.textContent = fontFamily;
    //     option.style.fontFamily = fontFamily;
    //     select.appendChild(option);
    // });
    // select.style.overflow = "hidden !important";
    // select.style.width = "100%";
    // document.querySelector("#fonts").insertBefore(select, document.querySelector("#fonts section"));
    
    fontFamilies = Array.from(fontFamilies);
    fontFamilies = fontFamilies.filter(font => font !== 'initial' && font !== 'inherit' && font !== 'unset' );
    fontFamilies = fontFamilies.filter(font => !font.includes("var("))
    fontFamilies = fontFamilies.filter(font => font.trim().length>0)
    return fontFamilies;
} // getFonts

window.getSpaces = async() => {
    let stylesUsed = [];

    // Get the root font size
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    // Extract values from inline and internal stylesheets
    await extractFromStylesheets();

    // Extract values from inline styles
    document.querySelectorAll('[style]').forEach(elem => {
        extractStylesFromElement(elem);
    });

    // Extract computed styles from all elements
    document.querySelectorAll('*').forEach(elem => {
        let computedStyle = getComputedStyle(elem);
        for (let prop of ['padding', 'margin']) {
            for (let dir of ['Top', 'Right', 'Bottom', 'Left']) {
                let fullProp = `${prop}${dir}`;
                let value = computedStyle[fullProp];
                if (value && value !== '0px') {
                    let relativeValue = convertToRelative(value);
                    stylesUsed.push(`${value} (${relativeValue})`);
                }
            }
        }
    });

    async function extractFromStylesheets() {
        for (let sheet of document.styleSheets) {
            if (sheet.href && sheet.href.startsWith('http')) {
                // try {
                    let response = await fetch(sheet.href);
                    let cssText = await response.text();
                    let blob = new Blob([cssText], { type: 'text/css' });
                    let objectURL = URL.createObjectURL(blob);
                    let tempLink = document.createElement('link');
                    tempLink.rel = 'stylesheet';
                    tempLink.href = objectURL;
                    document.head.appendChild(tempLink);
                    let tempSheet = Array.from(document.styleSheets).pop();
                    extractStylesFromSheet(tempSheet);

                    if(document.head.contains(tempLink) && tempLink)
                        document.head.removeChild(tempLink);

                    if(objectURL)
                    URL?.revokeObjectURL(objectURL);
                // } catch (e) {
                //     console.warn("Can't fetch the stylesheet of: ", sheet.href, e);
                // }
            } else {
                extractStylesFromSheet(sheet);
            }
        }
    }

    function extractStylesFromSheet(sheet) {
        try {
            for (let rule of sheet.cssRules) {
                for (let prop of ['padding', 'margin']) {
                    let shorthandValue = rule.style.getPropertyValue(prop);
                    if (shorthandValue) {
                        shorthandValue.split(' ').forEach(val => {
                            let relativeValue = convertToRelative(val);
                            stylesUsed.push(`${val} (${relativeValue})`);
                        });
                    }
                    for (let dir of ['top', 'right', 'bottom', 'left']) {
                        let fullProp = `${prop}-${dir}`;
                        let value = rule.style.getPropertyValue(fullProp);
                        if (value) {
                            let relativeValue = convertToRelative(value);
                            stylesUsed.push(`${value} (${relativeValue})`);
                        }
                    }
                }
            }
        } catch (e) {
            console.warn("Can't read the css rules of: ", sheet.href, e);
        }
    }

    function extractStylesFromElement(elem) {
        let style = elem.style;
        for (let prop of ['padding', 'margin']) {
            let shorthandValue = style.getPropertyValue(prop);
            if (shorthandValue) {
                shorthandValue.split(' ').forEach(val => {
                    let relativeValue = convertToRelative(val);
                    stylesUsed.push(`${val} (${relativeValue})`);
                });
            }
            for (let dir of ['Top', 'Right', 'Bottom', 'Left']) {
                let fullProp = `${prop}${dir}`;
                let value = style[fullProp];
                if (value) {
                    let relativeValue = convertToRelative(value);
                    stylesUsed.push(`${value} (${relativeValue})`);
                }
            }
        }
    }

    function convertToRelative(value) {
        if (value.endsWith('px')) {
            let numericValue = parseFloat(value);
            if (!isNaN(numericValue)) {
                return `${numericValue / rootFontSize}rem`;
            }
        } else if (value.endsWith('%')) {
            return value; // Percentage values are already relative
        }
        return value; // Return original value if it can't be converted
    }


    stylesUsed = stylesUsed.filter(prop => !prop.includes("auto"))
    stylesUsed = stylesUsed.filter(prop => prop.trim().length>0)
    return stylesUsed;
} // getSpaces

/* Save Design Stats into hidden View Models */
/* - colors - */
(()=>{
    var rawColors = getColors();
    var viewModel = document.createElement("script");
    viewModel.id="ds-vm-colors"
    viewModel.setAttribute("type", "text/x-template");
    viewModel.innerHTML = JSON.stringify(rawColors);
    document.body.append(viewModel);
})();

/* - fonts - */
(()=>{
    getFonts().then(rawFonts=>{
        console.log("rawFonts", rawFonts)
        var viewModel = document.createElement("script");
        viewModel.id="ds-vm-fonts"
        viewModel.setAttribute("type", "text/x-template");
        viewModel.innerHTML = JSON.stringify(rawFonts);
        document.body.append(viewModel);
    });
})();

/* - spaces - */
(()=>{
    getSpaces().then(stylesUsed=>{

        rawSpaces = removeDuplicatesAndSortByFrequency(stylesUsed);

        var viewModel = document.createElement("script");
        viewModel.id="ds-vm-spaces"
        viewModel.setAttribute("type", "text/x-template");
        viewModel.innerHTML = JSON.stringify(rawSpaces);
        document.body.append(viewModel);
    });
})();

// chrome.runtime.sendMesssage({type:"updateDesignStatsIntoViewModels"});