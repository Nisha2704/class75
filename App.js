import * as React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import SearchScreen from './screens/SearchScreen';
import TransactionScreen from './screens/TransactionnScreen';
import LoginScreen from './screens/LoginScreen';
export default class App extends React.Component {
  render(){
  return(
    <AppContainer />
    );
  }
}

const TabNavigator = createBottomTabNavigator({
  Search : {screen:SearchScreen, 
    navigationOptions:{tabBarIcon:({tintColor})=>(
      <Image 
      source={require('./assets/searchingbook.png')}
      resizeMode='contain'
      style={{width:30, height:30}} />
    )}},
  Transaction : {screen:TransactionScreen, 
    navigationOptions:{tabBarIcon:({tintColor})=>(
      <Image 
      source={require('./assets/book.png')}
      resizeMode='contain'
      style={{width:30, height:30}} />
    )}},
    
})
const switchNavigator = createSwitchNavigator({
  LoginScreen:{screen:LoginScreen},
  TabNavigator:{screen:TabNavigator}
})

const AppContainer = createAppContainer(switchNavigator)

