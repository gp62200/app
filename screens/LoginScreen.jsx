import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, loginSuccess, loginUser } from "../src/features/auth/authSlice";
// import users from './apiData.json'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
  ToastAndroid,
  ActivityIndicator
} from "react-native";
import * as Location from 'expo-location';
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch=useDispatch();
  const loading=useSelector((state)=>state.auth.loading);
  const error=useSelector((state)=>state.auth.error);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

 

  const handleLogin = () => {
    const apiUrl = "http://43.230.200.65:118/Service1.svc/UserLogin";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        Email_ID: username,
        Password:password
       }),
    })
    .then(res=>{
      return res.json()
    })
      .then((response) => {
        console.log(response)
        if(response.Status=="Success"){

          Alert.alert("Login Successful", "Welcome!");
          navigation.navigate("Home");
        }
        else if(response.Status == "Fail"){
          Alert.alert(response.Message)
        }
        
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  };

  const handleLoginAsync = async() =>{
    if(username =='' && password == ''){
      ToastAndroid.showWithGravity(
        'Please fill the details',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
      const apiUrl = "http://43.230.200.65:118/Service1.svc/UserLogin";
    try {
      const res =await axios.post(apiUrl,{
        Email_ID: username,
        Password:password
      })

      console.log(res.data)
      if(res.data.Status == "Success"){
        // Alert.alert("Login Successful", "Welcome!");
        ToastAndroid.showWithGravity(
          'Login Successful',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        console.log(res.data.UserID)
          navigation.navigate("Home",{userId:res.data.UserID});
      }else if(res.data.Status == "Fail"){
        // Alert.alert(res.data.Message)
        ToastAndroid.showWithGravity(
          res.data.Message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      console.log("err->",error)
    }
    
    
  }

  // console.log(loading);

    const handleLoginRedux=async()=>{
      if(username==='' && password===''){
        ToastAndroid.showWithGravity(
          'Please fill the details',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return;
      }
          dispatch(loginStart());
          try {
            const apiUrl = "http://43.230.200.65:118/Service1.svc/UserLogin";

          const res=await axios.post(apiUrl,{
            Email_ID:username,
            Password:password
          })
          console.log(res.data)

          if(res.data.Status==="Success"){
            // console.log("abcd")
            setTimeout(()=>{
              dispatch(loginSuccess({user:{username,password}}))
              // dispatch(loginSuccess(response.data));
              ToastAndroid.showWithGravity(
                'Login Successful',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
            },1000)
            navigation.navigate('Home')
           


          }
          else if(res.data.Status==="Fail"){
            dispatch(loginFailure(res.data.Message))
          }
          ToastAndroid.showWithGravity(
            res.data.Message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          } catch (error) {
            console.log("err",error)
          }
          
          
         
    }
  return (
  
    <ScrollView style={{ backgroundColor: "plum"}}>
      <View style={styles.container}>
        <Image source={require("../assets/rnative.png")} style={styles.image} />

        <StatusBar style="auto" />
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Username"
            placeholderTextColor="#003f5c"
            onChangeText={(username) => setUsername(username)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        <TouchableOpacity>
          <Text style={styles.forgot_button}>Forgot Password?</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff"/>
        ):(
          <TouchableOpacity style={styles.loginBtn} onPress={handleLoginRedux}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        )}
        {/* {error && <Text style={{ color: 'red' }}>{error}</Text>} */}
        
      </View>
    </ScrollView>
  
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
    marginTop: 80,
  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: 280,
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 10,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: 150,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
});
