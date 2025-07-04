import PropTypes from 'prop-types';
import React from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

const AnimatedModal = (props) => {
  return (
    <React.Fragment>
      <Rodal visible={props.visible} onClose={props.onClose} animation={props.animation}>
        {props.children}
      </Rodal>
    </React.Fragment>
  );
};

AnimatedModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  animation: PropTypes.bool,
  children: PropTypes.node
};

export default AnimatedModal;
