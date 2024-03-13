import React, { useState, useEffect } from "react";
import axios from "axios";
import { Text, View, StyleSheet, Button, ToastAndroid } from "react-native";
import { CameraView, Camera } from "expo-camera/next";
import * as Location from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { punchStart,punchSuccess,punchFailure } from "../src/features/att/attSlice";
export default function QrScannerScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const error=useSelector((state)=>state.att.error);
  const dispatch=useDispatch();
  // useEffect(() => {
  //   const getCameraPermissions = async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync();
  //     setHasPermission(status === "granted");


  //   };
  //   // const getLocationPermissions = async()=>{
        
  //   //   const {status} = await Location.requestForegroundPermissionsAsync();
  //   //   setHasLocationPermission(status === "granted");
  //   // }
    
  //   getCameraPermissions();
  //   // getLocationPermissions();
  // }, []);
  useEffect(() => {
    getLocation()
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
    
  }, []);
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
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      console.log("A")
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
  

  const handleBarCodeScanned = async({ type, data }) => {
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    if (data === "123") {
      setScanned(true);
      // alert(`Valid QR code scanned: ${data}`);
      ToastAndroid.showWithGravity(
        'Valid QR code scanned',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      dispatch(punchStart());
      console.log("hoe ")
      try {
        const apiUrl = "http://43.230.200.65:118/Service1.svc/AMA_Insert";
        
        const res=await axios.post(apiUrl,{
          
          Att_Latitude:location.coords.latitude,
          Att_Longitude:location.coords.longitude,
          Att_Current_time:currentTime.toLocaleTimeString(),
          "In_Out_Type":"TRAVEL",
        })
        
     console.log(res.data)

    //  if(res.data.Status==="Success"){
    //   dispatch(punchSuccess({coordinates:{location:{coords:{latitude,longitude}}},currentTime}))
    
    //  }
 }
  catch (error) {
       console.log("err",error)
     }
      
      navigation.navigate("Camera")
 
      //for location
      // try {
      //   let { status } = await Location.requestForegroundPermissionsAsync();
        
      //   if (status !== 'granted') {
      //     setErrorMsg('Permission to access location was denied');
      //     return;
      //   }
      //   console.log("a")
    
      //   let location = await Location.getCurrentPositionAsync({});
      //   setLocation(location);
      // } catch (error) {
      //   console.error('Error getting location:', error);
      //   setErrorMsg('Error getting location');
      // }

    } else {
      setScanned(true);
      // alert(`Invalid QR code: ${data}`);
      ToastAndroid.showWithGravity(
        'Invalid QR code Please scan again!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };
  

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  // if (hasLocationPermission === null) {
  //   return <Text>Requesting for camera permissions</Text>;
  // }

  // if ( !hasLocationPermission) {
  //   return <Text>No access to  location</Text>;
  // }

  // const sendLocationToAPI = async (coords) => {
  //   // Replace the following URL with your API endpoint
  //   const apiUrl = "http://43.230.200.65:118/Service1.svc/AMA_Insert";

  //   try {
  

  //     const res=await axios.post(apiUrl,{
  //       UserID: 2,
  //         Att_Latitude: location.coords.latitude.toString(),
  //         Att_Longitude: location.coords.longitude.toString(),
  //         Att_Current_time: new Date().toLocaleTimeString(),
  //     })
  //     console.log(res.data)

  //     if (response.ok) {
  //       console.log("Location sent to API successfully");
  //     } else {
  //       console.error("Failed to send location to API");
  //     }
  //   } catch (error) {
  //     console.error("Error sending location to API:", error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});