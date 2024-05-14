// @ts-check

export function getRemoteConfigUrl(requestUrl) {
  // determine if there is a t parameter in the URL
  try {
    const url = new URL(requestUrl);
    const searchParams = url.searchParams;
    const remoteConfigUrl = searchParams.get("t");
    return remoteConfigUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function getConfig(requestUrl) {
  try {
    const url = new URL(requestUrl);
    const searchParams = url.searchParams;
    const appleAppId = searchParams.get("apple");
    const googlePackageName = searchParams.get("google");
    const microsoftStoreId = searchParams.get("ms");
    return { appleAppId, googlePackageName, microsoftStoreId };
  } catch (error) {
    console.error(error);
    return {
      appleAppId: null,
      googlePackageName: null,
      microsoftStoreId: null,
    };
  }
}

export function getAppStoreUrl(config) {
  if (!config.appleAppId) {
    return null;
  }
  return `https://apps.apple.com/app/id${config.appleAppId}`;
}

export function getGooglePlayStoreUrl(config) {
  if (!config.googlePackageName) {
    return null;
  }
  return `https://play.google.com/store/apps/details?id=${config.googlePackageName}`;
}

export function getMicrosoftStoreUrl(config) {
  if (!config.microsoftStoreId) {
    return null;
  }
  return `https://www.microsoft.com/store/apps/${config.microsoftStoreId}`;
}
