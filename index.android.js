import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';

import App from './src/screens/App';

export default class PlanIt extends Component {
  render() {
    return (
      <App/>
    );
  }
}

AppRegistry.registerComponent('planit', () => PlanIt);
