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

    handleTransaction = async () => {
        //verify if the student is eligible for book issue or return or none
        //student id exists in the database
        //issue : number of book issued < 2
        //issue: verify book availability
        //return: last transaction -> book issued by the student id
        var transactionType = await this.checkBookEligibility();
      console.log(transactionType)
        if (!transactionType) {
          alert("The book doesn't exist in the library database!");
          this.setState({
            scannedStudentId: "",
            scannedBookId: ""
          });
        } else if (transactionType === "Issue") {
          var isStudentEligible = await this.checkStudentEligibilityForBookIssue();
          if (isStudentEligible) {
            this.initiateBookIssue();
        alert("Book issued to the student!");
          }
        } else {
          var isStudentEligible = await this.checkStudentEligibilityForReturn();
          if (isStudentEligible) {
            this.initiateBookReturn();
            alert("Book returned to the library!");
          }
        }
      };
      checkBookEligibility = async () => {
        const bookRef = await db
          .collection("books")
          .where("bookId", "==", this.state.scannedBookId)
          .get();
        var transactionType = "";
        if (bookRef.docs.length == 0) {
          transactionType = false;
        } else {
          bookRef.docs.map(doc => {
            var book = doc.data();
            if (book.bookAvialable) {
              transactionType = "Issue";
            } else {
              transactionType = "Return";
            }
          });
        }
    
        return transactionType;
      };
    
      checkStudentEligibilityForBookIssue = async () => {
        const studentRef = await db
          .collection("student")
          .where("studentId", "==", this.state.scannedStudentId)
          .get();
        var isStudentEligible = "";
        if (studentRef.docs.length == 0) {
          this.setState({
            scannedStudentId: "",
            scannedBookId: ""
          });
          isStudentEligible = false;
          alert("The student id doesn't exist in the database!");
        } else {
          studentRef.docs.map(doc => {
            var student = doc.data();
            if (student.noOfBooksissued < 2) {
              isStudentEligible = true;
            } else {
              isStudentEligible = false;
              alert("The student has already issued 2 books!");
              this.setState({
                scannedStudentId: "",
                scannedBookId: ""
              });
            }
          });
        }
    
        return isStudentEligible;
      };
    
      checkStudentEligibilityForReturn = async () => {
        const transactionRef = await db
          .collection("transaction")
          .where("bookId", "==", this.state.scannedBookId)
          .limit(1)
          .get();
        var isStudentEligible = "";
        transactionRef.docs.map(doc => {
          var lastBookTransaction = doc.data();
          if (lastBookTransaction.studentId === this.state.scannedStudentId) {
            isStudentEligible = true;
          } else {
            isStudentEligible = false;
            alert("The book wasn't issued by this student!");
            this.setState({
              scannedStudentId: "",
              scannedBookId: ""
            });
          }
        });
        return isStudentEligible;
      };


    initiateBookIssued = async()=>{
        db.collection('transaction').add({
            studentId: this.state.scannedStudentId,
            bookId: this.state.scannedBookId,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactiontype: 'Issued'
        })
        db.collection('books').doc(this.state.scannedBookId).update({
            'bookAvialable':false
        })
        db.collection('student').doc(this.state.scannedStudentId).update({
            'noofBooksissued': firebase.firestore.FieldValue.increment(1)
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
            'bookAvialable':true
        })
        db.collection('student').doc(this.state.scannedStudentId).update({
            'noofBooksissued': firebase.firestore.FieldValue.increment(-1)
        })
        alert('Book Return')
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