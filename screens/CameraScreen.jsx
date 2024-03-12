import React, { useState, useRef } from 'react';
import { Camera,CameraView } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ToastAndroid } from 'react-native';
import Modal from 'react-native-modal';

export default function CameraScreen({ navigation }) {
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isPreviewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const cameraRef = useRef(null);

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

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        setCapturedImage(uri);
        setConfirmModalVisible(true);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const handleCancel = () => {
    setPreviewVisible(false);
    setCapturedImage(null);
    setConfirmModalVisible(false);
  };

  const handleConfirm = () => {
    // Handle the confirmed picture URI as needed
    console.log('Confirmed Picture:', capturedImage);
    setPreviewVisible(false);
    setCapturedImage(null);
    setConfirmModalVisible(false);
    navigation.navigate("Watch")
    ToastAndroid.showWithGravity(
      'Picture is captured successfully',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    // Add navigation or other logic here if needed
  };

  

// const handleConfirm = async () => {
//   try {
//     const formData = new FormData();
//     formData.append('image', {
//       uri: capturedImage,
//       type: 'image/jpeg', // or the appropriate MIME type
//       name: 'image.jpg',
//     });

//     const response = await fetch('http://43.230.200.65:118/Service1.svc', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         // Add any additional headers as needed
//       },
//       body: formData,
//     });

//     if (response.ok) {
//       // Handle the successful response from the API
//       console.log('Image successfully sent to the API');
//       navigation.navigate('Home');
//       ToastAndroid.showWithGravity(
//         'Picture is captured and sent to the API successfully',
//         ToastAndroid.SHORT,
//         ToastAndroid.CENTER,
//       );
//     } else {
//       // Handle the error response from the API
//       console.error('Failed to send image to the API');
//       // You may want to display an error message or handle it accordingly
//     }
//   } catch (error) {
//     console.error('Error sending image to the API:', error);
//     // Handle the error as needed
//   } finally {
//     setPreviewVisible(false);
//     setCapturedImage(null);
//     setConfirmModalVisible(false);
//   };
// };




  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </Camera>

      <Modal isVisible={isConfirmModalVisible}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
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
