import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {Button, SafeAreaView, StyleSheet,Text,View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';


const Header=()=>{
    const navigation=useNavigation();
return(
    <SafeAreaView style={styles.container}>
        <Icon name='menu-outline' style={styles.toggleButton} onPress={()=>navigation.toggleDrawer()} size={25}/>
    </SafeAreaView>
);
}

const styles=StyleSheet.create({
    container:{
        paddingVertical:0,
        backgroundColor:"#fff",
        alignItems:'flex-start',
        paddingHorizontal:25,
        backgroundColor:'#000',
        
    },
    toggleButton:{
        color:'#fff',
        margin:20
    }
});

export default Header;