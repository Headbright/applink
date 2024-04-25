// @ts-check

function platformAppStore(userAgent) {
  return (
    !userAgent.toLowerCase().includes("android") &&
    !userAgent.toLowerCase().includes("win") &&
    !userAgent.toLowerCase().includes("armv7l") &&
    (userAgent.toLowerCase().includes("mac") ||
      userAgent.toLowerCase().includes("apple"))
  );
}

function platformGooglePlay(userAgent) {
  return (
    userAgent.toLowerCase().includes("android") &&
    userAgent.toLowerCase().includes("linux")
  );
}

function platformWindowsStore(userAgent) {
  return userAgent.toLowerCase().includes("win");
}

export function detectPlatform(userAgent) {
  if (platformAppStore(userAgent)) {
    return "App Store";
  } else if (platformGooglePlay(userAgent)) {
    return "Google Play";
  } else if (platformWindowsStore(userAgent)) {
    return "Microsoft Store";
  }

  return "Unknown";
}
