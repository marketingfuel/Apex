
import login from "./signIn";
import forgetPassword from "./forgetPassword";
import signUpScreen from "./signUpScreen";



import * as React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="login" component={login} />
            <Stack.Screen name="forgetPassword" component={forgetPassword} />
            <Stack.Screen name="signUpScreen" component={signUpScreen} />

        </Stack.Navigator>
    );
};
export { MainStackNavigator };