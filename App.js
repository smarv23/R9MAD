import * as React from 'react';
import { Text, View, StyleSheet, FlatList, Image } from 'react-native';
import Constants from 'expo-constants';
import FileSystem from 'expo';
import {useState, useEffect} from 'react';
import axios from 'axios';

// or any pure javascript modules available in npm
import { Card, Searchbar } from 'react-native-paper';

export default function App() {
  const [response, setResponse] = useState({});
  const [data, setData] = useState([]); 
  const [searchText, setSearchText] = useState("");
  const [displayData, setDisplayData] = useState([]);

  useEffect( () => {
    const getData = async () => {
      await axios.get('https://datausa.io/api/data?drilldowns=Nation&measures=Population')
        .then( (r) => { 
          setResponse( r.data );
          setData(r.data.data)
          setDisplayData(r.data.data);
        })
        .catch( (e) => {
          console.log(`axios error ${e}`);
        });
    };
    getData();
  },[]);

  useEffect( () => {
   if( searchText !== "") {      
      let newDisplayData = [...data];      
      newDisplayData = newDisplayData.filter( Year => Year.Year.toLowerCase().includes(searchText.toLowerCase()) )      
      setDisplayData(newDisplayData);   
      } else {      
        setDisplayData(data);    
        }  
        }, [searchText])





  const renderRow = ({item}) => {
    return (
      <Card style={styles.container}>
        <Card.Title title={item.Year} subtitle={item.Nation}/>
        <Card.Content>          
          <Text>{item.Population}</Text>
          <Image style={styles.picture} source={require( './assets/download.png' )}/> 
        </Card.Content>
      </Card>
    )    
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayData}
        renderItem={renderRow}
        keyExtractor={item=>item[0]}
        ListHeaderComponent={
          <Searchbar
           onChangeText={setSearchText}
          value={searchText}
          placeholder= 'Search: 2013-2019!'/>

    }
          />
    </View>
  );
}


// https://reactnative.dev/docs/flexbox
// https://css-tricks.com/snippets/css/a-guide-to-flexbox/
const styles = StyleSheet.create({
  dataView: {
    flex: 1,
    flexDirection: 'row',
  },
  header: {
    fontWeight:'bold'
  },
  card:{
    margin: 3,
    borderWidth: 10,

  },
  picture: {
    height: 50,
    width: 50,
  },
  container: {
    flex: 5,
    justifyContent: "space-between",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fffff',
    borderWidth: 10,
    borderTopColor: '#b7e1f7',
    borderBottomColor: '#fcd9fc',
    borderLeftColor:'#d0f5ba',
    borderRightColor: '#ffa759',
    borderStyle: 'dotted',
    padding: 15,
    margin: 10,
    
  },
});
