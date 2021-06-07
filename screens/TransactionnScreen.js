import * as React from 'react';
import {Text, View, TouchableOpacity, Button, Image, StyleSheet, TextInput, KeyboardAvoidingView, ToastAndroid, Alert} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config';

export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermissions:null,
            scanned:false,
            scannedData:'',
            buttonState:'normal',
            scannedBookId:'',
            scannedStudentId:'',
            transactionMessage:'',
        }
        
    }

    getCameraPermission = async (id) => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions:status==='granted',
            scanned:false,
            buttonState:id,
        })
    }

    handledBarCodeScanned = async({type,data})=>{
        const {buttonState} = this.state
        if(buttonState==="BookId"){
            this.setState({
                scanned:true,
                scannedBookId:data,
                buttonState:'normal',
            })
        }
        else        
        if(buttonState==="StudentId"){
            this.setState({
                scanned:true,
                scannedStudentId:data,
                buttonState:'normal',
            })
        }
        
    }

    handleTransaction = async()=>{
        var transactionMessage = null
        db.collection('books').doc(this.state.scannedBookId).get()
        .then((doc)=>{
            var book = doc.data()
            if(book.bookAvailability){
                this.initiateBookIssued()
                transactionMessage: "Book issued"
                ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
            }
            else{
                this.initiateBookReturn()
                transactionMessage: "Book returned"
                ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
            }
        })
        this.setState({
            transactionMessage: transactionMessage
        })            
    }

    initiateBookIssued = async()=>{
        db.collection('transaction').add({
            studentId: this.state.scannedStudentId,
            bookId: this.state.scannedBookId,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactiontype: 'Issued'
        })
        db.collection('books').doc(this.state.scannedBookId).update({
            'bookAvailability':false
        })
        db.collection('student').doc(this.state.scannedStudentId).update({
            'noofBooksIssued': firebase.firestore.FieldValue.increment(1)
        })
        Alert.alert('Book Issued')
        this.setState({
            scannedBookId:'',
            scannedStudentId:'',
        })
    }
    
    initiateBookReturn = async()=>{
        db.collection('transaction').add({
            studentId: this.state.scannedStudentId,
            bookId: this.state.scannedBookId,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactiontype: 'Return'
        })
        db.collection('books').doc(this.state.scannedBookId).update({
            'bookAvailability':true
        })
        db.collection('student').doc(this.state.scannedStudentId).update({
            'noofBooksIssued': firebase.firestore.FieldValue.increment(-1)
        })
        Alert.alert('Book Return')
        this.setState({
            scannedBookId:'',
            scannedStudentId:'',
        })
    }


    render(){
        const hasCameraPermissions = this.state.hasCameraPermissions
        const scanned = this.state.scanned
        const buttonState = this.state.buttonState
        if(buttonState!=='normal' && hasCameraPermissions){
            return(
                <BarCodeScanner
                onBarCodeScanned={
                    scanned?
                    undefined
                    : this.handledBarCodeScanned
                } 
                style={StyleSheet.absoluteFillObject}
                />
            );
        }
        else if(buttonState==='normal'){
           
        return(
            <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>

                <Image 
                style={{width:100, height:150, alignSelf:"center"}}
                source={require('../assets/booklogo.jpg')}
                />

               <View style={styles.inputView}>
                   <TextInput 
                   style={styles.inputBox}
                   placeholder="Book ID"
                   onChangeText={(text)=>
                       this.setState({
                        scannedBookId:text
                       })
                   }
                   value={this.state.scannedBookId}
                   />
                   <TouchableOpacity
                   style={styles.scanButton}
                   onPress={()=>{
                       this.getCameraPermission("BookId")
                   }}>
                       <Text style={styles.buttonText}>Scan</Text>
                   </TouchableOpacity>
               </View>

               
               <View style={styles.inputView}>
                   <TextInput 
                   style={styles.inputBox}
                   placeholder="Student ID"
                   onChangeText={(text)=>
                       this.setState({
                        scannedStudentId:text
                       })
                   }
                   value={this.state.scannedStudentId}
                   />
                   <TouchableOpacity
                   style={styles.scanButton}
                   onPress={()=>{
                       this.getCameraPermission("StudentId")
                   }}>
                       <Text style={styles.buttonText}>Scan</Text>
                   </TouchableOpacity>
               </View>
               
               <TouchableOpacity
                   style={styles.submitButton}
                   onPress={ async ()=>{
                       var transactionMessage = await this.handleTransaction()
                   }}>
                       <Text style={styles.submitbuttonText}>Submit</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        );
        }
    }
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    submitButton:{
      backgroundColor: 'orange',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
    },
    submitbuttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton:{
      backgroundColor: '#66BB6A',
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    }
  });