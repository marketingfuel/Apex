import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {StackActions,NavigationActions} from '@react-navigation/native';
import {Image, TouchableOpacity, View} from "react-native";
import home from '../../Assets/Icons/home.png'
import chat from '../../Assets/Icons/chat.png'
import shoping from '../../Assets/Icons/shop.png'
import profile from '../../Assets/Icons/profile.png'
import search from '../../Assets/Icons/search.png'

import {
    MainStackNavigator,
    profileStackNavigator,
    donateStackNavigator,
    groupStackNavigator,
    SearchStackNavigation
} from "../Stack/stackScreen";

const Tab = createBottomTabNavigator();

const CustomizeSearchButton = ({ children, onPress }) => (
    // <TouchableOpacity
    //     style={{
    //         top: -30,
    //         justifyContent: "center",
    //         alignItems: "center",
    //         shadowColor: "#1FC7B2",
    //         shadowOffset: {
    //             width: 0,
    //             height: 10,

    //         },
    //         shadowOpacity: 0.25,
    //         shadowRadius: 3.5,
    //         elevation: 5
    //     }}
    //     onPress={onPress} >

        <TouchableOpacity onPress={onPress} style={{ height: 70, width: 70, borderRadius: 35, backgroundColor: "#1FC7B2", }}>
            {children}
        </TouchableOpacity>
    //  </TouchableOpacity>
)

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                showLabel: false,
                style: {
                    height:75,
                    borderTopStartRadius: 30,
                    borderTopEndRadius: 30
                }
            }}>

            <Tab.Screen
                name="Home"
                component={MainStackNavigator}
                forceRenderTabPanel={true}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            resizeMode="stretch"
                            source={home}
                            style={{
                                width: 25, height: 25,
                                tintColor: focused ? "#000" : "#999999"
                            }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="WorkPrefrence"
                component={donateStackNavigator}
                forceRenderTabPanel={true}
                options={{

                    tabBarIcon: ({ focused }) => (
                        <Image
                            resizeMode="stretch"
                            source={shoping}
                            style={{
                                width: 25, height: 25,
                                tintColor: focused ? "#000" : "#999999"
                            }}
                        />
                    ),
                    selectedIconColor: '#187c48',
                }}
            />

            <Tab.Screen
                name="Search"
                component={SearchStackNavigation}
                forceRenderTabPanel={true}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            resizeMode="stretch"
                            source={search}
                            style={{
                                width: 25, height: 25,
                                tintColor: "#FFF"
                            }}
                        />
                    ),

                    tabBarButton: (props) => (
                        <CustomizeSearchButton {...props} />
                    )
                }}

            />
            <Tab.Screen
                name="Chat"
                component={groupStackNavigator}
                forceRenderTabPanel={true}
                options={{

                    tabBarIcon: ({ focused }) => (
                        <Image
                            resizeMode="stretch"
                            source={chat}
                            style={{
                                width: 25, height: 25,
                                tintColor: focused ? "#000" : "#999999"
                            }}
                        />
                    ),
                    //tabBarBadge: 1,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={profileStackNavigator}
                forceRenderTabPanel={true}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            resizeMode="stretch"
                            source={profile}
                            style={{
                                width: 25, height: 25,
                                tintColor: focused ? "#000" : "#999999"
                            }}
                        />
                    ),
                    selectedIconColor: '#187c48',
                }}
                // listeners={({ navigation, route }) => ({
                //     tabPress: e => {
                //         console.log(navigation.canGoBack());
                //         if(navigation.canGoBack()) {
                //         navigation.dispatch(StackActions.pop(1));
                //         }
                //     },
                // })}
            />
        </Tab.Navigator>
    );
};

export { BottomTabNavigator };