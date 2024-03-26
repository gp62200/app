import React, { useState, useRef, useEffect } from 'react';

import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ToastAndroid } from 'react-native';
import Modal from 'react-native-modal';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import * as Location from "expo-location";
import { CameraView } from "expo-camera/next";
import * as ImageManipulator from 'expo-image-manipulator';
import { useDispatch, useSelector } from "react-redux";
import { punchStart,punchSuccess,punchFailure } from "../src/features/att/attSlice";
export default function CameraScreen({ navigation }) {
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('front');

  const [hasPermission, setHasPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const error=useSelector((state)=>state.att.error);
  const dispatch=useDispatch();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    getLocation()
    const getCameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      };
      
      
    getCameraPermissions();
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
    
  }, []);
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

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraType = () => {
    setType((current) => (current === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back));
  };

  // const takePicture = async () => {
  //   if (cameraRef.current) {
  //     try {
  //       const { uri } = await cameraRef.current.takePictureAsync();
  //       setCapturedImage(uri);
  //       setConfirmModalVisible(true);
  //     } catch (error) {
  //       console.error('Error taking picture:', error);
  //     }
  //   }
  // };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        const base64Image = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
          
        });
        
        setCapturedImage(base64Image);
        setConfirmModalVisible(true);

        // const photo = await cameraRef.current.takePictureAsync({ base64: true });
        // setCapturedImage(photo.base64);
        // setConfirmModalVisible(true);
        console.log("photo")
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  // const takePicture = async () => {
  //   if (cameraRef.current) {
  //     try {
  //       const { uri } = await cameraRef.current.takePictureAsync();
        
  //       // Resize the image to 150x150 pixels
  //       const resizedImage = await ImageManipulator.manipulateAsync(
  //         uri,
  //         [{ resize: { width: 150, height: 150 } }],
  //         { format: 'jpeg', compress: 1 }
  //       );
  
  //       // Convert the resized image to base64
  //       const base64Image = await FileSystem.readAsStringAsync(resizedImage.uri, {
  //         encoding: FileSystem.EncodingType.Base64,
  //       });
  
  //       setCapturedImage(base64Image);
  //       setConfirmModalVisible(true);
  //     } catch (error) {
  //       console.error('Error taking picture:', error);
  //     }
  //   }
  // };

  const handleCancel = () => {
    setPreviewVisible(false);
    setCapturedImage(null);
    setConfirmModalVisible(false);
  };

  // const handleConfirm = () => {
  //   // Handle the confirmed picture URI as needed
  //   console.log('Confirmed Picture:', capturedImage);
  //   setPreviewVisible(false);
  //   setCapturedImage(null);
  //   setConfirmModalVisible(false);
  //   ToastAndroid.showWithGravity(
  //     'Picture is captured successfully',
  //     ToastAndroid.SHORT,
  //     ToastAndroid.CENTER,
  //     );
  //     navigation.navigate("Home")
  //   // Add navigation or other logic here if needed
  // };

  // const handleConfirm = async () => {
  //   console.log(location.coords.latitude)
  //   console.log(location.coords.longitude)
  //   try {
  //     const base64Image = await FileSystem.readAsStringAsync(capturedImage, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });
  
  //     const formData = new FormData();
  //     // formData.append('image', base64Image);
  //     formData.append('image', {
  //       uri: `data:image/jpeg;base64,${base64Image}`,
  //       type: 'image/jpeg', // or the appropriate MIME type
  //       name: 'image.jpg',
  //     });


     
  //       dispatch(punchStart())
  //     const apiUrl="http://43.230.200.65:118/Service1.svc/AMA_Insert_Image"
  //     const res=await axios.post(apiUrl,{
        
  //               Att_Latitude:location.coords.latitude,
  //               Att_Longitude:location.coords.longitude,
  //               Att_Current_time:currentTime.toLocaleTimeString(),
  //               In_Out_Type:"WPH",
  //              Image_Name:formData
                
  //           })
  //     console.log(res.data);
  //     navigation.navigate("Home")
  
  //     // if (res.ok) {
  //     //   // Handle the successful response from the API
  //     //   navigation.navigate('Home');
  //     //   console.log('Image successfully sent to the API');
  //     //   ToastAndroid.showWithGravity(
  //     //     'Picture is captured and sent to the API successfully',
  //     //     ToastAndroid.SHORT,
  //     //     ToastAndroid.CENTER,
  //     //   );
  //     // } else {
  //     //   // Handle the error response from the API
  //     //   console.error('Failed to send image to the API');
  //     //   // You may want to display an error message or handle it accordingly
  //     // }
  //   } catch (error) {
  //     console.error('Error sending image to the API:', error);
  //     // Handle the error as needed
  //   } finally {
  //     setPreviewVisible(false);
  //     setCapturedImage(null);
  //     setConfirmModalVisible(false);
  //   }
  // };

  // const handleConfirm = async () => {
  //   try {
  //     dispatch(punchStart());
  
  //     const apiUrl = "http://43.230.200.65:118/Service1.svc/AMA_Insert_Image";
  //     const res = await axios.post(apiUrl, {
  //       Att_Latitude: location.coords.latitude,
  //       Att_Longitude: location.coords.longitude,
  //       Att_Current_time: new Date().toLocaleTimeString(),
  //       In_Out_Type: "WPH",
  //       Image_Name: capturedImage
  //     });
  
  //     // if (res.status === 200) {
  //     //   dispatch(punchSuccess());
  //     //   navigation.navigate('Home');
  //     //   ToastAndroid.showWithGravity(
  //     //     'Picture is captured and sent to the API successfully',
  //     //     ToastAndroid.SHORT,
  //     //     ToastAndroid.CENTER,
  //     //   );
  //     // } else {
  //     //   dispatch(punchFailure());
  //     //   console.error('Failed to send image to the API');
  //     //   ToastAndroid.showWithGravity(
  //     //     'Failed to send image to the API',
  //     //     ToastAndroid.SHORT,
  //     //     ToastAndroid.CENTER,
  //     //   );
  //     // }
  //   } catch (error) {
  //     // dispatch(punchFailure());
  //     console.error('Error sending image to the API:', error);
  //     ToastAndroid.showWithGravity(
  //       'Failed to send image to the API',
  //       ToastAndroid.SHORT,
  //       ToastAndroid.CENTER,
  //     );
  //   } finally {
  //     setPreviewVisible(false);
  //     setCapturedImage(null);
  //     setConfirmModalVisible(false);
  //   }
  // };
  

  const handleConfirm = async() => {
    
    dispatch(punchStart());
    console.log("hoe ")
    try {
      // const resizedImage = await ImageManipulator.manipulateAsync(
      //           capturedImage,
      //           [{ resize: { width: 150, height: 150 } }],
      //           { format: 'jpeg', compress: 1 }
      //         );
      const apiUrl = "http://43.230.200.65:118/Service1.svc/AMA_Insert_Image";
      
      const res=await axios.post(apiUrl,{
        Att_Latitude: location.coords.latitude,
              Att_Longitude: location.coords.longitude,
              Att_Current_time: new Date().toLocaleTimeString(),
              In_Out_Type: "IN",
              Image_Name: capturedImage,
              Comment:"IN"
    })
      // console.log(capturedImage)
      console.log(res.data)

        
    //  console.log(res.data)
     navigation.navigate("Home")
     ToastAndroid.showWithGravity(
              'Picture is captured and sent to the API successfully',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );

    
 }
  catch (error) {
       console.log("err",error)
     } 
}
  




  return (
    // <View style={styles.container}>
    //   <CameraView style={styles.camera} type={type} ref={cameraRef}  facing={facing}>
    //     <View style={styles.buttonContainer}>
    //       {/* <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
    //         <Text style={styles.text}>Flip Camera</Text>
    //       </TouchableOpacity> */}
    //       <TouchableOpacity style={styles.button} onPress={takePicture}>
    //         <Text style={styles.text}>Take Picture</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </CameraView>

    //   <Modal isVisible={isConfirmModalVisible}>
    //     <View style={styles.modalContainer}>
    //       <Image source={{ uri: capturedImage }} style={styles.previewImage} />
    //       <View style={styles.modalButtonContainer}>
    //         <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
    //           <Text style={styles.text}>Cancel</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
    //           <Text style={styles.text}>Confirm</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </Modal>
    // </View>

    <View style={styles.container}>
    {/* Render CameraView component only when preview is not visible */}
    {!isPreviewVisible && (
      <CameraView style={styles.camera} type={type} ref={cameraRef} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    )}

    <Modal isVisible={isConfirmModalVisible}>
      <View style={styles.modalContainer}>
        {/* Render captured image only when preview is visible */}
        {isPreviewVisible && (
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
        )}
        <View style={styles.modalButtonContainer}>
          <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
            <Text style={styles.text}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={handleConfirm}>
            <Text style={styles.text}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 32,
    width: '100%',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
});
