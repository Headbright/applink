import { expect, test } from "vitest";
import { getConfig } from "./config";

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
