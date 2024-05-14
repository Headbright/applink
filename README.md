# AppLink.dev

![BSD-3](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg) ![GitHub Actions Workflow Status](https://github.com/Headbright/applink/actions/workflows/tests.yml/badge.svg)

A simple, privacy respecting service to create a link that redirects to the App Store, Google Play, or Microsoft Store based on the user's platform.

- [AppLink.dev](#applinkdev)
  - [Why do I need this?](#why-do-i-need-this)
  - [Usage](#how-it-works)
    - [Simple link](#simple-link)
    - [Applink Targets](#applink-targets)
  - [Platform detection](#platform-detection)
  - [Linux and Alternative Stores](#linux-and-alternative-stores)
  - [Store Badge](#store-badge)
  - [Fallback platform](#fallback)

## Why do I need this?

Consider a case where you have an app available on multiple platforms. You want to provide a single link that will redirect the user to the appropriate store based on their platform. AppLink.dev allows you to create such a link.

AppLink.dev is designed to execute entirely in the browser, without any server-side processing. This ensures that no data is collected or stored.

Of course, requesting the page may still expose the visitor's IP address to the server hosting the page.

Created with ❤️ by [Konstantin](https://github.com/kkostov).

## Usage

### Simple link

Applink supports parsing a URL with parameters to create a link that will redirect the user to the appropriate store based on their platform. This approach is less flexible that using [Applink Targets](#applink-targets).

The following link would redirect a user to their respective app store based on their platform:

```
https://applink.dev/?apple=6444602274&google=org.joinmastodon.android&ms=9ncbcszsjrsb
```

You need to include the platform-specific parameters in the URL:

- For the App Store, include your [app ID](https://developer.apple.com/documentation/storekit/skstoreproductviewcontroller/1502686-loadwithproductid):

`apple=1234`

- For Google Play, include your [app package name](https://developer.android.com/distribute/marketing-tools/linking-to-google-play#OpeningDetails):

`google=package-name`

- For the Microsoft Store, include your [app Store ID](https://learn.microsoft.com/en-us/windows/apps/publish/link-to-your-app):

`ms=app-id`

The same app ID will be used for all App Store platforms (iOS, macOS...).

### Applink Targets

A target is a link to a specific app store. A target definition includes one or more filter rules that determine which target should be used. The filter rules are based on the user's platform.

Targets are defined as JSON-LD objects that can be embedded on your website. This approach is more flexible than using [Simple link](#simple-link) as it allows the inclusion of query parameters to each store link as well support for custom app stores.

Example:

```json
{
  "@context": "http://schema.org",
  "@type": "CreativeWorkSeries",
  "hasPart": [
    {
      "@type": "SoftwareApplication",
      "provider": {
        "@type": "Organization",
        "name": "Apple"
      },
      "potentialAction": {
        "@type": "ViewAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://apps.apple.com/app/id12345"
        }
      }
    }
  ]
}
```

- At the root, define a [CreativeWorkSeries](https://schema.org/CreativeWorkSeries) under which you can define the `hasPart` property for each target.

- Each target is defined as a [SoftwareApplication](https://schema.org/SoftwareApplication) with the `provider` property set to the vendor's name. Currently, we can distinguish between `Apple`, `Google`, and `Microsoft`. More granular targeting based on the user's system are [currently in the works](https://github.com/Headbright/applink/issues/1).

- To define a url for this target, add a `potentialAction` property with a [ViewAction](https://schema.org/ViewAction) object that has a `url` property.

## Platform detection

Currently, the following platforms are supported:

| User agent platform         | Matching target "provider" | Store           |
| --------------------------- | -------------------------- | --------------- |
| Detected Apple device       | Apple                      | App Store       |
| Detected Google Play device | Google                     | Google Play     |
| Detected Windows device     | Microsoft                  | Microsoft Store |
| Unknown device              | Unknown                    | Fallback        |

Using the `provider` field you can add or more instances of `SoftwareApplication` which will be matched from first to last.

ℹ️ Detection of the browser and platform of the visitor can be quite tricky (especially if we consider older browsers). For now, detection is done explicitly only using the user agent string. This enables us to respect the user's choice if they have opted to modify the user agent string.

We strongly recommend that you include a fallback option so that users on unknown platforms are not left without a clear indication of what to do next.

```json
{
  "@type": "SoftwareApplication",
  "provider": {
    "@type": "Organization",
    "name": "Unknown"
  },
  "potentialAction": {
    "@type": "ViewAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.org"
    }
  }
}
```

### Linux and Alternative Stores

When using the applink target file definition, you're free to provide a link and badge to alternative stores and platforms. This can be useful for apps that are available on platforms like [F-Droid](https://f-droid.org/en/), [AltStore](https://altstore.io) and others.

To do so, use the `provider` field to match against one of the known platform values (e.g. Apple, Microsoft etc) and then provide a `potentialAction` and `image` appropriate for the store you're linking to.

```json
{
  "@context": "http://schema.org",
  "@type": "CreativeWorkSeries",
  "hasPart": [
    {
      "@type": "SoftwareApplication",
      "provider": {
        "@type": "Organization",
        "name": "F-Droid"
      },
      "potentialAction": {
        "@type": "ViewAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://f-droid.org/packages/org.joinmastodon.android/"
        }
      },
      "image": {
        "@type": "ImageObject",
        "url": "https://f-droid.org/badge/get-it-on.png",
        "cssStyle": "width: 150px; height: auto;"
      }
    }
  ]
}
```

### Fallback

_For Applink target_

If the user's platform is unknown, or none of the provided targets were a match we will display all available app store links with their corresponding badge.

If no targets are defined, we will display an error message. Please try to avoid this scenario as it will leave users without a clear indication of what to do next.

_For simple link_

If the user's platform is unknown, or none of the provided targets were a match we will display all available app store links with their corresponding badge.

- In case of a URL with parameters, we will provide some default badges for the App Store, Google Play, and Microsoft Store.

- In case of a schema-based target, we will provide a badge for each `SoftwareApplication` object with a defined `image` property.

![Screenshot showing all 3 store badges](/docs/screenshot-all-badges.png)

## Store Badge

For each target, we will display a badge with the store's logo. Each vendor has specific requirements which may evolve over time so we recommend checking their official guidelines. You can define the image to be shown using the `image` property which is of type [ImageObject](https://schema.org/ImageObject).

```json
{
  "image": {
    "@type": "ImageObject",
    "url": "http://example.com/images/app-store-badge.png",
    "cssStyle": "width: 150px; height: auto;"
  }
}
```

We support the following fields:

- `url` (required): The URL of the image.

- `cssStyle` (optional): The CSS style to append to the `img` tag (it will be added as an attribute like `<img ... style="..." />`)

- `width` (optional): The width of the image in pixels. If provided, we will add it as an attribute to the `img` tag.

- `height` (optional): The height of the image in pixels. If provided, we will add it as an attribute to the `img` tag.

⚠️ Targets without an image tag are ignored and will not be displayed.

## Roadmap

Feel free to check the [currently open issues](https://github.com/Headbright/applink/issues). If you have a suggestion or feature request, please open a new ticket 💜!

## Stack

- The component is built using [Vite](https://vitejs.dev) and tests are written using [Vitest](https://vitest.dev).

- The component is written in JavaScript and uses JSDoc for type checking enabled by adding `// @ts-check` at the start of every file. (This was inspired by [Kitten](https://codeberg.org/kitten/app#a-little-less-magic-a-little-more-type)).

- Since this is a static web page, there is no server-side processing.

### Why JavaScript?

The decision to build this as a JavaScript component was made to ensure that no data is collected or stored. The component runs entirely in the browser and does not require any server-side processing.

Type checking is done using JSDoc and TypeScript checks are enabled using `// @ts-check` which is more than enough for a small project like this.

## Deployment

As a static page, you can deploy this to any static hosting provider as described in the [Vite documentation](https://vitejs.dev/guide/static-deploy.html).
