import './theme.stories.css';

import React from 'react';

export default {
  title: 'Theming',
};

export const Colours = () => (
  <div className="libmr-Theme">
    <h2>Solid</h2>
    <section className="libmr-Theme-swatches">
      <article className="libmr-Theme-swatch">
        <div style={{ background: 'var(--libmr-primary-colour)' }} />
        <code>
          theme.primaryColour
          <br />
          var(--libmr-primary-colour)
        </code>
      </article>
      <article className="libmr-Theme-swatch">
        <div style={{ background: 'var(--libmr-primary-colour-tint)' }} />
        <code>
          theme.primaryColourTint
          <br />
          var(--libmr-primary-colour-tint)
        </code>
      </article>
      <article className="libmr-Theme-swatch">
        <div style={{ background: 'var(--libmr-primary-colour-shade)' }} />
        <code>
          theme.primaryColourShade
          <br />
          var(--libmr-primary-colour-shade)
        </code>
      </article>
    </section>
    <h2>Alpha</h2>
    <section className="libmr-Theme-swatches">
      <article className="libmr-Theme-swatch">
        <div style={{ background: 'var(--libmr-primary-colour-alpha-light)' }} />
        <code>
          theme.primaryColourAlphaLight
          <br />
          var(--libmr-primary-colour-alpha-light)
        </code>
      </article>
      <article className="libmr-Theme-swatch">
        <div style={{ background: 'var(--libmr-primary-colour-alpha-medium)' }} />
        <code>
          theme.primaryColourAlphaMedium
          <br />
          var(--libmr-primary-colour-alpha-medium)
        </code>
      </article>
      <article className="libmr-Theme-swatch">
        <div style={{ background: 'var(--libmr-primary-colour-alpha-dark)' }} />
        <code>
          theme.primaryColourAlphaDark
          <br />
          var(--libmr-primary-colour-alpha-dark)
        </code>
      </article>
    </section>
    <h2>Deprecated</h2>
    <section className="libmr-Theme-swatches">
      <article className="libmr-Theme-swatch">
        <div style={{ background: 'var(--libmr-primary-colour-alpha)' }} />
        <code>
          theme.primaryColourAlpha
          <br />
          var(--libmr-primary-colour-alpha)
        </code>
      </article>
    </section>
  </div>
);
