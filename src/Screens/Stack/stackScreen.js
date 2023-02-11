import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../home";
import Profile from "../profile";
import Chat from "../Chat";
import Messages from "../Messages";
import Shop from "../Shop";
import Search from "../Search";
import ScreenOne from '../screenone';
import Payment from '../payment';
import YourPay from '../YourPay';
import Vetting from '../vetting';
import ChangeShift from '../ChangeShift';
import JobDetails from '../jobDetail';
import Notification from "../Notification";
import filterScreen from "../filterScreen";
import TwoPersonalCharScreen from "../TwoPersonalCharScreen";
import SelfEmploymentRefScreen from "../SelfEmploymentRefScreen";
import CriminalOffensesScreen from "../CriminalOffensesScreen";
import AddExperianceScreen from "../AddExperianceScreen";
import FinancialHistoryScreen from "../FinancialHistoryScreen";


const Stack = createStackNavigator();

const screenOptionStyle = {
    headerShown: false

};

const MainStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={screenOptionStyle}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ScreenOne" component={ScreenOne} />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="ChangeShift" component={ChangeShift} />
            {/* <Stack.Screen name="AddExperience" component={AddExperience} /> */}
            <Stack.Screen name="YourPay" component={YourPay} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="JobDetails" component={JobDetails} />
        </Stack.Navigator>
    );
}

const profileStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={screenOptionStyle}>
            <Stack.Screen name="profile" component={Profile} />
            <Stack.Screen name="YourPay" component={YourPay} />
            <Stack.Screen name="Vetting" component={Vetting} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="TwoPersonalCharScreen" component={TwoPersonalCharScreen} />
            <Stack.Screen name="SelfEmploymentRefScreen" component={SelfEmploymentRefScreen} />
            <Stack.Screen name="CriminalOffensesScreen" component={CriminalOffensesScreen} />
            <Stack.Screen name="FinancialHistoryScreen" component={FinancialHistoryScreen} />
            <Stack.Screen name="AddExperianceScreen" component={AddExperianceScreen} />
        </Stack.Navigator>
    );
}
const donateStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={screenOptionStyle}>
            <Stack.Screen name="Shop" component={Shop} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="Vetting" component={Vetting} />
            <Stack.Screen name="TwoPersonalCharScreen" component={TwoPersonalCharScreen} />
            <Stack.Screen name="SelfEmploymentRefScreen" component={SelfEmploymentRefScreen} />
            <Stack.Screen name="CriminalOffensesScreen" component={CriminalOffensesScreen} />
            <Stack.Screen name="FinancialHistoryScreen" component={FinancialHistoryScreen} />
            <Stack.Screen name="AddExperianceScreen" component={AddExperianceScreen} />
        </Stack.Navigator>
    );
}
const SearchStackNavigation = () => {
    return (
        <Stack.Navigator screenOptions={screenOptionStyle}>
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="JobDetails" component={JobDetails} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="filterScreen" component={filterScreen} />
            <Stack.Screen name="FinancialHistoryScreen" component={FinancialHistoryScreen} />
        </Stack.Navigator>
    );
}
const groupStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={screenOptionStyle}>
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Messages" component={Messages} />
            <Stack.Screen name="Notification" component={Notification} />

        </Stack.Navigator>
    );
}


export { MainStackNavigator, profileStackNavigator, donateStackNavigator, groupStackNavigator, SearchStackNavigation };