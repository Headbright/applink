# AppLink.dev

![BSD-3](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg) ![GitHub Actions Workflow Status](https://github.com/Headbright/applink/actions/workflows/tests.yml/badge.svg)

A simple, privacy respecting service to create a link that redirects to the App Store, Google Play, or Microsoft Store based on the user's platform.

Consider a case where you have an app available on multiple platforms. You want to provide a single link that will redirect the user to the appropriate store based on their platform. AppLink.dev allows you to create such a link.

AppLink.dev is designed to execute entirely in the browser, without any server-side processing. This ensures that no data is collected or stored.

Of course, requesting the page may still expose the visitor's IP address to the server hosting the page.

You're welcome to self-host the page or use the hosted version at [applink.dev](https://applink.dev). Please note that the hosted version may be taken down at any time.

Created with ❤️ by [Konstantin](https://github.com/kkostov).

## Usage

To create an applink, you will need to include the platform-specific parameters in the URL.

- For the App Store, include your [app ID](https://developer.apple.com/documentation/storekit/skstoreproductviewcontroller/1502686-loadwithproductid):

`apple=app-id`

- For Google Play, include your [app package name](https://developer.android.com/distribute/marketing-tools/linking-to-google-play#OpeningDetails):

`google=package-name`

- For the Microsoft Store, include your [app Store ID](https://learn.microsoft.com/en-us/windows/apps/publish/link-to-your-app):

`ms=app-id`

For example, an applink including all 3 platofrms would look like this:

```
http://applink.dev/?apple=6444602274&google=org.joinmastodon.android&ms=9ncbcszsjrsb
```

## Platform detection

Currently, the following platforms are supported:

- App Store
- Google Play
- Microsoft Store

Note: We're explicitly only using the user agent to detect the platform. This enables us to respect the user's choice if they have opted to modify the user agent string.

Note: The same app ID will be used for all App Store platforms (iOS, macOS...).

## Roadmap

- [ ] (in progress) Add support for adding a campaign id to the URL
- [ ] Add support for more advanced rules for each platform (iOS, macOS, iPadOS, visionOS, tvOS, etc)

## Stack

- The component is built using [Vite](https://vitejs.dev) and tests are written using [Vitest](https://vitest.dev).

- The component is written in JavaScript and uses JSDoc for type checking enabled by adding `// @ts-check` at the start of every file. (This was inspired by [Kitten](https://codeberg.org/kitten/app#a-little-less-magic-a-little-more-type)).

- Since this is a static web page, there is no server-side processing.

## Deployment

As a static page, you can deploy this to any static hosting provider as described in the [Vite documentation](https://vitejs.dev/guide/static-deploy.html).
