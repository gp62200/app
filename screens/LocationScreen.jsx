import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  PermissionsAndroid,
  StatusBar,
  Dimensions,
  ToastAndroid,
} from "react-native";
import * as Location from 'expo-location';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../src/features/auth/authSlice";
const { width } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = (width - CARD_MARGIN * 4) / 2;
const HomeScreen = ({navigation}) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch=useDispatch();
  const loading=useSelector((state)=>state.auth.loading);
  const error=useSelector((state)=>state.auth.error);

  useEffect(() => {
    getLocation()
  },[]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };
  const getLocation = async () => {
    requestLocationPermission();
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      console.log("a")
  
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      navigation.navigate("Camera")
    } catch (error) {
      console.error('Error getting location:', error);
      setErrorMsg('Error getting location');
    }
  };

  const handleSendLocation = () => {
    // Add logic to send location
    console.log("Sending location:", location);
  };
  const handleSubmit=()=>{
    navigation.navigate("Code")
  }
  const handleLogout = () => {
    dispatch(logout());
    console.log("log out")
    navigation.navigate("Login")
    ToastAndroid.showWithGravity(
      "Logout successfully ",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    )
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={handleSubmit}>
            <Text >Time In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={handleLogout}>
            <Text >Logout</Text>
          </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button title="Get Location" onPress={getLocation} />
      </View>

      <Text>Latitude: {location ? location.coords.latitude : null}</Text>
      <Text>Longitude: {location ? location.coords.longitude : null}</Text>

 

      <View style={styles.buttonContainer}>
        <Button title="Send Location" onPress={handleSendLocation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    width: '40%',
  },
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

export default HomeScreen;
