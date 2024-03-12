import React, { useEffect, useState } from 'react';
import { View, Text, Button ,PermissionsAndroid} from 'react-native';
import * as Location from 'expo-location';

const MyComponent = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
     async () => {
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
            // getLocation()
          } else {
            console.log('You cannot use Geolocation');
            return false;
          }
        } catch (err) {
          return false;
        }
      }
      ;
    (async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !=='granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : location ? (
        <View>
          <Text>
            Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
          </Text>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default MyComponent;
