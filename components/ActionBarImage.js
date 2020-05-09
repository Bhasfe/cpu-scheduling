import React from 'react';
import { Image } from 'react-native'

const logo = require('../assets/logo.png');
export const ActionBarImage = () => {
    return(
        <Image source={logo} resizeMode="contain" style={{flex:1,width:50,margin:10}} />
    );
}