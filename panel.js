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

window.getFonts = function() {
    return "";
}
window.getSpaces = function() {
    return "";
}

const port = chrome.runtime.connect({name: "content-script"});
port.postMessage({type: "report-colors", data: getColors() });
// chrome.runtime.sendMessage({type:"report-colors", data: getColors()});