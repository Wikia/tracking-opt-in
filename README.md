# tracking-opt-in

FANDOM's gdpr opt-in dialog prompt.

## Installation
Using yarn:
```
yarn add @wikia/tracking-opt-in
```

## Usage
The library exports one function that can be invoked to kickoff the process of showing the modal, or calling the appropriate callbacks if the user has already accepted or rejected tracking. The library is built using webpack's [`libraryTarget: "umd"`](https://webpack.js.org/configuration/output/#module-definition-systems) option, so it should be usable in any of our projects.

## Integration Test
* An integration test can be run for any client by adding a additional build to their pipeline: [Pipeline Syntax](http://jenkins:8080/view/CAKE/view/tracking-opt-in/job/external%20test/pipeline-syntax/)
* If you do not integrate with with Jenkins you can ping a url `http://jenkins:8080/view/CAKE/view/tracking-opt-in/job/external%20test/buildWithParameters?token=tracking-opt-in-external-test&testUrl=<url>&slackChannel=<slack channel>&projectName=<your app>`
* Params
    * `token` = tracking-opt-in-external-test (no need to change)
    * `testUrl` = publicly accessible url where the selenium tests will target
    * `projectName` = A unique per app name to organize each integration test
    * `testIE` = (Optional - defaults to true) Enable ie11 tests

### Examples
As es6 module:
```javascript
import main from '@wikia/tracking-opt-in'
...
const optIn = main(options)
```

As script tag:
```html
<script src="..."></script>
...
<script>
var optIn = trackingOptIn.main(options)
</script>
```

Invocation of the exported function returns an instance of `TrackingOptIn`. See below for the available functions.

### Options
The following options are accepted:
- `beaconCookieName` - The name of the beacon cookie that'll be added to tracking calls
- `cookieName` - The name of the cookie used for the user's tracking consent status. Should only be changed for development purposes. defaults to `tracking-opt-in-status`.
- `cookieExpiration` - How long the consent cookie should last when the user accepts consent. Defaults to 50 years.
- `cookieRejectExpiration` - How long the reject cookie should last when the user rejects. Defaults to 1 days.
- `country` - Override the country code for determining the country the user is visiting from. Defaults to reading from the `Geo` cookie that should be available in all of our web apps.
- `countriesRequiringPrompt` - array of country codes that require tracking opt-in. See [`GeoManager`](https://github.com/Wikia/tracking-opt-in/blob/master/src/GeoManager.js) for the defaults.
- `language` - Override the language used to display the dialog text. Defaults to `window.navigator.language` if available, otherwise to `en`.
- `preventScrollOn` - Prevent scrolling on the specified element when the dialog is shown. Can be either an element or query selector passed to `document.querySelector`. Defaults to `'body'`, set to `null` to prevent this behavior.
- `queryParam` - The name of the query param to forcefully set the accepted status. Defaults to `tracking-opt-in-status` and accepts the string values `true` or `false` (e.g `http://starwars.wikia.com/?tracking-opt-in-status=true`)
- `track` - whether to track impressions and user consent/rejections. Defaults to `true`.
- `zIndex` - Useful if elements on the app are appearing above the overlay/modal. Defaults to `1000`.
- `onAcceptTracking` - The callback fired when:
  - the user's geo does not require tracking consent
  - the user accepts tracking
  - the user has already accepted tracking (subsequent page load)
- `onRejectTracking` - the callback fired when:
  - the user rejects tracking
  - the user has already rejected tracking (subsequent page load)

#### Notes
- `onAcceptTracking` and `onRejectTracking` are the key options that should be overridden by each app to either initialize their respective trackers or to somehow react to the user's rejection of tracking.
- Country codes are in [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) format.

### TrackingOptIn class
Calling the exported function returns an instance of the [`TrackingOptIn`](https://github.com/Wikia/tracking-opt-in/blob/master/src/TrackingOptIn.js) class. The class has the following functions:
- `hasUserConsented()` - returns `true` if the user has accepted tracking (or does not need to based on their geo), `false` if they have explicitly rejected tracking, and `undefined` if the user has neither consented or rejected tracking.
- `geoRequiresTrackingConsent()` - returns `true` if the user's geo requires consent, `false` otherwise.
- `reset()` - clears the opt-in cookie and runs through the rendering rules again.
- `clear()` - clears the opt-in cookie
- `render()` - runs through the rendering rules and either renders the opt-in prompt or calls the appropriate `onAcceptTracking`/`onRejectTracking` callbacks.


## Local Development
### Installation
```
$> yarn install
```
### Running demo site
```
$> yarn start
```

Open up http://localhost:3000. Webpack HMR should update the app as you develop.

The main entry point is `src/index.js`.

### Running Tests
To run a single pass over the tests:
```
$> yarn test
```

To run the tests in watch mode so that changes re-run the tests:
```
$> yarn test:watch
```

### Selenium Testing
FANDOM uses BrowserStack to assist our automated testing efforts. [![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=ZXArSDQvQlk4VjBaOStIcmszYXRuaXpISDAxUHpFanRnSHl5K04va3dMTT0tLVRmblMvY1NEY3JUQTJ3WkhKaE82a3c9PQ==--24c381c7955b4e15f80c34c5b7870490500f5c5b)](https://www.browserstack.com/automate/public-build/ZXArSDQvQlk4VjBaOStIcmszYXRuaXpISDAxUHpFanRnSHl5K04va3dMTT0tLVRmblMvY1NEY3JUQTJ3WkhKaE82a3c9PQ==--24c381c7955b4e15f80c34c5b7870490500f5c5b)<a href="http://www.browserstack.com"><img valign="middle" width="150" src="https://bstacksupport.zendesk.com/attachments/token/ojYZjNWZsYGIGhzwWlxeeoEPT/?name=browserstack-logo-600x315.png"></a>

