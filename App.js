import React, { useEffect,useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import signIn from "./src/Screens/signIn";
import signUpScreen from "./src/Screens/signUpScreen";
import forgetPassword from "./src/Screens/forgetPassword";
import verificationCode from "./src/Screens/verificationCode";
import ResetPassword from "./src/Screens/ResetPassword";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { BottomTabNavigator } from "./src/Screens/BottomTab/BottomTab";
import { View, Text } from "react-native";
import services from './src/services/Services';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import EvilIconsIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Stack = createStackNavigator();

Icon.loadFont();
EvilIconsIcons.loadFont();
MaterialIcons.loadFont();
MaterialCommunityIcons.loadFont();
Ionicons.loadFont();

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    getToken()
  }, []);

  const getToken = async () => {
    const auth = await services.getAuthData();
    setToken(auth?.token);
  }

  const Auth = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="signIn" component={signIn} />
        <Stack.Screen name="signUpScreen" component={signUpScreen} />
        <Stack.Screen name="forgetPassword" component={forgetPassword} />
        <Stack.Screen name="verificationCode" component={verificationCode} />
      </Stack.Navigator>
    );
  }
  const App = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
    );
  }

  const SwitchNavigator = () => {
    return (
      <Stack.Navigator initialRouteName={token ? 'App' : 'Auth'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="App" component={App} />
      </Stack.Navigator>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SwitchNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
export default App;
