import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CSSMotion from 'rc-animate/es/CSSMotion';

const CookieConsent = ({ appName = 'Microreact', visible = true, policyLink, onAccept, className }) => (
  <CSSMotion visible={visible} transitionAppear removeOnLeave motionName="libmr">
    {(animation) => (
      <aside className={classnames('libmr-CookieConsent', className, animation.className)}>
        <div className="libmr-CookieConsent-message">
          <h2>We use cookies to give you the best online experience.</h2>
          <p>
            By using {appName}, you agree to our use of cookies in accordance with our cookie policy.
          </p>
          <div className="libmr-CookieConsent-actions">
            {policyLink}
            <button onClick={onAccept}>Accept</button>
          </div>
        </div>
      </aside>
    )}
  </CSSMotion>
);

CookieConsent.propTypes = {
  appName: PropTypes.string,
  className: PropTypes.string,
  onAccept: PropTypes.func,
  policyLink: PropTypes.node,
  visible: PropTypes.bool,
};

export default CookieConsent;
