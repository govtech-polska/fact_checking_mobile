import React from 'react';
import { useHeaderHeight } from '@react-navigation/stack';

// HoC for components without hooks
// for functional component useHeaderHeight can be used directly
// https://github.com/react-navigation/react-navigation/issues/2411
export const withHeaderHeight = (Component) => {
  const WithHeaderHeightComp = (props) => {
    const height = useHeaderHeight();
    return <Component headerHeight={height} {...props} />;
  };

  WithHeaderHeightComp.displayName = `withHeaderHeight(${
    Component.displayName || Component.name
  }`;
  return WithHeaderHeightComp;
};
