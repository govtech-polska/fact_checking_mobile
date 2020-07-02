import React, { Component } from 'react';
import DropdownAlert from 'react-native-dropdownalert';

import DropDownHolder from './DropDownHolder';
import { strings } from '../constants/strings';

class DropDownAlert extends Component {

  static showError() {
    DropDownHolder.dropDown.alertWithType(
      'error',
      strings.error_general,
      '',
    );
  }

  render() {
    return (
      <DropdownAlert ref={(ref) => DropDownHolder.setDropDown(ref)} />
    );
  }
}

export default DropDownAlert;
