https://www.davingm.com/

99
100
96
100
2/2
99
Performance
100
Accessibility
96
Best Practices
100
SEO
2/2
Agentic Browsing
99
FCP
+10
LCP
+24
TBT
+30
CLS
+25
SI
+10
Performance
Values are estimated and may vary. The performance score is calculated directly from these metrics.See calculator.
0–49
50–89
90–100
Final Screenshot

Metrics
Expand view
First Contentful Paint
0.6 s
Largest Contentful Paint
0.9 s
Total Blocking Time
10 ms
Cumulative Layout Shift
0
Speed Index
0.6 s
View Treemap
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Screenshot
Show audits relevant to:

All

FCP

LCP

TBT

CLS
Insights
Legacy JavaScript Est savings of 14 KiB
Polyfills and transforms enable older browsers to use new JavaScript features. However, many aren't necessary for modern browsers. Consider modifying your JavaScript build process to not transpile Baseline features, unless you know you must support older browsers. Learn why most sites can deploy ES6+ code without transpilingFCPLCPUnscored
URL
Wasted bytes
davingm.com 1st party
13.8 KiB
…chunks/380uh6mtmbvgi.js(www.davingm.com)
13.8 KiB
380uh6mtmbvgi.js:1
Array.prototype.at
380uh6mtmbvgi.js:1
Array.prototype.flat
380uh6mtmbvgi.js:1
Array.prototype.flatMap
380uh6mtmbvgi.js:1
Object.fromEntries
380uh6mtmbvgi.js:1
Object.hasOwn
380uh6mtmbvgi.js:1
String.prototype.trimEnd
380uh6mtmbvgi.js:1
String.prototype.trimStart
LCP request discovery
Optimize LCP by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loadingLCPUnscored
fetchpriority=high should be applied to the image preload request
Request is discoverable in initial document
LCP resources should not use loading=lazy
img.w-full.h-auto.object-cover.max-h-44.group-hover:scale-[1.02].transition-transform.duration-200
Network dependency tree
Avoid chaining critical requests by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.LCPUnscored
Maximum critical path latency: 485 ms
Initial Navigation
https://www.davingm.com - 222 ms, 46.70 KiB
/images/site.webmanifest(www.davingm.com) - 485 ms, 1.23 KiB
…chunks/29znldlu4php6.css(www.davingm.com) - 274 ms, 8.92 KiB
/beacon.min.js/v31edd6d…(static.cloudflareinsights.com) - 225 ms, 0.00 KiB
Preconnected origins
preconnect hints help the browser establish a connection earlier in the page load, saving time when the first request for that origin is made. The following are the origins that the page preconnected to.
no origins were preconnected
Preconnect candidates
Add preconnect hints to your most important origins, but try to use no more than 4.
No additional origins are good candidates for preconnecting
Use efficient cache lifetimes Est savings of 149 KiB
A long cache lifetime can speed up repeat visits to your page. Learn more about caching.FCPLCPUnscored
Request
Cache TTL
Transfer Size
GitHub utility
152 KiB
/u/226…?v=4(avatars.githubusercontent.com)
5m
82 KiB
/u/230…?v=4(avatars.githubusercontent.com)
5m
36 KiB
/u/204…?v=4(avatars.githubusercontent.com)
5m
34 KiB
Google Tag Manager tag-manager 
4 KiB
/gtag/js?id=G-8299K8G21E(www.googletagmanager.com)
None
4 KiB
Improve image delivery Est savings of 121 KiB
Reducing the download time of images can improve the perceived load time of the page and LCP. Learn more about optimizing image sizeFCPLCPUnscored
URL
Resource Size
Est Savings
davingm.com 1st party
141.5 KiB	120.6 KiB
img.w-full.h-auto.object-cover.max-h-44.group-hover:scale-[1.02].transition-transform.duration-200
…blog/tld.png(www.davingm.com)
141.5 KiB
120.6 KiB
Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image's download size.
18.8 KiB
This image file is larger than it needs to be (1280x589) for its displayed dimensions (478x269). Use responsive images to reduce the image download size.
117.4 KiB
Render-blocking requests
Requests are blocking the page's initial render, which may delay LCP. Deferring or inlining can move these network requests out of the critical path.FCPLCPUnscored
URL
Transfer Size
Duration
davingm.com 1st party
8.9 KiB	70 ms
…chunks/29znldlu4php6.css(www.davingm.com)
8.9 KiB
70 ms
Optimize DOM size
LCP breakdown
3rd parties
These insights are also available in the Chrome DevTools Performance Panel - record a trace to view more detailed information.
Diagnostics
Reduce unused JavaScript Est savings of 29 KiB
Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity. Learn how to reduce unused JavaScript.FCPLCPUnscored
URL
Transfer Size
Est Savings
davingm.com 1st party
71.2 KiB	28.8 KiB
…chunks/380uh6mtmbvgi.js(www.davingm.com)
71.2 KiB
28.8 KiB
Image elements do not have explicit width and height
Set an explicit width and height on image elements to reduce layout shifts and improve CLS. Learn how to set image dimensionsCLSUnscored
URL
davingm.com 1st party
img.w-full.h-auto.object-cover.max-h-44.group-hover:scale-[1.02].transition-transform.duration-200
…blog/tld.png(www.davingm.com)
Minify JavaScript Est savings of 5 KiB
Minifying JavaScript files can reduce payload sizes and script parse time. Learn how to minify JavaScript.FCPLCPUnscored
URL
Transfer Size
Est Savings
Wappalyzer - Technology profiler Chrome Extension 
6.9 KiB	2.4 KiB
chrome-extension://gppongmhjkpfnbhagpmjfkannfbllamg/js/content.js
6.9 KiB
2.4 KiB
Google Tag Manager tag-manager 
3.6 KiB	2.1 KiB
/gtag/js?id=G-8299K8G21E(www.googletagmanager.com)
3.6 KiB
2.1 KiB
User Timing marks and measures 4 user timings
Avoid long main-thread tasks 3 long tasks found
More information about the performance of your application. These numbers don't directly affect the Performance score.
Passed audits (15)
Show
100
Accessibility
These checks highlight opportunities to improve the accessibility of your web app. Automatic detection can only detect a subset of issues and does not guarantee the accessibility of your web app, so manual testing is also encouraged.
Additional items to manually check (10)
Hide
Interactive controls are keyboard focusable
Interactive elements indicate their purpose and state
The page has a logical tab order
Visual order on the page follows DOM order
User focus is not accidentally trapped in a region
The user's focus is directed to new content added to the page
HTML5 landmark elements are used to improve navigation
Offscreen content is hidden from assistive technology
Custom controls have associated labels
Custom controls have ARIA roles
These items address areas which an automated testing tool cannot cover. Learn more in our guide on conducting an accessibility review.
Passed audits (21)
Show
Not applicable (42)
Show
96
Best Practices
General
Browser errors were logged to the console
Trust and Safety
Ensure CSP is effective against XSS attacks
Use a strong HSTS policy
Ensure proper origin isolation with COOP
Mitigate clickjacking with XFO or CSP
Mitigate DOM-based XSS with Trusted Types
Browser Compatibility
Baseline Features
Passed audits (12)
Show
Not applicable (2)
Show
100
SEO
These checks ensure that your page is following basic search engine optimization advice. There are many additional factors Lighthouse does not score here that may affect your search ranking, including performance on Core Web Vitals. Learn more about Google Search Essentials.
Additional items to manually check (1)
Hide
Structured data is valid
Run these additional validators on your site to check additional SEO best practices.
Passed audits (10)
Show
2/2
Agentic Browsing
These checks ensure high-quality, browsable websites for AI agents and validate the correctness of WebMCP integrations. This category is still under development and subject to change.
Passed audits (2)
Show
Not applicable (4)
Show
Captured at Sep 11, 2026, 7:23 AM GMT+7
Emulated Desktop with Lighthouse 13.4.1
Single page session
Initial page load
Custom throttling
Using Chromium 152.0.0.0 with devtools
Generated by Lighthouse 13.4.1 | File an issue