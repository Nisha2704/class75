import * as React from 'react';
import {Text, View,Image, TouchableOpacity, StyleSheet,TextInput,KeyboardAvoidingView} from 'react-native';
import firebase from 'firebase'
export default class LoginScreen extends React.Component{

    constructor(){
        super()
        this.state={
            emailId:"",
            password:""
        }
    }
    login= async(email,password)=>{
        if(email && password){
            try{
                const response = firebase.auth().signInWithEmailAndPassword(email, password)
            
            if(response){
                this.props.navigation.navigate('Transaction')
            }
        }
        catch(error){
            switch(error.code){
               case 'auth/user-not-found':
                alert("user doesn't exist")
                console.log("doesn't exist")
                break
               case 'auth/invalid-email':
                 alert('incorrect email or password')
                 console.log('invaild')
                 break
            }
        }
    }
    else{
        Alert.alert('enter email and password');
    }
    }

    render(){
        return(

            <KeyboardAvoidingView style = {{alignItem:"center",marginTop:20}} >
               <View>
                <Image
                source = {require("../assets/booklogo.jpg")}
                style = {{width:200,height:200}}/>
                <Text style = {{marginLeft:70,fontSize:30}}>Wily</Text>
                </View>
                <View>
                <TextInput style ={styles.loginbox}
                placeholder = "abc@gmail.com"
                keyboardType="email-address"
                onChangeText={(text)=>{
                    this.setState({
                        emailId:text
                    })
                }}
                />
                 <TextInput style ={styles.loginbox}
                 secureTextEntry = {true}
                placeholder = "enter password"
                
                onChangeText={(text)=>{
                    this.setState({
                        password:text
                    })
                }}
                />
                
                </View>
                <View>
                     <TouchableOpacity 
                     style= {{height:30,width:90,borderWidth:1,
                        marginTop:20,paddingTop:5,borderRadius:7,marginLeft:100}}
                        onPress ={()=>{
                          this.login(this.state.emailId,this.state.password)
                        }}>
                            <Text style = {{textAlign:"center"}}>Login</Text>
                      </TouchableOpacity>

                 </View>
           
            </KeyboardAvoidingView >
        )
    }



}

const styles= StyleSheet.create({
    loginbox:{
        width:300,
        height:40,
        borderWidth:1.5,
        fontSize:20,
        margin:10,
        paddingLeft:10

    }
})