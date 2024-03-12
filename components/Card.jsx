import React,{useEffect, useState} from "react";
import { View, Text, Dimensions, StyleSheet, Image,TouchableOpacity } from "react-native";
import * as Location from 'expo-location';
import axios from "axios";
import { useDispatch } from "react-redux";
import { punchStart } from "../src/features/att/attSlice";
const { width } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = (width - CARD_MARGIN * 4) / 2;

export default function Card({ item ,userId}) {
  const [location, setLocation] = useState(null);
  const[latitude,setLatitude]=useState(null);
  const[longitude,setLongitude]=useState(null);
  const[time,setTime]=useState(null);
  const[punch,setPunch]=useState(null);
  const dispatch=useDispatch();
  
  const[coordinates,setCoordinates]=useState(null);
  const[comment,setComment]=useState(null);
  const handleLocation=async()=>{
    const apiUrl=`http://43.230.200.65:118/Service1.svc/${item.url}`;
    
    
    dispatch(punchStart());
    try {
      console.log("q")

      const res=await axios.post(apiUrl,{
        UserID:userId,
        Att_Latitude:latitude,
        Att_Longitude:longitude,
        Att_Current_time:time,
        
      })
        console.log("hello2")
        console.log(res.data);
        
      } catch (error) {
        console.log("err->",error)
      }

  }
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
  
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Error getting location');
    }
  };
  useEffect(()=>{
    getLocation()
  },[])
  
  return (
    <View style={styles.card}>
    
      <TouchableOpacity  onPress={handleLocation}>
        <Text style={styles.text}>{item.title}</Text>
        
        </TouchableOpacity>
        {/* <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="Get Location" onPress={getLocation} />
      </View> */}
        
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor:'plum',
    padding: 44,
    height:120,
   
    marginHorizontal: 16,
    marginBottom: CARD_MARGIN,
    width: CARD_WIDTH,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
 
});
