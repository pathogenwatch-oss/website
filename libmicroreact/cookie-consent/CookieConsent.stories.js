import React from 'react';

import { action } from '@storybook/addon-actions';

import CookieConsent from './index';
import Container from './Container.react';

export default {
  title: 'Site/Cookie Consent',
};

export const WithoutProps = () => <CookieConsent />;

export const WithPolicyLink = () => <CookieConsent policyLink={<a>Read our policy</a>} />;

export const WithAppName = () => (
  <CookieConsent appName="Pathogenwatch" policyLink={<a>Read our policy</a>} />
);

export const WithCloseAction = () => (
  <CookieConsent
    appName="Pathogenwatch"
    policyLink={<a>Read our policy</a>}
    onAccept={action('accepted')}
  />
);

export const WorkingExample = () => (
  <Container>
    <CookieConsent appName="Pathogenwatch" policyLink={<a>Read our policy</a>} />
  </Container>
);
