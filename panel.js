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
        try {
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
        document.head.removeChild(link);
        } catch (e) {
        console.error('Error fetching or parsing external stylesheet', e);
        }
    }
    
    // Create and append a dropdown with the font families
    const select = document.createElement('select');
    Array.from(fontFamilies).forEach(fontFamily => {
        const option = document.createElement('option');
        option.textContent = fontFamily;
        option.style.fontFamily = fontFamily;
        select.appendChild(option);
    });
    select.style.overflow = "hidden !important";
    select.style.width = "100%";
    document.querySelector("#fonts").insertBefore(select, document.querySelector("#fonts section"));
    
    fontFamilies = Array.from(fontFamilies);
    fontFamilies = fontFamilies.filter(font => font !== 'initial' && font !== 'inherit' && font !== 'unset' );
    fontFamilies = fontFamilies.filter(font => !font.includes("var("))
    fontFamilies = fontFamilies.filter(font => font.trim().length>0)
    return fontFamilies;
} // getFonts

window.getSpaces = async() => {
    let stylesUsed = [];

    // Extract values from inline and internal stylesheets
    for (let sheet of document.styleSheets) {
        if (sheet.href && sheet.href.startsWith('http')) {
            try {
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
                document.head.removeChild(tempLink);
                URL.revokeObjectURL(objectURL);
            } catch (e) {
                console.warn("Can't fetch the stylesheet of: ", sheet.href, e);
            }
        } else {
            extractStylesFromSheet(sheet);
        }
    }

    // Extract values from inline styles
    document.querySelectorAll('[style]').forEach(elem => {
        let style = elem.style;
        for (let prop of ['padding', 'margin']) {
            for (let dir of ['Top', 'Right', 'Bottom', 'Left']) {
                let fullProp = `${prop}${dir}`;
                let value = style[fullProp];
                if (value) {
                    stylesUsed.push({ property: fullProp, value: value });
                }
            }
        }
    });

    // Extract CSS variable values
    let computedStyle = getComputedStyle(document.documentElement);
    for (let variable of computedStyle) {
        if (variable.startsWith('--')) {
            let value = computedStyle.getPropertyValue(variable);
            if (value.includes('padding') || value.includes('margin')) {
                stylesUsed.push({ property: variable, value: value.trim() });
            }
        }
    }

    function extractStylesFromSheet(sheet) {
        try {
            for (let rule of sheet.cssRules) {
                for (let prop of ['padding', 'margin']) {
                    for (let dir of ['top', 'right', 'bottom', 'left']) {
                        let fullProp = `${prop}-${dir}`;
                        let value = rule.style.getPropertyValue(fullProp);
                        if (value) {
                            stylesUsed.push({ property: fullProp, value: value });
                        }
                    }
                }
            }
        } catch (e) {
            console.warn("Can't read the css rules of: ", sheet.href, e);
        }
    }

    return stylesUsed;
} // getSpaces


const port = chrome.runtime.connect({name: "content-script"});

// Send color report
port.postMessage({type: "report-colors", data: getColors() });

// Send font report
(()=>{
    getFonts().then(fonts=>{
        port.postMessage({type: "report-fonts", data: fonts });
    });
})();

// Send spacing report
(()=>{
    getSpaces().then(stylesUsed=>{

        // function extractAndSortValues
        // [{ paddingTop="5px"}, {paddingRight="10px"}] => ["5px", "10px"]
        function extractAndSortValues(stylesUsed) {
            // Extract values
            let values = stylesUsed.map(style => style.value);
        
            // Sort values
            values.sort((a, b) => {
                // Convert values like "10px" to integers for comparison
                let numA = parseInt(a, 10);
                let numB = parseInt(b, 10);
        
                // Handle cases where values are not in px or other units
                if (isNaN(numA) || isNaN(numB)) {
                    return a.localeCompare(b);
                }
        
                return numA - numB;
            });
        
            return values;
        } // extractAndSortValues

        let spaces = extractAndSortValues(stylesUsed);
        spaces = removeDuplicatesAndSortByFrequency(spaces);

        port.postMessage({type: "report-spaces", data: spaces });
    });
})();