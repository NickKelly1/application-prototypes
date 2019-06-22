import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Provider extends Component {
  getChildContext = () => ({ store: this.props.children })

  render() {
    return this.props.children;
  }
}

Provider.childContextTypes = {
  store: PropTypes.object,
};

export default Provider;
