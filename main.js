// @ts-check

import "./style.css";
import { detectPlatform } from "./platforms.js";
import {
  getAppStoreUrl,
  getConfig,
  getGooglePlayStoreUrl,
  getMicrosoftStoreUrl,
} from "./config.js";

function renderFallBack(config) {
  let badges = ``;
  const appStoreUrl = getAppStoreUrl(config);
  if (appStoreUrl) {
    badges += `<a href="${appStoreUrl}" rel="noopener noreferrer">
            <img src="/us/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg" class="logo" alt="Download on the App Store" style="width: 150px; height: auto;" />
        </a>`;
  }
  const googlePlayUrl = getGooglePlayStoreUrl(config);
  if (googlePlayUrl) {
    badges += `<a href="${googlePlayUrl}" rel="noopener noreferrer">
            <img src="/us/google-play-badge.png" class="logo" alt="Get it on Google Play" style="width: 200px; height: auto;" />
        </a>`;
  }
  const windowsStoreUrl = getMicrosoftStoreUrl(config);
  if (windowsStoreUrl) {
    badges += `<a href="${windowsStoreUrl}" rel="noopener noreferrer">
            <img src="/us/en-gb dark.svg" class="logo" alt="Get it on the Microsoft Store" style="width: 150px; height: auto;" />
        </a>`;
  }

  if (badges === "") {
    badges = `<p>Sorry, this app link does not support your platform.</p>`;
  }

  // @ts-ignore
  document.querySelector("#app").innerHTML = `
    <div class="badges">
        ${badges}
    </div>
    `;
}

const platform = detectPlatform(navigator.userAgent);
const config = getConfig(location.href);

if (
  !config.appleAppId &&
  !config.googlePackageName &&
  !config.microsoftStoreId
) {
  renderFallBack(config);
} else {
  switch (platform) {
    case "App Store":
      location.href = `https://apps.apple.com/app/id${config.appleAppId}`;
      break;
    case "Google Play":
      location.href = `https://play.google.com/store/apps/details?id=${config.googlePackageName}`;
      break;
    case "Microsoft Store":
      location.href = `https://www.microsoft.com/store/apps/${config.microsoftStoreId}`;
      break;
    default:
      renderFallBack(config);
      break;
  }
}