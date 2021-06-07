import * as React from 'react';
import {Text, View, TouchableOpacity, Button, Image, StyleSheet} from 'react-native';

export default class SearchScreen extends React.Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>Home</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"aliceblue",
        justifyContent:"center",
        alignItems:"center",
        padding:100,
    }
})