# tracking-opt-in

FANDOM's gdpr opt-in dialog prompt and FANDOM's event based DWH tracking library.

## Installation
Using yarn:
```
yarn add @wikia/tracking-opt-in
```

## Access npmjs
Access the npmjs.com UI through [vault](https://wikia-inc.atlassian.net/wiki/spaces/OPS/pages/132317429/Vault+For+Engineers) key `vault read secret/app/npmjs`.

## Usage
The library exports one function that can be invoked to kickoff the process of showing the modal, or calling the appropriate callbacks if the user has already accepted or rejected tracking. The library is built using webpack's [`libraryTarget: "umd"`](https://webpack.js.org/configuration/output/#module-definition-systems) option, so it should be usable in any of our projects.

Library also provides a mechanism for registering events to be sent to DWH. All events must have the following properties:
* `name`
* `platform`
* `env`

The `name` property is used as path pointing to DWH table. If it is set to `view` or `pageview` it will be sent to `__track/view` path that logs events to `facts_pageview_events` table.
In other cases it will be just concatenated with `__track/special/` prefix.
The `platform` and `env` parameters could be set once using main entry options of the same name.

The library usage is simple. Just push the event to queue:

`(window.fandomTrackingEventsQueue = window.fandomTrackingEventsQueue || []).push({ name: 'gdpr_events', env: 'prod', platform: 'UP', ...});`

The same could be done via queue object:

`import TrackingEventsQueue from "@wikia/trackingOptIn/tracking/TrackingEventsQueue";`
`TrackingEventsQueue.get(window).push({ name: 'gdpr_events', env: 'prod', platform: 'UP', ... });`

This tracker is integrated with GDPR consent modal and is using queue to gather events before the consent for tracking is given.
The queue size is bounded to 1000 events.
After the consent is given tracker flushes itself, sends all queued events and switches to immediate flush mode.

All tracking events require common parameters including tracking session and beacons.
Those are also handled internally by the library. They are read from cookies or generated using provided function.
The detailed list of common tracking parameters, and cookies used to store their values, is available in
`./src/tracking/cookie-config.js` and `./src/tracking/tracking-params-config.js`.

Tracker send events to DWH by default.
You can attach or change the default sender by adding an option `trackingEventsSenders` to the `main` kick off method.
If you want to add additional sender please don't forget to add the `DataWarehouseEventsSedner` to the list as this options overrides the default one.

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

Invocation of the exported function returns an instance of `ConsentManagementPlatform`. See below for the available functions.

### Options
The following options are accepted:

- `cookieName` - The name of the cookie used for the user's tracking consent status. Should only be changed for development purposes. defaults to `tracking-opt-in-status`.
- `cookieExpiration` - How long the consent cookie should last when the user accepts consent. Defaults to 50 years.
- `cookieRejectExpiration` - How long the reject cookie should last when the user rejects. Defaults to 1 days.
- `country` - Override the country code for determining the country the user is visiting from. Defaults to reading from the `Geo` cookie that should be available in all of our web apps.
- `countriesRequiringPrompt` - Array of country codes that require tracking opt-in. See [`GeoManager`](https://github.com/Wikia/tracking-opt-in/blob/master/src/GeoManager.js) for the defaults.
- `disableConsentQueue` - If true then CMP will return fully opted-out consent string before user accept or reject the modal without queuing the commands
- `enabledVendorPurposes` - Array of purpose IDs to be allowed on opt-in. See the [IAB CMP specification](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/CMP%20JS%20API%20v1.1%20Final.md) for details. Defaults to all standard purposes.
- `enabledVendors` - Array of vendor IDs to be allowed on opt-in. See the [IAB CMP specification](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/CMP%20JS%20API%20v1.1%20Final.md) for details. Defaults to a list of all of Fandom's vendors who are partnered with IAB.
- `isSubjectToCcpa` - Used to opt-out of sale users who are below 16 y.o.
- `isSubjectToCoppa` - Same as `isSubjectToCcpa`. Takes precendence over `isSubjectToCcpa`. Left for backwards compatibility.
- `language` - Override the language used to display the dialog text. Defaults to `window.navigator.language` if available, otherwise to `en`.
- `preventScrollOn` - Prevent scrolling on the specified element when the dialog is shown. Can be either an element or query selector passed to `document.querySelector`. Defaults to `'body'`, set to `null` to prevent this behavior.
- `queryParam` - The name of the query param to forcefully set the accepted status. Defaults to `tracking-opt-in-status` and accepts the string values `true` or `false` (e.g `http://starwars.wikia.com/?tracking-opt-in-status=true`)
- `track` - Whether to track impressions and user consent/rejections. Defaults to `true`.
- `zIndex` - Useful if elements on the app are appearing above the overlay/modal. Defaults to `1000`.
- `onAcceptTracking` - The callback fired when:
  - the user's geo does not require tracking consent
  - the user accepts non-IAB vendor tracking
  - the user has already accepted tracking (subsequent page load)
- `onRejectTracking` - The callback fired when:
  - the user rejects non-IAB vendor tracking
  - the user has already rejected tracking (subsequent page load)
- `isCurse` - Optional boolean that generates a different privacy link on curse products

#### Notes
- `onAcceptTracking` and `onRejectTracking` are the key options that should be overridden by each app to either initialize their respective trackers or to somehow react to the user's rejection of tracking.
- As of v2.0.0, accepting or rejecting _vendor tracking_ should not affect any GA or internal tracking unrelated to advertising.
- Country codes are in [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) format.

### ConsentManagementPlatform class
Calling the exported function returns an instance of the [`ConsentManagementPlatform`](https://github.com/Wikia/tracking-opt-in/blob/master/src/TrackingOptIn.js) class. The class has the following functions:

- `hasUserConsented()` - Returns `true` if the user has accepted _non-IAB_ vendor tracking (or does not need to based on their geo), `false` if they have explicitly rejected tracking, and `undefined` if the user has neither accepted nor rejected tracking.
- `geoRequiresTrackingConsent()` - Returns `true` if the user's geo requires consent, `false` otherwise.
- `reset()` - Clears the opt-in cookie and runs through the rendering rules again.
- `clear()` - Clears the opt-in cookie
- `render()` - Runs through the rendering rules and either renders the opt-in prompt or calls the appropriate `onAcceptTracking`/`onRejectTracking` callbacks.


## Local Development
### Installation
```
$> yarn install
```
### Running demo site
```
$> yarn start:dev
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
FANDOM uses BrowserStack to assist our automated testing efforts.
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=ZXArSDQvQlk4VjBaOStIcmszYXRuaXpISDAxUHpFanRnSHl5K04va3dMTT0tLVRmblMvY1NEY3JUQTJ3WkhKaE82a3c9PQ==--24c381c7955b4e15f80c34c5b7870490500f5c5b)](https://www.browserstack.com/automate/public-build/ZXArSDQvQlk4VjBaOStIcmszYXRuaXpISDAxUHpFanRnSHl5K04va3dMTT0tLVRmblMvY1NEY3JUQTJ3WkhKaE82a3c9PQ==--24c381c7955b4e15f80c34c5b7870490500f5c5b)<a href="http://www.browserstack.com"><img valign="middle" width="150" src="https://bstacksupport.zendesk.com/attachments/token/ojYZjNWZsYGIGhzwWlxeeoEPT/?name=browserstack-logo-600x315.png"></a>

To run the selenium tests locally first run `yarn start:prod` in one terminal then, in a separate terminal, run `BROWSERSTACK_KEY=<browser-stack> BROWSERSTACK_USERNAME=<username> USE_TUNNEL=true yarn test:selenium`


