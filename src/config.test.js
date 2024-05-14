import { expect, test } from "vitest";
import { getConfig, getRemoteConfigUrl } from "./config";

test("getRemoteConfigUrl('https://example.com?t=https://example.org')", () => {
  const result = getRemoteConfigUrl(
    "https://example.com?t=https://example.org"
  );
  expect(result).toBe("https://example.org");
});

test("getRemoteConfigUrl('https://example.com')", () => {
  const result = getRemoteConfigUrl("https://example.com");
  expect(result).toBeNull();
});

test("getRemoteConfigUrl('https://example.com?apple=123&google=456&ms=789')", () => {
  const result = getRemoteConfigUrl(
    "https://example.com?apple=123&google=456&ms=789"
  );
  expect(result).toBeNull();
});

test("getConfig('https://example.com?apple=123&google=456&ms=789')", () => {
  const result = getConfig("https://example.com?apple=123&google=456&ms=789");
  expect(result).toEqual({
    appleAppId: "123",
    googlePackageName: "456",
    microsoftStoreId: "789",
  });
});

test("getConfig('https://example.com?apple=123&google=456')", () => {
  const result = getConfig("https://example.com?apple=123&google=456");
  expect(result).toEqual({
    appleAppId: "123",
    googlePackageName: "456",
    microsoftStoreId: null,
  });
});

test("getConfig('https://example.com?apple=123')", () => {
  const result = getConfig("https://example.com?apple=123");
  expect(result).toEqual({
    appleAppId: "123",
    googlePackageName: null,
    microsoftStoreId: null,
  });
});

test("getConfig('https://example.com?')", () => {
  const result = getConfig("https://example.com?");
  expect(result).toEqual({
    appleAppId: null,
    googlePackageName: null,
    microsoftStoreId: null,
  });
});

test("getConfig('not a url')", () => {
  const result = getConfig("not a url");
  expect(result).toEqual({
    appleAppId: null,
    googlePackageName: null,
    microsoftStoreId: null,
  });
});
