import React, { useEffect } from 'react';
import {Button, StyleSheet,Text,View,TextInput,TouchableOpacity} from 'react-native';
import Header from './smallfile/header';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Accounts from './accounts';
import Icon from 'react-native-vector-icons/Ionicons';

import * as SQLite from 'expo-sqlite'
import { useState } from 'react/cjs/react.development';

const db=SQLite.openDatabase("db.sqlite");

const createDb=()=>{
    db.transaction((txn)=>{
        txn.executeSql(
            "SELECT name from sqlite_master WHERE type='table' AND name='login'",
            [],
            function(tx,res){
                if(res.rows.length==0){
                    txn.executeSql('DROP TABLE IF EXISTS login',[]);
                    txn.executeSql(
                        "CREATE TABLE IF NOT EXISTS login(password TEXT NOT NULL)",[]
                    )
                    txn.executeSql(
                        "INSERT INTO login(password) Values('000')"
                    )
                    
                } 
            }
        )
        
    })
}

const StackNavigator=createStackNavigator();



const Portfolio=({navigation})=>{
        
    createDb();
    const [password,setPassword]=useState("");
    
    const LoginPage=()=>{
        return(
    <View style={styles.container}>
                <Text style={styles.text4}>
                    Enter Password To Join
                </Text>
                <View style={styles.loginFieldDiv}>
                    <TextInput autoFocus={true} placeholder="Password..." style={styles.textInput} value={password} onChangeText={value=>{setPassword(value)}}>
    
                    </TextInput>
                </View>
                <View style={styles.loginFieldDiv}>
                    <TouchableOpacity style={styles.view2Child1} onPress={()=>checkPassword(password)}>
                        <Text style={styles.text5}>Login</Text> 
                    </TouchableOpacity>
                </View>
                <View style={styles.resetPasswordDiv}>
                    <TouchableOpacity>
                        <Text style={styles.text5}>Reset Password</Text> 
                    </TouchableOpacity>
                </View>
                
            </View>
        );
    }

    const BurgrIcon=()=>{
        return(<Icon name='menu-outline' style={styles.toggleButton} onPress={()=>navigation.toggleDrawer()} size={26}/>);
    }

    function checkPassword(password){
        
        db.transaction((txn)=>{
            var sql="SELECT password FROM login WHERE password='"+password+"'";
            txn.executeSql(
                sql,[],
                function(tx,res){
                    if(res.rows.length>0){
                        
                        setPassword("");
                        navigation.navigate("Accounts");

                    }else{
                        alert("Wrong Password");
                    }
                }
            )
        })
    
    }
       
    return(
            <StackNavigator.Navigator headerMode='screen'>
                <StackNavigator.Screen name="Login" component={LoginPage} options={{headerLeft:()=>(<BurgrIcon/>), headerTintColor:"#fff" ,headerStyle:{backgroundColor:"#000",borderBottomColor:"#000"},headerTitleStyle:{fontSize:23,fontWeight:'bold',letterSpacing:1}}}/>
                <StackNavigator.Screen name="Accounts"  component={Accounts} options={ {headerTitle:"My Share", headerTintColor:"#fff" ,headerStyle:{backgroundColor:"#000",borderBottomColor:"#000"},headerTitleStyle:{fontSize:23,fontWeight:'bold',letterSpacing:1}}}/>
            </StackNavigator.Navigator>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#000",
        paddingTop:100,
    },
    text1:{
        color:'#fff'
    },
    textLarge:{
        color:'#fff',
        fontSize:30,
        fontWeight:'bold',
        letterSpacing:1,
        marginLeft:20,
        marginBottom:40,
        paddingBottom:20,
        textAlign:'center'
    },
    text4:{
        color:'#fff',
        fontSize:20,
        letterSpacing:1,
        margin:20,
        marginBottom:0,
        textAlign:'center'

    },
    textInput:{
        backgroundColor:"#fff",
        color:"#000",
        width:300,
        alignSelf:'center',
        padding:20,
        fontSize:18,
        borderRadius:20
    },
    loginFieldDiv:{
        padding:30
    },
    view2Child1:{
        borderRadius:20,
        backgroundColor:"#42417d",
        color:"#fff",
        padding:20,
        width:250,
        alignSelf:'center'
    },
    text5:{
        color:'#fff',
        fontSize:16,
        letterSpacing:1,
        justifyContent:'center',
        textAlign:'center',
    },
    resetPasswordDiv:{
        flex:1,
        bottom:0
    },
    toggleButton:{
        color:"#fff",
        marginLeft:14,
    }
  });
  

export default Portfolio;