import * as React from 'react';
import {Text, View, TouchableOpacity, StyleSheet,TextInput,FlatList} from 'react-native';
import firebase from 'firebase'
import db from '../config';

export default class SearchScreen extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            allTransaction:[],
            lastVisibleTransaction:null,
            search:" "

        }
    }


    searchTransaction = async(searchText)=>{
       var searchText = searchText.toUpperCase()
      var first_alphabet = searchText.split("")[0]

      if(first_alphabet == "B"){
          const transactions = await db.collection("transaction")
          .where("bookId", '==', searchText)
          .limit(5)
          .get()
          transactions.docs.map(doc=>{
           this.setState({
               allTransaction:[...this.state.allTransaction,doc.data()],
               lastVisibleTransaction:doc
           })
          })

      }
      else if(first_alphabet == "S"){
        const transactions = await db.collection("transaction")
        .where("StudentId", '==', searchText)
        .limit(5)
        .get()
        transactions.docs.map(doc=>{
         this.setState({
             allTransaction:[...this.state.allTransaction,doc.data()],
             lastVisibleTransaction:doc
         })
        })
      }
      console.log(this.state.lastVisibleTransaction.id)
    }

    fetchMore= async()=>{
        var searchText = this.state.search.toUpperCase()
        var first_alphabet = searchText.split("")[0]
  
        if(first_alphabet == "B"){
            const transactions = await db.collection("transaction")
            .where("bookId", '==', searchText)
            .startAfter(this.state.lastVisibleTransaction)
            .limit(5)
            .get()
            transactions.docs.map(doc=>{
             this.setState({
                 allTransaction:[...this.state.allTransaction,doc.data()],
                 lastVisibleTransaction:doc
             })
            })
  
        }
        else if(first_alphabet == "S"){
          const transactions = await db.collection("transaction")
          .where("StudentId", '==', searchText)
          .startAfter(this.state.lastVisibleTransaction)
          .limit(5)
          .get()
          transactions.docs.map(doc=>{
           this.setState({
               allTransaction:[...this.state.allTransaction,doc.data()],
               lastVisibleTransaction:doc
           })
          })
        }
    }
    render() {
        return (
          <View style={styles.container}>
            <View style={styles.searchBar}>
          <TextInput 
            style ={styles.bar}
            placeholder = "Enter Book Id or Student Id"
            onChangeText={(text)=>{this.setState({search:text})}}/>
            <TouchableOpacity
              style = {styles.searchButton}
              onPress={()=>{this.searchTransaction(this.state.search)}}
            >
              <Text>Search</Text>
            </TouchableOpacity>
            </View>
            <FlatList
            data ={this.state.allTransaction}
            keyExtractor = {(items,index)=>{index.toString}}
            renderItem={({item})=>(
                <View style = {{borderBottomWidth:3}}>
                    <Text>{"Book Id :" + item.bookId}</Text>
                    <Text>{"Student Id:"+ item.studentId}</Text>
                    <Text>{"Transaction Type :"+ item.transactiontype}</Text>
                    <Text>{"Date :"+ item.date.toDate()}</Text>
                </View>
            )

            }
            onEndReached = {()=>{
                this.fetchMore()

            }}
            onEndReachedThreshold={0.7}
            />
            </View>
      );
    }
  }



const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20,
    },
    searchBar:{
      flexDirection:'row',
      height:50,
      width:'auto',
      borderWidth:1.5,
      alignItems:'center',
      backgroundColor:'grey',
  
    },
    bar:{
      borderWidth:2,
      height:40,
      width:300,
      paddingLeft:10,
    },
    searchButton:{
      borderWidth:1,
      height:30,
      width:50,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'green'
    }
  })