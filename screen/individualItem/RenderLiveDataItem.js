import React from 'react';
import { StyleSheet, Text, View,StatusBar, Button, SafeAreaView, ScrollView } from 'react-native';

const RenderLiveDataItem=(props)=>{
        const dataList=props.nepseData.map((data)=>{
        var rawOpen=(data.LTP).replace(/,/g, '');
        var newOpen=Math.round(parseFloat(rawOpen)/(1+(parseFloat(data.percent)/100)));
        if(data.percent<0){
            return(
                <View style={styles.rowUnitRed}>
                    <Text style={styles.Text1c}>
                        {data.id}
                    </Text>
                    <Text style={styles.Text1c}>
                        {data.LTP}
                    </Text>
                    <Text style={styles.Text1}>
                        {data.percent}
                    </Text>
                    <Text style={styles.Text1}>
                        {(rawOpen-newOpen).toFixed(2)}
                    </Text>
                </View>
            );
        }else if(data.percent>0){
            return(
                <View style={styles.rowUnitGreen}>
                    <Text style={styles.Text1c}>
                        {data.id}
                    </Text>
                    <Text style={styles.Text1c}>
                        {data.LTP}
                    </Text>
                    <Text style={styles.Text1}>
                        {data.percent}
                    </Text>
                    <Text style={styles.Text1}>
                    {(rawOpen-newOpen).toFixed(2)}
                    </Text>
                </View>
            );
        }else{
            return(
                <View style={styles.rowUnitWhite}>
                    <Text style={styles.Text2c}>
                        {data.id}
                    </Text>
                    <Text style={styles.Text2c}>
                        {data.LTP}
                    </Text>
                    <Text style={styles.Text2}>
                        {data.percent}
                    </Text>
                    <Text style={styles.Text2}>
                    {(rawOpen-newOpen).toFixed(2)}
                    </Text>
                </View>
            );
        }  
        
    });
    return(
        <ScrollView style={{display:'flex',flexDirection:'column',flex:1}}>
            {dataList}
        </ScrollView>
    );   
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#000"
    },
    Text1:{
        color:'#fff',
        flex:1,
        fontSize:18,
    },
    Text1c:{
        color:'#fff',
        flex:1.5,
        fontSize:18,
        textAlign:'center'
    },
    Text2c:{
        color:'#000',
        flex:1.5,
        fontSize:18,
    },
    Text2:{
        color:'#000',
        flex:1,
        fontSize:20
    },
    rowUnitRed:{
        display:'flex',
        flexDirection:'row',
        padding:20,
        backgroundColor:"#A30000"
    },
    rowUnitGreen:{
        display:'flex',
        flexDirection:'row',
        padding:20,
        backgroundColor:"#087829"
    },
    rowUnitWhite:{
        display:'flex',
        flexDirection:'row',
        padding:20,
        backgroundColor:"#fff"
    }

});

export default RenderLiveDataItem;