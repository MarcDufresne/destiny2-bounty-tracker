# D2 Bounty Tracker Webapp

## Env Setup

1. Globally install `vue-cli`
1. In `webapp` run, `npm install`
1. Then `npm run serve`

## Build Prod Release

Run `npm run build`

## Env Vars

```.env
VUE_APP_API_KEY=API_KEY_FROM_BUNGIE
VUE_APP_OAUTH_CLIENT_ID=123456
VUE_APP_OAUTH_CLIENT_SECRET=Secret.Key.From.Bungie
```

## TODOs

- Add refresh token support
- Make mapping file dynamic
- Make definitions dynamic, and/or create a script to update them(?)
