import { expect, test } from "vitest";
import { parseRemoteConfig } from "./remoteConfig.js";

test("parseRemoteConfig({ '@type': 'SoftwareApplication' })", () => {
  const result = parseRemoteConfig({ "@type": "NotASoftwareApplication" });
  expect(result).toEqual({
    urlApple: null,
    urlGoogle: null,
    urlMicrosoft: null,
    urlFallback: null,
  });
});

test("parseRemoteConfig({ '@type': 'SoftwareApplication', 'hasPart': [] })", () => {
  const result = parseRemoteConfig({
    "@type": "SoftwareApplication",
    hasPart: [],
  });
  expect(result).toEqual({
    urlApple: null,
    urlGoogle: null,
    urlMicrosoft: null,
    urlFallback: null,
  });
});

test("parse example examples/applink_iOS_Android.jsonld", () => {
  const result = parseRemoteConfig(
    require("../examples/applink_iOS_Android.json")
  );
  expect(result).toEqual({
    urlApple: "https://apps.apple.com/app/id12345",
    urlGoogle: "https://play.google.com/store/apps/details?id=12345",
    urlMicrosoft: null,
    urlFallback: null,
  });
});

test("parse examples/with_fallback.json", () => {
  const result = parseRemoteConfig(require("../examples/with_fallback.json"));
  expect(result).toEqual({
    urlApple: "https://apps.apple.com/app/id12345",
    urlGoogle: "https://play.google.com/store/apps/details?id=12345",
    urlMicrosoft: null,
    urlFallback: "https://example.org",
  });
});
