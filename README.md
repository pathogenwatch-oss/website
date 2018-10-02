# Pathogenwatch Front-end

The money-maker.

## Example configuration
```json
{
  "api": {
    "address": "localhost:8080"
  },
  "pusherKey": "...",
  "mapboxKey": "...",
  "maxGenomeFileSize": 20,
  "strategies": [ "facebook", "google", "twitter" ],
  "whyDidYouUpdate": false
}
```
Using `localhost:8080` will load a static collection for development when a server is unavailable.
