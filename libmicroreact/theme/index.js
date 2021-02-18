import { lightenDarken, alpha } from './colorFunctions';

const theme = {
  primaryColour: '',
  primaryColourTint: '',
  primaryColourShade: '',
  primaryColourAlpha: '',
  primaryColourAlphaLight: '',
  primaryColourAlphaMedium: '',
  primaryColourAlphaDark: '',
};

export default theme;

export function applyTheme(properties) {
  for (const [ key, value ] of Object.entries(properties)) {
    theme[key] = value;

    if (key === 'primaryColour') {
      theme.primaryColourTint = lightenDarken(value, 10);
      theme.primaryColourShade = lightenDarken(value, -10);
      theme.primaryColourAlpha = alpha(value, 0.14);
      theme.primaryColourAlphaLight = alpha(value, 0.14);
      theme.primaryColourAlphaMedium = alpha(value, 0.54);
      theme.primaryColourAlphaDark = alpha(value, 0.87);
    }

    /* ensure alpha and alphaLight are the same for compat */
    if (key === 'primaryColourAlpha') {
      theme.primaryColourAlphaLight = value;
    }
    if (key === 'primaryColourAlphaLight') {
      theme.primaryColourAlpha = value;
    }
  }

  const styleTag = document.querySelector('#libmr-theme') || document.createElement('style');
  styleTag.id = 'libmr-theme';
  styleTag.type = 'text/css';
  styleTag.innerHTML = `
  :root {
    --libmr-primary-colour: ${theme.primaryColour};
    --libmr-primary-colour-tint: ${theme.primaryColourTint};
    --libmr-primary-colour-shade: ${theme.primaryColourShade};
    --libmr-primary-colour-alpha: ${theme.primaryColourAlphaLight};
    --libmr-primary-colour-alpha-light: ${theme.primaryColourAlphaLight};
    --libmr-primary-colour-alpha-medium: ${theme.primaryColourAlphaMedium};
    --libmr-primary-colour-alpha-dark: ${theme.primaryColourAlphaDark};
  }
`;
  document.head.appendChild(styleTag);
}
