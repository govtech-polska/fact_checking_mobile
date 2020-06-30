import React, { Component } from 'react';
import {
  View,
  FlatList,
} from 'react-native';

import { VerifiedCell } from '../components';

const data = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 
  2, 
  3, 
  4, 
  5, 
  6, 
  7, 
  8,
];

class VerifiedScreen extends Component {

  drawCell = ({ index, item }) => {
    console.log('DrawCell text: ', item);
    console.log('DrawCell index: ', index);
    const verificationStatus = () => {
      if (index % 3 == 0) {
        return 'ok';
      } else if (index % 3 == 1) {
        return 'bad';
      } else {
        return 'not';
      }
    }

    return <VerifiedCell text={item} verificationStatus={verificationStatus()} />
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          data={data}
          renderItem={this.drawCell}
        />
      </View>
    );
  }
}

export default VerifiedScreen;
