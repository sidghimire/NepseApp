import React from 'react';
import { StyleSheet, Text, View,StatusBar, Button, SafeAreaView } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from './screen/dashboard.js';
import Portfolio from './screen/portfolio.js';
import LiveMarket from './screen/livemarket.js';
import Accounts from './screen/accounts.js';

const MainDrawer=createDrawerNavigator();

export default function App() {
  return (
    
      <DrawerNavigation></DrawerNavigation>
    

  );
}

const DrawerNavigation=()=>{
  return(
      <NavigationContainer>
        <StatusBar hidden />
        <MainDrawer.Navigator drawerContentOptions={{inactiveTintColor:'#fff',activeTintColor:"#fff",itemStyle: {padding:5}}} drawerStyle={styles.drawer} styles={styles.drawer} initialRouteName={Accounts}>
          <MainDrawer.Screen name="Accounts" component={Accounts} options={{headerShown:false}}/>
          <MainDrawer.Screen name="Dashboard" component={Dashboard} options={{headerShown:true,headerTintColor:'#fff',headerStyle:{backgroundColor:'#000',borderBottomColor:'#000'},headerTitleStyle:{fontSize:23,fontWeight:'bold',letterSpacing:1}}}/>
          <MainDrawer.Screen name="Portfolio" component={Portfolio} />
          <MainDrawer.Screen name="LiveMarket" component={LiveMarket} options={{headerShown:true,headerTintColor:'#fff',headerStyle:{backgroundColor:'#000',borderBottomColor:'#000'},headerTitleStyle:{fontSize:23,fontWeight:'bold',letterSpacing:1}}}/>
        </MainDrawer.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor:"#313131",
    paddingTop:30,
    color:"#fff",
    
  },
 
});
