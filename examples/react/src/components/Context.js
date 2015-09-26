import React from 'react';
import _ from 'lodash';

class Context extends React.Component {
  static childContextTypes = {
    hairdresser: React.PropTypes.object.isRequired,
  }

  getChildContext() {
    return _.mapValues(Context.childContextTypes, (value, key) => {
      return this.props[key];
    });
  }

  render() {
    return this.props.children();
  }
}

export default Context;
