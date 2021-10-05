import React, { useEffect,useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {Button, StyleSheet,ActivityIndicator,Text,View,TextInput,TouchableOpacity,ScrollView, SafeAreaView, FlatList, Modal, Touchable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as SQLite from 'expo-sqlite'



function replaceAll(str, find, replace) {
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}

const dataArray=[];
const db=SQLite.openDatabase("db.sqlite");



const AccountScreen=({navigation})=>{
    const [isLoading, setLoading] = useState(true);
    const [selectedId,setSelectedId]=useState();

    const apihandler=async()=>{
        try{
            const url="http://127.0.0.1:5000/getnepse"
            const response=await fetch(url);
            const json=await response.json();
            const act=(resJson)=>{
                const title=['id','LTP','percent','high','low','open','qty']
                const count= Object.keys(resJson).length;
                var company=[];
                var i=0;
                var j=0;
                for(i=0;i<count;i++){
                    var row=(resJson[i]);
                    var company=[];

                    for(j=0;j<7;j++){
                        var word=JSON.stringify(row[title[j]]);
                        var str = replaceAll(word,'\"', '');
                        company.push(str.toString());
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
    
    const [savedData,setSavedData]=useState();
    const saveData=[];
    function getData(){
        db.transaction((txn)=>{
            var sql="SELECT * FROM shareRecord";
            txn.executeSql(
                sql,[],
                function(tx,res){
                    for(var i=0;i<res.rows.length;i++){
                        let item=res.rows.item(i);
                        
                        saveData.push({id:item.id,name:item.name,quantity:item.quantity,buyingPrice:item.buyingPrice,shareType:item.shareType,brokerRate:item.brokerRate});
                        
                    }
                    setSavedData(saveData);
                }
            )

        })
        
    }       
    function deleteRecord(id){
        
        db.transaction((txn)=>{
            console.log(id);
            var sql="Delete from shareRecord where id='"+id+"'";
            console.log(sql);
            txn.executeSql(
                sql,[],
                function(tx,res){
                    setModalVisible(!modalVisible)
                }
            )
    
        })
    } 
    getData();
    const [modalVisible,setModalVisible]=useState(false);
    const [totalShare,setTotalShare]=useState(0);
    const [totalInvestment,setTotalInvestment]=useState(0);
    const [totalWorth,setTotalWorth]=useState(0);
    const [totalNetWorth,setTotalNetWorth]=useState(0);
    const [totalProfit,setTotalProfit]=useState(0);
    var totalShareCount=0;
    var totalInvestmentCount=0;
    var totalWorthCount=0;
    var totalProfitCount=0;
    return(
        <View style={styles.container}>
            <View style={{flex:1,flexDirection:'column'}}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                    setModalVisible(!modalVisible);
                    }}>
                    <View elevation={5} style={styles.modal}>
                        <TouchableOpacity style={styles.closeIcon}>
                            <Icon name='close-outline' size={30} onPress={()=>setModalVisible(!modalVisible)} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={()=>{setModalVisible(!modalVisible);navigation.navigate('Update Share',{id:selectedId})}} >
                            <Text>Update Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={()=>{deleteRecord(selectedId)}}>
                            <Text>Delete Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton}>
                            <Text>Add To Watchlist</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <View style={{flex:1,display:'flex',flexDirection:'row'}}>
                    <View style={{display:'flex',flexDirection:'column',padding:20,paddingTop:10,paddingBottom:5,paddingRight:0}}>
                        <Text style={styles.topInfoText}>Total Shares: </Text>
                        <Text style={styles.topInfoText}>Total Investment: </Text>
                        <Text style={styles.topInfoText}>Total Worth: </Text>
                        <Text style={styles.topInfoText}>Net Worth: </Text>
                        <Text style={styles.topInfoText}>Total Profit/Loss: </Text>
                        <Text style={styles.topInfoText}>Today's Profit/Loss: </Text>
                    </View>
                    <View style={{display:'flex',flexDirection:'column',padding:5,paddingTop:10,paddingBottom:5,}}>
                        <Text style={styles.topInfoText}>{totalShare}</Text>
                        <Text style={styles.topInfoText}>{totalInvestment}</Text>
                        <Text style={styles.topInfoText}>{totalWorth}</Text>
                        <Text style={styles.topInfoText}>{totalNetWorth}</Text>
                        <Text style={styles.topInfoText}>{totalProfit}</Text>
                        <Text style={styles.topInfoText}></Text>
                    </View>
                </View>
                <View style={{flex:2}}>
                    <View style={{display: 'flex',flexDirection:'row',padding:15,paddingBottom:0}}>
                        <Text style={styles.tableLabel}>Symbol</Text>
                        <Text style={styles.tableLabel}>Buying</Text>
                        <Text style={styles.tableLabel}>Quantity</Text>
                        <Text style={styles.tableLabel}>Worth</Text>
                        <Text style={styles.tableLabel}>Profit/Loss</Text>
                    </View>
                    {isLoading?<ActivityIndicator size="large" color="#000"/>:(
                    <FlatList data={savedData} extraData={[dataArray]} renderItem={({item})=>{
                        var currentPrice;
                        

                        if(dataArray.length>0){
                            for(var i=0;i<dataArray.length;i++){
                                if(dataArray[i][0]==item.name){
                                    currentPrice=dataArray[i][1];
                                }
                            }
                            totalShareCount+=parseInt(item.quantity);
                            setTotalShare(totalShareCount);
                            totalInvestmentCount+=parseInt(item.quantity)*parseInt(item.buyingPrice);
                            setTotalInvestment(totalInvestmentCount);
                            totalWorthCount+=parseInt(item.quantity)*parseInt(currentPrice);
                            setTotalWorth(totalWorthCount);
                            totalProfitCount+=parseInt(item.buyingPrice)*parseInt(item.quantity)-currentPrice*parseInt(item.quantity);
                            setTotalProfit(totalProfitCount);
                            
                            if(currentPrice*item.quantity>item.buyingPrice*item.quantity){
                                //setTotalShare(totalShareCount);
                                return(
                                        <TouchableOpacity style={styles.shareInfoContainer} onLongPress={()=>{setModalVisible(true),setSelectedId(item.id)}}>
                                            <View style={styles.smallDiv1}>
                                                <Text style={[styles.shareText2,{fontWeight:'bold',flexDirection:'column'}]}>{item.name}{"\n"}{parseInt(currentPrice)}</Text>
                                            </View>
                                            <View style={styles.smallDiv1}>
                                                <Text style={styles.shareText2}>{parseInt(item.buyingPrice)}</Text>
                                            </View>
                                            <View style={styles.smallDiv1}>
                                                <Text style={styles.shareText2}>{item.quantity}</Text>
                                            </View>
                                            <View style={styles.smallDiv1}>
                                                <Text style={styles.shareText2}>{parseInt(currentPrice)*item.quantity}</Text>
                                            </View>
                                            <View style={styles.smallDiv1}>
                                                <Text style={styles.shareText2}>{parseInt(currentPrice)*item.quantity-item.buyingPrice*item.quantity}</Text>
                                            </View>
                                        </TouchableOpacity>
                                );
                            }else{
                                return(
                                    <TouchableOpacity style={styles.shareInfoContainer2} onLongPress={()=>{setModalVisible(true),setSelectedId(item.id)}}>
                                        <View style={styles.smallDiv1}>
                                            <Text style={[styles.shareText1,{fontWeight:'bold'}]}>{item.name}{"\n"}{currentPrice}</Text>
                                        </View>
                                        <View style={styles.smallDiv1}>
                                            <Text style={styles.shareText1}>{item.buyingPrice}</Text>
                                        </View>
                                        <View style={styles.smallDiv1}>
                                            <Text style={styles.shareText1}>{item.quantity}</Text>
                                        </View>
                                        <View style={styles.smallDiv1}>
                                            <Text style={styles.shareText1}>{currentPrice*item.quantity}</Text>
                                        </View>
                                        <View style={styles.smallDiv1}>
                                            <Text style={styles.shareText1}>{item.buyingPrice*item.quantity-currentPrice*item.quantity}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        
                        }
                        return;
                    }}>
                    
                    </FlatList>
                    )}
                </View>
            </View>    
            <View style={styles.refreshDiv}>
                <TouchableOpacity style={styles.refreshWord}>
                    <Icon name='add' style={styles.refreshIcon} size={30} onPress={()=>navigation.navigate('Add Share')} />
                </TouchableOpacity>
                
            </View>
            <View style={styles.refreshDiv2}>
                <TouchableOpacity style={styles.refreshWord}>
                    <Icon name='refresh' style={styles.refreshIcon} size={30} onPress={()=>{setLoading(true);apihandler()}}/>
                </TouchableOpacity>
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    shareInfoContainer:{
        flexDirection:'row',
        backgroundColor:'#087829',
        margin:15,
        marginBottom:0,
        marginTop:5
    },
    shareInfoContainer2:{
        flexDirection:'row',
        backgroundColor:'#A30000',
        margin:15,
        marginBottom:0,
        marginTop:5
    },

    smallDiv1:{
        flex:1,
        paddingTop:20,
        paddingBottom:20,
        textAlign:'center',
    },
    shareText1:{
        textAlign:'center',
        color:'#fff'
    },
    shareText2:{
        textAlign:'center',
        color:'#fff'
    },
    container:{
        flex:1,
        backgroundColor:"#fff"
    },
    text1:{
        color:'#000'
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
        margin:'auto',
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
        margin:'auto'
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
    refreshDiv:{
        position:'absolute',
        top:20,
        right:20,
        backgroundColor:'#000',
        borderRadius:150,
    },
    refreshDiv2:{
        position:'absolute',
        top:100,
        right:20,
        backgroundColor:'#000',
        borderRadius:150,
    },
    refreshWord:{
        padding:15
    },
    refreshIcon:{
        color:"#fff",
        alignSelf:'center'
    },
    topInfoText:{
        flex:1,
        fontSize:15,
        padding:5,
        marginVertical:3,
        paddingLeft:10,
        paddingRight:10,
        color:'#000',
        backgroundColor:'#DBDBDB',
        textAlign:'center'
    },
    tableLabel:{
        flex:1,
        backgroundColor:'#373737',
        paddingVertical:10,
        fontSize:16,
        textAlign:'center',
        color:'#fff'
    },
    modal:{
        padding:20,
        backgroundColor:"#fff",
        alignSelf:'center',
        marginTop:'auto',
        marginBottom:'auto',
        width:300,
        height:500,
        borderColor:'#AEAEAE',
        borderWidth:2
    },
    closeIcon:{
        marginLeft:'auto',
        
    },
    modalButton:{
        padding:15,
        backgroundColor:'#E8E8E8',
        marginVertical:5,
        fontSize:16
    }
  });
  
export default AccountScreen;