import { expect, test } from "vitest";
import { parseRemoteConfig } from "./remoteConfig.js";

test("parseRemoteConfig({ '@type': 'SoftwareApplication' })", () => {
  const result = parseRemoteConfig({ "@type": "NotASoftwareApplication" });
  expect(result).toBeNull();
});

test("parseRemoteConfig({ '@type': 'SoftwareApplication', 'hasPart': [] })", () => {
  const result = parseRemoteConfig({
    "@type": "SoftwareApplication",
    hasPart: [],
  });
  expect(result).toBeNull();
});

test("parse example examples/applink_iOS_Android.jsonld", () => {
  const result = parseRemoteConfig(
    require("../examples/applink_iOS_Android.json"),
    "Apple"
  );
  expect(result).toEqual("https://apps.apple.com/app/id12345");
});

test("parse example examples/applink_iOS_Android.jsonld", () => {
  const result = parseRemoteConfig(
    require("../examples/applink_iOS_Android.json"),
    "Google"
  );
  expect(result).toEqual("https://play.google.com/store/apps/details?id=12345");
});

test("parse examples/with_fallback.json", () => {
  const result = parseRemoteConfig(
    require("../examples/with_fallback.json"),
    "Custom"
  );
  expect(result).toEqual("https://example.org");
});

test("parse examples/with_audience.json matching audience", () => {
  const result = parseRemoteConfig(
    require("../examples/with_audience.json"),
    "Apple",
    "Europe/Brussels"
  );
  expect(result).toEqual("https://apps.apple.com/app/eu12345");
});

test("parse examples/with_audience.json not matching audience", () => {
  const result = parseRemoteConfig(
    require("../examples/with_audience.json"),
    "Apple",
    "Moon/CoordinatedLunarTime"
  );
  expect(result).toEqual("https://apps.apple.com/app/id12345");
});
