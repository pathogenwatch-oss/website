# WGSA Front End

The User-facing portion of WGSA.

## Example configuration
```json
{
  "api": {
    "address": "localhost:8080"
  },
  "pusherKey": "...",
  "mapboxKey": "...",
  "maxFastaFlieSize": 4,
  "wiki": "https://raw.githubusercontent.com/wiki/ImperialCollegeLondon/wgsa-documentation",
  "strategies": [ "facebook", "google", "twitter" ],
  "whyDidYouUpdate": false
}
```
Using `localhost:8080` will load a static collection for development when a server is unavailable.
