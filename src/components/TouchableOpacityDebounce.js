import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import { debounce } from 'lodash';

class TouchableOpacityDebounce extends PureComponent {
  constructor(props) {
    super(props);
    this.onPress = debounce(this.onPress, 800, { leading: true, trailing: false });
  }

  onPress = () => this.props.onPress();

  render() {
    return (
      <TouchableOpacity
        {...this.props}
        onPress={this.onPress}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

export { TouchableOpacityDebounce };
