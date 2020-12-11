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

Create a `.env` for local development and a `.env.production` for production values.

## TODOs
- [x] Map Beyond Light bounties
- [x] Update filters for BL locations/activities
- [x] Add class name to tab headers
- [ ] Add quests
- [ ] Add triumphs
