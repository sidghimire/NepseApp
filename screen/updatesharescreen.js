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
const recordArray=[];
const db=SQLite.openDatabase("db.sqlite");
function getRecordDetail(recordId){
    db.transaction((txn)=>{
        var sql="SELECT * from shareRecord where id='"+recordId+"'";
        txn.executeSql(
            sql,[],
            function(tx,res){
                var item=res.rows.item(0);
                recordArray.push(item.id,item.name,item.quantity,item.buyingPrice,item.shareType,item.brokerRate);    
            }
        )

    })
    console.log(recordArray);
}
const AddShareScreen=({route,navigation})=>{
    const [isLoading, setLoading] = useState(true);
    const [savedData,setSavedData]=useState();
    const saveData=[];
    var recordId=route.params.id;
    
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
    const [companyName,setCompanyName]=useState("");
    const [quantity,setQuantity]=useState('');
    const [buyingPrice,setBuyingPrice]=useState('');


    const [shareType,setShareType]=useState('');
    const [brokerRate,setBrokerRate]=useState('');
    
    useEffect(() => {
        getRecordDetail(recordId);
        apihandler();
      }, []);
    if(dataArray.length==0){
        apihandler();
    }
    console.log(recordArray[1]);

    const updateDb=(data)=>{
        db.transaction((txn)=>{
            txn.executeSql(
                "SELECT name from sqlite_master WHERE type='table' AND name='shareRecord'",
                [],
                function(tx,res){
                    const sql="UPDATE shareRecord SET quantity='"+data[1]+"',buyingPrice='"+data[2]+"' where id='"+recordId+"'";
                    txn.executeSql(
                        sql,[],function(tt,res){},function(tt,err){
                            console.log(err)
                        }
                    )
                    alert("Share Has Been Updated Successfully");
                    clearAllForm();
                    
                }
            )
            
        })
    }


    const clearAllForm=()=>{
        setCompanyName('');
        setQuantity('');
        setBuyingPrice('');
    }
    if(shareType == "Primary Share"){
        setShareType("Primary Share");
        changePrimaryShare();
    }else if(shareType == "Primary Share"){
        setShareType("Secondary Share");
        changeSecondaryShare();
    }else{

    }

    if(brokerRate == "New Broker Rate"){
        setBrokerRate("New Broker Rate");changeNewBroker()
    }else if(brokerRate == "Old Broker Rate"){
        setBrokerRate("Old Broker Rate");changeOldBroker()
    }else{
        
    }
    const submitForm=()=>{
        const detail=[];
        detail[0]=companyName;
        detail[1]=quantity;
        detail[2]=buyingPrice;
        
            if(quantity==''){
                alert("Please Enter Quantity");
            }else{
                if(buyingPrice==''){
                    alert("Please Enter Buying Price");
                }else{
                    updateDb(detail);
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
                        <Text style={styles.companyDropDown} >
                            {recordArray[1]}
                        </Text>
                    </View>
                </View>
                <View style={{display:'flex',flexDirection:'column',padding:10}}>
                    <Text style={{alignSelf:'flex-start',marginLeft:20,fontSize:16,color:'#404040'}}>Quantity : {recordArray[2]}</Text>
                    <TextInput keyboardType="numeric" style={styles.textInput1} value={quantity} onChangeText={(val)=>{setQuantity(val)}} />
                
                </View>
                <View style={{display:'flex',flexDirection:'column',padding:10}}>
                    <Text style={{alignSelf:'flex-start',marginLeft:20,fontSize:16,color:'#404040'}}>Buying Price: {recordArray[3]}</Text>
                    <TextInput keyboardType="numeric" style={styles.textInput1} value={buyingPrice} onChangeText={(val)=>{setBuyingPrice(val)}} />
                </View>
                
            </View>
            <View style={styles.addButtonDiv}>
                <TouchableOpacity onPress={()=>submitForm()} style={styles.addButton} >
                    <Text style={styles.addText}>Update</Text>
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