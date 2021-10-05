import React,{ useState,useEffect } from 'react';
import {StyleSheet,Text,View,ActivityIndicator,TouchableOpacity} from 'react-native';
import RenderLiveDataItem from './individualItem/RenderLiveDataItem';
import Icon from 'react-native-vector-icons/Ionicons';

function replaceAll(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}
    const dataArray=[];
    

    
const LiveMarket=({navigation})=>{
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
   
    return(
        <View style={styles.container}>
                <View style={styles.rowUnit}>
                    <Text style={styles.text1}>
                        Symbol
                    </Text>
                    <Text style={styles.text1}>
                        LTP
                    </Text>
                    <Text style={styles.text1}>
                        Percent 
                    </Text>
                    <Text style={styles.text1}>
                        Change
                    </Text>
                </View>
                {isLoading?<ActivityIndicator size="large" color="#fff"/>:(<RenderLiveDataItem nepseData={dataArray} style={{flex:1}}/>)}

                <View style={styles.refreshDiv}>
                    <TouchableOpacity style={styles.refreshWord} onPress={()=>{setLoading(true);apihandler()}}>
                        <Icon name='refresh' style={styles.view1ViewMore} size={35}/>

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
    textLarge:{
        color:'#fff',
        fontSize:30,
        fontWeight:'bold',
        letterSpacing:1,
        marginLeft:20,
        flex:1,
        paddingBottom:20,
        textAlign:'center'
    },
    text1:{
        color:'#fff',
        fontSize:18,
        letterSpacing:1,
        marginLeft:20,
        flex:1
    },
    rowUnit:{
        display:'flex',
        flexDirection:'row',
        padding:10,
        paddingTop:20,
        paddingBottom:20,
        backgroundColor:"#212121"
    },
    refreshDiv:{
        position:'absolute',
        bottom:20,
        right:20,
        backgroundColor:'#fff',
        borderRadius:150,
    },
    refreshWord:{
        padding:15
    },
    text5:{
        fontSize:16
    }

  });
  

export default LiveMarket;