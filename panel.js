window.getColors = function() {
    let colors = new Set();

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

    // Filter out 'transparent' and 'rgba(0, 0, 0, 0)' values
    colors.delete('transparent');
    colors.delete('rgba(0, 0, 0, 0)');

    colors = Array.from(colors);
    colors = colors.filter(color => color !== 'transparent' && color !== 'initial' && color !== 'inherit' && color !== 'unset' );
    colors = colors.filter(color => !color.includes("var("))
    colors = colors.filter(color => color.trim().length>0)
    return colors;
} // getColors

window.getFonts = async function() {
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
        }
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
window.getSpaces = function() {
    return "";
}

const port = chrome.runtime.connect({name: "content-script"});

// Send color report
port.postMessage({type: "report-colors", data: getColors() });

// Send font report
(()=>{
    getFonts().then(fonts=>{
        port.postMessage({type: "report-fonts", data: fonts });
    });
})();

// chrome.runtime.sendMessage({type:"report-colors", data: getColors()});