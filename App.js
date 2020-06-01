import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import AppNavigator from './navigation/AppNavigator';
import { enableScreens } from 'react-native-screens';
import Colors from './constants/Colors'
const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

enableScreens();

export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }

  return (
      <>
        <StatusBar backgroundColor={Colors.red}  />
        <AppNavigator />
      </>
    );
}
