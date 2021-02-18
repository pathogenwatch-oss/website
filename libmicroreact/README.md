# Libmicroreact

A component library created by the [Centre for Genomic Pathogen Surveillance](http://pathogensurveillance.net).

[Go to the public site](https://cgps.gitlab.io/libmicroreact)

## Theming

**A theme must be applied for components to work correctly**

Colours should be in hex or rgba format:
```
import { applyTheme } from '@cgps/libmicroreact/theme';

applyTheme({
  primaryColour: '#ff0000' // required
  primaryColourShade: '#e60000', // generated from primaryColour, can be overwritten
  primaryColourAlpha: 'rgba(255, 0, 0, 0.14)', // generated from primaryColour, can be overwritten
});
```
