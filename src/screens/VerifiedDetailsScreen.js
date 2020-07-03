import React, { Component } from 'react';
import {
  View,
} from 'react-native';

class VerifiedDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    console.log('VerifiedDetailsScreen didMount')
  }

  render() {
    console.log('VerifiedDetailsScreen props: ', this.props);
    return <View style={{ flex: 1, backgroundColor: 'yellow' }} />
  }
}

export default VerifiedDetailsScreen;
