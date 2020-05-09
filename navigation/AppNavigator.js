import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer,StatusBar } from 'react-navigation';

import AlgorithmScreen from '../screens/AlgorithmsScreen';
import SimulatorScreen from '../screens/SimulatorScreen';

import Colors from '../constants/Colors';


const AppNavigator = createStackNavigator({
    Algorithms : {
        screen: AlgorithmScreen
    },
    Simulator : {
        screen : SimulatorScreen
    }
},{
    defaultNavigationOptions : {
        headerTitleStyle : {
            fontFamily : 'open-sans',
        },
        headerBackTitleStyle : {
            fontFamily : 'open-sans',
        },
        headerTintColor:'#fff',
        headerStyle: {
            backgroundColor:Colors.red,
            shadowColor : '#5bc4ff',
            shadowOpacity: 0,
            shadowOffset: {
            height: 0,
            },
            shadowRadius: 0,
            elevation: 0
        }
    }
})

export default createAppContainer(AppNavigator);
