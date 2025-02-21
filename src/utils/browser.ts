// // src/utils/browser.ts
// import chromium from 'chrome';

// export const getBrowser = async () => {
//   const executablePath = await chromium.executablePath;

//   if (!executablePath) {
//     // Local development fallback
//     const puppeteer = require('puppeteer');
//     return puppeteer.launch({
//       headless: true,
//       args: chromium.args,
//     });
//   }

//   return chromium.puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath,
//     headless: true,
//     // ignoreHTTPSErrors: true,
//   });
// };