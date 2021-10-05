import React, { useEffect,useState } from 'react';
import {Button, StyleSheet,Text,View,TextInput,TouchableOpacity,TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-community/picker';
import * as SQLite from 'expo-sqlite'


function replaceAll(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}

const dataArray=[];
const db=SQLite.openDatabase("db.sqlite");

const AddShareScreen=({navigation})=>{
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


    const [companyName,setCompanyName]=useState("");
    const [quantity,setQuantity]=useState('');
    const [buyingPrice,setBuyingPrice]=useState('');


    const [shareType,setShareType]=useState('');
    const [brokerRate,setBrokerRate]=useState('');

    const [primaryShare,setPrimaryShare]=useState("#ebebeb");
    const [secondaryShare,setSecondaryShare]=useState("#ebebeb");
    const changePrimaryShare=()=>{
        setPrimaryShare("#79bd77");
        setSecondaryShare("#ebebeb");
    }
    const changeSecondaryShare=()=>{
        setPrimaryShare("#ebebeb");
        setSecondaryShare("#79bd77");
    }


    const [newBroker,setNewBorker]=useState("#ebebeb");
    const [oldBroker,setOldBroker]=useState("#ebebeb");
    const changeOldBroker=()=>{
        setOldBroker("#79bd77");
        setNewBorker("#ebebeb")
    }
    const changeNewBroker=()=>{
        setOldBroker("#ebebeb");
        setNewBorker("#79bd77")
    }

    const createDb=(data)=>{
        db.transaction((txn)=>{
            txn.executeSql(
                "SELECT name from sqlite_master WHERE type='table' AND name='shareRecord'",
                [],
                function(tx,res){
                    console.log(res.rows.length);
                    if(res.rows.length==0){
                        txn.executeSql('DROP TABLE IF EXISTS shareRecord',[]);
                        txn.executeSql(
                            "CREATE TABLE IF NOT EXISTS shareRecord(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,quantity TEXT NOT NULL,buyingPrice TEXT NOT NULL,shareType TEXT NOT NULL,brokerRate TEXT NOT NULL)",[],function(tt,res){},function(tt,err){
                                console.log(err)
                                                            }
                                                        )
                        const sql="INSERT INTO shareRecord(name,quantity,buyingPrice,shareType,brokerRate) Values('"+data[0]+"','"+data[1]+"','"+data[2]+"','"+data[3]+"','"+data[4]+"')";
                        txn.executeSql(
                            sql,[],function(tt,res){},function(tt,err){
console.log(err)
                            }
                        )
                        
                    }else{
                        const sql="INSERT INTO shareRecord(name,quantity,buyingPrice,shareType,brokerRate) Values('"+data[0]+"','"+data[1]+"','"+data[2]+"','"+data[3]+"','"+data[4]+"')";
                        txn.executeSql(
                            sql,[],function(tt,res){},function(tt,err){
console.log(err)
                            }
                        )
                    }
                    alert("Share Has Been Added Successfully");
                    clearAllForm();
                    
                }
            )
            
        })
    }


    const clearAllForm=()=>{
        setCompanyName('');
        setQuantity('');
        setBuyingPrice('');
        setShareType('');
        setBrokerRate('');
        setSecondaryShare("#ebebeb");
        setPrimaryShare("#ebebeb");
        setNewBorker("#ebebeb");
        setOldBroker("#ebebeb");

    }


    const submitForm=()=>{
        const detail=[];
        detail[0]=companyName;
        detail[1]=quantity;
        detail[2]=buyingPrice;
        detail[3]=shareType;
        detail[4]=brokerRate;
        if(companyName==''){
            alert("Company Name Not Entered");
        }else{
            if(quantity==''){
                alert("Please Enter Quantity");
            }else{
                if(buyingPrice==''){
                    alert("Please Enter Buying Price");
                }else{
                    if(shareType==''){
                        alert("Please Enter Share Type");
                    }else{
                        if(brokerRate==''){
                            alert("Please Enter Broker Rate Type");
                        }else{
                            createDb(detail);
                        }
                    }
                }
            }
        }
    }

    return(
        <View style={styles.container}>
            <View style={styles.container}>
            <View style={{display:'flex',flexDirection:'column',padding:10,paddingTop:30}}>
                <View style={{display:'flex',flexDirection:'column',padding:10}}>
                    <Text style={{alignSelf:'flex-start',marginLeft:20,fontSize:16,color:'#404040'}}>Company Name</Text>
                    <View style={{ 
                        alignSelf:'center',
                        width:300, 
                        borderRadius:5,
                        borderColor:'#808080',
                        borderWidth:1}}>
                        <Picker style={styles.companyDropDown} selectedValue={companyName} onValueChange={(val)=>{setCompanyName(val)}} >
                            <Picker.Item label="Select Company" value="" />
                            <Picker.Item label="Random" value="Random" />

                            {
                                
                                dataArray.map((item,key)=>{
                                    return(
                                        <Picker.Item label={item.id} value={item.id} />
                                    )
                                })
                            }
                        </Picker>
                    </View>
                </View>
                <View style={{display:'flex',flexDirection:'column',padding:10}}>
                    <Text style={{alignSelf:'flex-start',marginLeft:20,fontSize:16,color:'#404040'}}>Quantity</Text>
                    <TextInput keyboardType="numeric" style={styles.textInput1} value={quantity} onChangeText={(val)=>{setQuantity(val)}} />
                
                </View>
                <View style={{display:'flex',flexDirection:'column',padding:10}}>
                    <Text style={{alignSelf:'flex-start',marginLeft:20,fontSize:16,color:'#404040'}}>Buying Price</Text>
                    <TextInput keyboardType="numeric" style={styles.textInput1} value={buyingPrice} onChangeText={(val)=>{setBuyingPrice(val)}} />
                </View>
                
                <View style={{display:'flex',flexDirection:'row'}}>
                    <TouchableHighlight underlayColor="#ebebeb" style={[styles.inactiveBtn,{backgroundColor:primaryShare}]} onPress={()=>{setShareType("Primary Share");changePrimaryShare()}}>
                        <Text>Primary Share</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#ebebeb" style={[styles.inactiveBtn,{backgroundColor:secondaryShare}]} onPress={()=>{setShareType("Secondary Share");changeSecondaryShare()}}>
                        <Text>Secondary Share</Text>
                    </TouchableHighlight>
                </View>
                <View style={{display:'flex',flexDirection:'row'}}>
                    <TouchableHighlight underlayColor="#ebebeb" style={[styles.inactiveBtn,{backgroundColor:newBroker}]} onPress={()=>{setBrokerRate("New Broker Rate");changeNewBroker()}}>
                        <Text>New Broker Rate</Text>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor="#ebebeb"  style={[styles.inactiveBtn,{backgroundColor:oldBroker}]} onPress={()=>{setBrokerRate("Old Broker Rate");changeOldBroker()}}>
                        <Text>Old Broker Rate</Text>
                    </TouchableHighlight>
                </View>
            </View>
            <View style={styles.addButtonDiv}>
                <TouchableOpacity onPress={()=>submitForm()} style={styles.addButton} >
                    <Text style={styles.addText}>Add</Text>
                </TouchableOpacity>
            </View>
            
        </View>
           
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff"
    },
    addButtonDiv:{
        marginTop:70,
        backgroundColor:'#000',
        borderRadius:150,
        alignItems:'center',
        alignSelf:'center',
        flexDirection:'row',
       
        
    },
    addButton:{
        padding:10,
        width:300,
        margin:'auto'

    },
    addText:{
        color:"#fff",
        alignSelf:'center',
        fontSize:20
    },companyDropDown:{
        width:300,
        padding:8,
        alignSelf:'flex-end',
        borderRadius:5,
        borderColor:'#606060',
        borderWidth:3,
    },
    textInput1:{
        width:300,
        padding:8,
        alignSelf:'center',
        borderRadius:5,
        borderColor:'#808080',
        borderWidth:1,

    },
    inactiveBtn:{
        alignItems:'center',
        alignSelf:"center",
        padding:10,
        borderColor:'#a3a3a3',
        borderWidth:0,
        flex:1,
        borderRadius:10,
        margin:15,
        
    },activeBtn:{
        alignItems:'center',
        alignSelf:"center",
        padding:10,
        borderColor:'#a3a3a3',
        borderWidth:0,
        flex:1,
        borderRadius:10,
        margin:15,
    }
  });
  
export default AddShareScreen;