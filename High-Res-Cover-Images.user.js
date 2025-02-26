// ==UserScript==
// @name        High-res cover images on genius.com
// @description Changes all cover images on genius.com lyrics pages to their highest possible resolution
// @namespace   https://github.com/Sv443
// @version     1.0.1
// @author      Sv443
// @copyright   Sv443 (https://github.com/Sv443)
// @license     MIT
// @match       *://genius.com/*
// @homepageURL https://github.com/Sv443/High-res-cover-images-on-genius.com#readme
// @supportURL  https://github.com/Sv443/High-res-cover-images-on-genius.com/issues
// @updateURL   https://github.com/Sv443/High-res-cover-images-on-genius.com/raw/refs/heads/main/High-Res-Cover-Images.user.js
// @grant       none
// @run-at      document-start
// ==/UserScript==

/** Regex to match the asset URL and extract the current width & height and the max width & height */
const imgSrcRegex = /https?:\/\/[a-zA-Z0-9]+\.genius\.com\/unsafe\/(\d+)x(\d+)\/.+\.(\d+)x(\d+)x\d+\.(?:jpg|png|gif)/;
/** Max amount of seconds to check for image elements before giving up */
const timeoutSec = 5;
/** Interval in milliseconds between checking for image elements */
const checkInterval = 100;

function run(startTs = Date.now()) {
  const imgs = document.querySelectorAll("#application img");
  if(imgs && imgs.length > 0) {
    for(const img of imgs) {
      const matches = "src" in img ? img.src.match(imgSrcRegex) : null;
      if(matches && matches.length === 5) {
        const [src, curW, curH, maxW, maxH] = matches;
        img.src = src.replace(/\/unsafe\/\d+x\d+\//, `/unsafe/${maxW}x${maxH}/`);
      }
    }
    console.info(`Replaced ${imgs.length} low-res ${imgs.length === 1 ? "image with a high-res one" : "images with high-res ones"}.\n\n${GM.info.script.name} v${GM.info.script.version}\n${GM.info.script.homepageURL}`);
  }
  else if(Date.now() - startTs < timeoutSec * 1000)
    setTimeout(() => run(startTs), checkInterval);
  else
    console.warn(`Couldn't find any images to replace after ${timeoutSec} seconds.\n\nIf you are not on a lyrics page, you can ignore this warning.\nIf this issue keeps happening on lyrics pages, please submit a bug report here: ${GM.info.script.supportURL}`);
}

document.addEventListener("DOMContentLoaded", () => run());
