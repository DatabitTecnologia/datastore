import PropTypes from 'prop-types';
import React from 'react';
import { Alert } from 'react-bootstrap';
import { ToastProvider, ToastConsumer } from 'react-toast-notifications';

const AlertMessage = ({ appearance, children, onDismiss }) => {
  return (
    <Alert variant={appearance} dismissible onClose={onDismiss}>
      {children}
    </Alert>
  );
};

AlertMessage.propTypes = {
  appearance: PropTypes.string,
  onDismiss: PropTypes.func,
  children: PropTypes.node
};

const BasicNotifications = (props) => {
  return (
    <React.Fragment>
      <ToastProvider components={{ Toast: AlertMessage }} placement={props.notification.placement}>
        <ToastConsumer>
          {({ add }) => {
            return (
              <span
                role="button"
                tabIndex="0"
                onKeyDown={() =>
                  add(props.notification.message, {
                    appearance: props.notification.variant,
                    autoDismiss: props.notification.autoDismiss
                  })
                }
                onClick={() =>
                  add(props.notification.message, {
                    appearance: props.notification.variant,
                    autoDismiss: props.notification.autoDismiss
                  })
                }
              >
                {props.children}
              </span>
            );
          }}
        </ToastConsumer>
      </ToastProvider>
    </React.Fragment>
  );
};

BasicNotifications.propTypes = {
  notification: PropTypes.object,
  placement: PropTypes.string,
  message: PropTypes.string,
  variant: PropTypes.string,
  autoDismiss: PropTypes.bool,
  children: PropTypes.node
};

export default BasicNotifications;
