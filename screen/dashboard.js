import React from 'react';
import {Button,Image, StyleSheet,Text,TouchableOpacity,View} from 'react-native';
import Header from './smallfile/header';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SQLite from 'expo-sqlite'

const db=SQLite.openDatabase("db.sqlite");


const Dashboard=({navigation})=>{
/*
    db.transaction((txn)=>{
        var sql="DROP table shareRecord";
        txn.executeSql(
            sql,[],
            function(tx,res){
               console.log("Helo");
            }
        )

    })
  */  
    return(
        <View style={styles.container}>
            
            <View style={styles.view1Parent}>
                <View style={styles.view1}>
                    <View style={{flex:0.5}}>
                    <Image style={styles.tinyLogo} source={require("../images/avatar.png")} />
                    </View>
                    <View style={styles.view1Money}>
                        <Text style={styles.text2}>Net Worth</Text>
                        <Text style={styles.text3}>Rs. 2500000</Text>
                    </View>
                    <TouchableOpacity style={styles.view1More}>
                        <Icon name='chevron-forward-outline' style={styles.view1ViewMore} size={25}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                <Text style={styles.text4}>
                    Investment Tools
                </Text>
            </View>
            <View style={styles.view2Parent}>
                <TouchableOpacity style={styles.view2Child1} onPress={()=>navigation.navigate("Portfolio")}>
                   <Text style={styles.text5}>Your Portfolio</Text> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.view2Child1} onPress={()=>navigation.navigate("LiveMarket")}>
                   <Text style={styles.text5}>Live Market</Text> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.view2Child1}>
                   <Text style={styles.text5}>Stock Charts</Text> 
                </TouchableOpacity>
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#000"
    },
    text1:{
        color:'#fff',
        fontSize:30,
        fontWeight:'bold',
        letterSpacing:1,
        marginLeft:20
    },
    view1Parent:{
        padding:20
    },
    view1:{
        padding:30,
        backgroundColor:"#29292F",
        borderRadius:30,
        flexDirection:'row'
    },
    tinyLogo:{
        flex:1,
        width:50,
        height:50,
        margin:'auto'
    },
    view1Money:{
        flex:3,
        alignItems:'flex-start',
        paddingLeft:40
    },
    text2:{
        color:"#FF9346",
        fontSize:12,
        fontWeight:'200'
    },
    text3:{
        color:"#fff",
        fontSize:25,
        fontWeight:'bold'
    },
    view1More:{
        flex:0.5,
        alignSelf:'center'
    },
    view1ViewMore:{
        color:"#b0b0b0"
    },
    text4:{
        color:'#fff',
        fontSize:20,
        fontWeight:'bold',
        letterSpacing:1,
        margin:20,
        marginBottom:0
        
    },
    text5:{
        color:'#fff',
        fontSize:16,
        letterSpacing:1,
        justifyContent:'center',
        textAlign:'center',
    },
    view2Parent:{
        flexDirection:'row',
        padding:20
    },
    view2Child1:{
        flex:1,
        borderRadius:20,
        backgroundColor:"#42417d",
        marginHorizontal:5,
        color:"#fff",
        padding:20,
    }
  });
  

export default Dashboard;