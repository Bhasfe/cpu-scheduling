import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import AlgorithmScreen from '../screens/AlgorithmsScreen';
import SimulatorScreen from '../screens/SimulatorScreen';

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
        }
    }
})

export default createAppContainer(AppNavigator);
