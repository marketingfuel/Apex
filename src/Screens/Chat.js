// ./screens/Home.js

import React, { useState, useEffect,useCallback, useContext, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    Modal
} from 'react-native';

import manue from '../Assets/Icons/manue.png'
import image from '../Assets/Icons/image.png'
import image1 from '../Assets/Icons/image2.png'
import profile_icon from '../Assets/Icons/profile_icon.png'
import { GiftedChat } from 'react-native-gifted-chat'
import bell from '../Assets/Icons/bell_icon.png'
import FRB from '../services/Firebase';
import services from '../services/Services'


function Chat({ navigation }) {
    const [isAnimating, setAnimating] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const [onlileGuardsWithSameJob, setOnlileGuardsWithSameJob] = useState([]);

    useEffect(() => {
        getGuards();
    }, [])
    
    const getGuards = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            const result = await services.get(`guard-list?email=${auth.email}`, auth.token)
            console.log(result);
            if (result.success) {
              console.log(result);
              setOnlileGuardsWithSameJob(result?.data)
            }
            setAnimating(false)
        }
        catch (ex) {
            console.log(ex);
            alert('Some thing went wrong!!')
        }
        finally{
            setAnimating(false)
        }
    }

    openManue = () => {
        navigation.openDrawer();
    }

    goToNotification = () => {
        navigation.navigate('Notification')
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />
            {/* top bar */}
            <View style={{ width: "100%", flexDirection: "row", height: 60, backgroundColor: '#1FC7B2', justifyContent: "space-between" }}>
                {/* <TouchableOpacity style={{ width: '15%', justifyContent: "center", alignItems: "center" }}   >

                </TouchableOpacity> */}
                <View style={{ width: "70%", justifyContent: "center", marginLeft: 20 }}>
                    <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>Message</Text>
                </View>
                <TouchableOpacity style={{ width: '15%', justifyContent: "center", alignItems: "center" }} onPress={() => { goToNotification() }} >
                    <Image source={bell} style={{ width: 25, height: 25 }}></Image>
                </TouchableOpacity>
            </View>

            {/* top bar */}
            <View style={{ backgroundColor: 'white', }}>

                <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false} >

                    {/* <TouchableOpacity>
                        <View style={[{
                            width: '90%', alignSelf: "center", marginTop: 30, borderRadius: 10, padding: 10, backgroundColor: 'white',
                        }, styles.shadStyle]}>


                            <View style={{ width: "100%", justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: 20 }}>
                                <View style={{}}>
                                    <Text style={{ color: 'black', fontSize: 16, fontWeight: "bold" }}>APEX SECURITY TEAM</Text>
                                </View>
                                <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: "#1FC7B2", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ color: 'white', fontSize: 14, }}>2</Text>
                                </View>

                            </View>

                            <View style={{ flexDirection: 'row', width: "100%", alignItems: "center" }}>
                                <View style={{ width: "30%", justifyContent: "center" }}>
                                    <Image source={image1} style={{ alignSelf: 'center', width: 100, height: 100, resizeMode: "contain" }} />

                                </View>
                                <View style={{ width: "60%", flexDirection: "row", height: 100, alignItems: "flex-end", marginBottom: 20 }}>

                                    <View style={{ height: 40, width: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginLeft: -10, marginRight: 10 }}>
                                        <Image source={profile_icon} style={{ width: 40, height: 40, resizeMode: "contain" }} />
                                    </View>
                                    <View style={{}}>
                                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>Barbara Matthews</Text>
                                        <Text style={{ fontSize: 12, color: "#797A79" }}>Some Message from user</Text>

                                    </View>
                                    <View styl={{}}>
                                        <Text style={{ marginLeft: 20, fontSize: 14, color: "#797A79" }}>2 hr</Text>

                                    </View>
                                </View>

                            </View>

                        </View>
                    </TouchableOpacity>
                    */}
                    <TouchableOpacity>
                        <View style={[{
                            width: '90%', alignSelf: "center", marginTop: 20, borderRadius: 10, padding: 10, backgroundColor: 'white',
                        }, styles.shadStyle]}>
                            <View style={{ width: "100%", justifyContent: "space-between", alignItems: "center", flexDirection: "row", paddingHorizontal: 20 }}>
                                <View style={{}}>
                                    <Text style={{ color: 'black', fontSize: 16, fontWeight: "bold" }}>TALK TO US</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', width: "100%", alignItems: "center" }}>
                                <View style={{ width: "30%", justifyContent: "center" }}>
                                    <Image source={image} style={{ alignSelf: 'center', width: 100, height: 100, resizeMode: "contain" }} />
                                </View>
                                <View style={{ width: "70%", paddingHorizontal: 10 }}>
                                    <Text style={{ fontSize: 14, fontWeight: "bold" }}>Any Question Or Need Help?</Text>
                                    <Text style={{ fontSize: 12, color: "#797A79" }}>Lorem Ipsum Is Simply Dummy Text Of The Printing And</Text>
                                    <TouchableOpacity style={styles.button} onPress={() => {navigation.navigate("Messages",{name:'admin',email:'admin@gmail.com'})}}>
                                        <Text style={styles.buttonText}>CHAT NOW</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Text style={{ fontWeight: 'bold', marginHorizontal: 20, fontSize: 16, marginTop: 15, }}>Online Guards</Text>
                    <View style={{ width: "100%" }}>
                        {
                            onlileGuardsWithSameJob?.map((item, index) => {
                                return (
                                    <TouchableOpacity key={item.id} onPress={()=>{navigation.navigate('Messages',{name:item?.first_name+" "+item?.last_name,email:item?.email})}}>
                                        <View style={{ width: "90%", flexDirection: "row", height: 100, alignItems: "center", alignSelf: "center", justifyContent: "space-between" }}>
                                            <View style={{ flexDirection: "row", alignItems: "center", }}>
                                                <View style={{ height: 60, width: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                                                    <Image source={profile_icon} style={{ width: 60, height: 60, resizeMode: "contain" }} />
                                                </View>
                                                <View style={{}}>
                                                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.first_name+" "+item.last_name}</Text>
                                                    <Text style={{ fontSize: 14, color: "#797A79" }}>Click here to see messages</Text>

                                                </View>
                                            </View>
                                            <View styl={{}}>
                                                {/* <Text style={{ marginLeft: 20, fontSize: 16, color: "#797A79" }}>2 hr</Text> */}
                                            </View>
                                        </View>
                                        <View style={styles.seperater}></View>
                                    </TouchableOpacity>
                                );
                            })
                        }
                    </View>

                    <View style={{ height: 200 }}></View>

                </ScrollView>
            </View>
        </SafeAreaView >
    
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1FC7B2",
        alignContent: 'center',
    },


    shadStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    button: {
        marginTop: 30,
        alignSelf: 'center',
        height: 30,
        width: 130,
        backgroundColor: '#1FC7B2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: "#111111",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    seperater: {
        height: 1,

        backgroundColor: '#d5c9de'

    },
});

export default Chat;
