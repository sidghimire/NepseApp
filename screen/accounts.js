import React, { useEffect,useState } from 'react';
import {Button, StyleSheet,Text,View,TextInput,TouchableOpacity} from 'react-native';
import * as SQLite from 'expo-sqlite'
import Icon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import AccountScreen from './accountscreen';
import AddShareScreen from './addsharescreen';
import UpdateShareScreen from './updatesharescreen';

function replaceAll(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}
const dataArray=[];

const StackNaviagtor=createStackNavigator();

const Accounts=({navigation})=>{
    const [isLoading, setLoading] = useState(true);

    const apihandler=async()=>{
        
    
        try{
            
            const url="http://127.0.0.1:5000/getnepse"
            const response=await fetch(url);
            const json=await response.json();
            const act=(resJson)=>{
                const title=['id','LTP','percent','high','low','open','qty']
                const count= Object.keys(resJson).length;
                var company={};
                var i=0;
                var j=0;
                for(i=0;i<count;i++){
                    var row=(resJson[i]);
                    var company={};

                    for(j=0;j<7;j++){
                        var word=JSON.stringify(row[title[j]]);
                        var str = replaceAll(word,'\"', '');
                        company[title[j]]=str.toString();
                    }
                    dataArray.push(company);
                }
            }
            act(json);
            
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        apihandler();
      }, []);
    if(dataArray.length==0){
        apihandler();
    }
    const BurgrIcon=()=>{
        return(<Icon name='menu-outline' style={styles.toggleButton} onPress={()=>navigation.toggleDrawer()} size={26}/>);
    }
    return(
        <StackNaviagtor.Navigator headerMode='screen' >
            <StackNaviagtor.Screen name="My Share" component={AccountScreen} options={{headerLeft:()=>(<BurgrIcon/>),headerStyle:{backgroundColor:'#000'},headerTintColor:'#fff'}} />
            <StackNaviagtor.Screen name="Add Share" component={AddShareScreen} options={{headerStyle:{backgroundColor:'#000'},headerTintColor:'#fff'}} />
            <StackNaviagtor.Screen name="Update Share" component={UpdateShareScreen} options={{headerStyle:{backgroundColor:'#000'},headerTintColor:'#fff'}} />
        </StackNaviagtor.Navigator>
    );
}


const styles = StyleSheet.create({
    toggleButton:{
        color:"#fff",
        marginLeft:14,
    }
  });


export default Accounts;