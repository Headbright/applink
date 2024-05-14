// @ts-check

export async function getRemoteConfig(remoteUrl) {
  // fetch the schema from the remoteUrl

  const response = await fetch(remoteUrl);
  const schema = await response.json();

  return parseRemoteConfig(schema);
}

export function parseRemoteConfig(configJson) {
  if (configJson["@type"] !== "CreativeWorkSeries") {
    console.error("Invalid schema: expected @type to be CreativeWorkSeries");
    return {
      urlApple: null,
      urlGoogle: null,
      urlMicrosoft: null,
      urlFallback: null,
    };
  }

  const parts = (configJson["hasPart"] || []).filter(
    (part) =>
      part["@type"] === "SoftwareApplication" &&
      part["provider"] &&
      part["provider"]["@type"] === "Organization" &&
      part["potentialAction"] &&
      part["potentialAction"]["@type"] === "ViewAction" &&
      part["potentialAction"]["target"] &&
      part["potentialAction"]["target"]["urlTemplate"]
  );

  const apple = parts.find((part) => part["provider"]["name"] === "Apple");
  const google = parts.find((part) => part["provider"]["name"] === "Google");
  const microsoft = parts.find(
    (part) => part["provider"]["name"] === "Microsoft"
  );
  const fallback = parts.find((part) => part["provider"]["name"] === "Unknown");

  return {
    urlApple: apple ? apple["potentialAction"]["target"]["urlTemplate"] : null,
    urlGoogle: google
      ? google["potentialAction"]["target"]["urlTemplate"]
      : null,
    urlMicrosoft: microsoft
      ? microsoft["potentialAction"]["target"]["urlTemplate"]
      : null,
    urlFallback: fallback
      ? fallback["potentialAction"]["target"]["urlTemplate"]
      : null,
  };
}
