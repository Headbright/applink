// @ts-check

// Intl.DateTimeFormat().resolvedOptions().timeZone

export async function resolveAndParseRemoteConfigToUrl(
  configRemoteUrl,
  platform,
  tz
) {
  const response = await fetch(configRemoteUrl);
  const configJson = await response.json();

  return parseRemoteConfig(configJson, platform, tz);
}

export function parseRemoteConfig(configJson, platform, tz) {
  if (configJson["@type"] !== "CreativeWorkSeries") {
    console.error("Invalid schema: expected @type to be CreativeWorkSeries");
    return null;
  }

  const targets = (configJson["hasPart"] || []).filter(
    (part) =>
      part["@type"] === "SoftwareApplication" &&
      part["provider"] &&
      part["provider"]["@type"] === "Organization" &&
      part["provider"]["name"] === platform &&
      part["potentialAction"] &&
      part["potentialAction"]["@type"] === "ViewAction" &&
      part["potentialAction"]["target"] &&
      part["potentialAction"]["target"]["urlTemplate"] // target url is required
  );

  if (targets.length === 0) {
    // check for a fallback with platform Unknown
    const fallback = (configJson["hasPart"] || []).filter(
      (part) =>
        part["@type"] === "SoftwareApplication" &&
        part["provider"] &&
        part["provider"]["@type"] === "Organization" &&
        part["provider"]["name"] === "Unknown" &&
        part["potentialAction"] &&
        part["potentialAction"]["@type"] === "ViewAction" &&
        part["potentialAction"]["target"] &&
        part["potentialAction"]["target"]["urlTemplate"] // target url is required
    )[0];
    return fallback
      ? fallback["potentialAction"]["target"]["urlTemplate"]
      : null;
  }

  // check for audience filtering
  let targetsWithAudience = targets.filter(
    (target) => target["audience"] && target["audience"]["@type"] === "Audience"
  );

  // check for a place filter
  let geographicAreaPlace = targetsWithAudience.filter((target) => {
    return (
      target["audience"]["geographicArea"] &&
      target["audience"]["geographicArea"]["@type"] === "Place"
    );
  });

  if (geographicAreaPlace.length > 0) {
    const place = determineGeographicAreaPlace(tz);

    if (place) {
      const matchingConfig = geographicAreaPlace.filter((target) => {
        return target["audience"]["geographicArea"]["name"] === place;
      })[0];
      console.log("match", matchingConfig);

      const url = matchingConfig["potentialAction"]["target"]["urlTemplate"];
      if (url) {
        return url;
      }
    }
  }

  // if we're here, it's a match on platform
  console.log("fallback:", targets[0]);
  return targets[0]["potentialAction"]["target"]["urlTemplate"];
}

function determineGeographicAreaPlace(tz) {
  if (
    [
      "Europe/Amsterdam",
      "Europe/Andorra",
      "Europe/Athens",
      "Europe/Berlin",
      "Europe/Bratislava",
      "Europe/Brussels",
      "Europe/Bucharest",
      "Europe/Budapest",
      "Europe/Busingen",
      "Europe/Copenhagen",
      "Europe/Dublin",
      "Europe/Gibraltar",
      "Europe/Helsinki",
      "Europe/Lisbon",
      "Europe/Ljubljana",
      "Europe/Luxembourg",
      "Europe/Madrid",
      "Europe/Malta",
      "Europe/Mariehamn",
      "Europe/Monaco",
      "Europe/Paris",
      "Europe/Prague",
      "Europe/Riga",
      "Europe/Rome",
      "Europe/San_Marino",
      "Europe/Sofia",
      "Europe/Stockholm",
      "Europe/Tallinn",
      "Europe/Vatican",
      "Europe/Vienna",
      "Europe/Vilnius",
      "Europe/Warsaw",
      "Europe/Zagreb",
      "Europe/Zurich",
      "Africa/Ceuta",
      "Asia/Famagusta",
      "Atlantic/Canary",
      "Atlantic/Madeira",
      "Asia/Nicosia",
    ].includes(tz)
  ) {
    return "European Union";
  }

  return null;
}
