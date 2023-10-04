console.log("content-enable-external-img running")

/** Doesn't work on all websites. 
 * Apple.com still blocks images from your templates from loading, whereas this is effective on bmwusa.com 
 * There's no workaround. */
const metaTags = document.getElementsByTagName('meta');
for (let i = 0; i < metaTags.length; i++) {
  if (metaTags[i].getAttribute('http-equiv') === 'Content-Security-Policy') {
    // Modify the CSP content attribute to allow external images
    const cspContent = metaTags[i].getAttribute('content');
    metaTags[i].setAttribute('content', cspContent + " img-src *;");
    metaTags[i].setAttribute('content', cspContent + " connect-src *;");
  }
}