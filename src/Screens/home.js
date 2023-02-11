// ./screens/Home.js

import React, { useState, useEffect, useContext, useRef } from "react";
import { View, StyleSheet, TextInput, ActivityIndicator, Text,RefreshControl, StatusBar, TouchableWithoutFeedback, TouchableOpacity, Image, ScrollView, SafeAreaView, FlatList, Platform } from 'react-native';
import backGroundImage1 from '../Assets/Images/backGroundImage1.png'
import info from '../Assets/Icons/goldNoti.png'
import search from '../Assets/Icons/search1.png'
import blackNoti from '../Assets/Icons/bell_icon.png'
import Ionicons from 'react-native-vector-icons/Ionicons';
import services from '../services/Services'



function Home({ navigation }) {
    const [isAnimating, setAnimating] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const [newJob, setNewJob] = useState([]);
    const [myInvitation, setMyInvitation] = useState([]);
    const [notification, setNotification] = useState([]);
    const [refreshing, setRefreshing] = useState(false)


    openManue = () => {
        navigation.openDrawer();
    }

    goToNotification = () => {
        navigation.navigate('Notification')
    }

    useEffect(() => {
        homeApi()
    }, [])

    homeApi = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            const result = await services.get(`get-home?email=${auth?.email}`,auth?.token)
            console.log(result);
            if (result?.success) {
                setAnimating(false)
                setNewJob(result?.data?.new_jobs)
                setMyInvitation(result?.data?.invite_jobs)
                setNotification(result?.data?.notifications)
            }
        }
        catch (ex) {
            alert(result?.error ? result.error : 'Some thing went wrong!!')
        }
        finally {
            setAnimating(false)
        }
    }

    gotoScreenOne = (item) => {
        navigation.navigate('ScreenOne', item)
    }

    onRefresh = () => {
        setRefreshing(true)
        homeApi();
        setRefreshing(false)
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />

            {/* top bar */}
            <View style={{ width: "100%", flexDirection: "row", height: 60, backgroundColor: '#F2F2F5', justifyContent: "space-between" }}>
                <TouchableOpacity style={{ width: '15%', justifyContent: "center", alignItems: "center" }}   >
                    {/* <Image source={manue} style={{ width: 25, height: 25 }}></Image> */}

                </TouchableOpacity>
                {/* <View style={{ width: "70%", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>Home</Text>
                </View> */}
                <TouchableOpacity style={{ width: '15%', justifyContent: "center", alignItems: "center" }} onPress={() => { goToNotification() }} >
                    <Image source={blackNoti} style={{ width: 25, height: 25 }}></Image>

                </TouchableOpacity>
            </View>
            {/* top bar */}
            <View style={{ backgroundColor: '#F2F2F5', paddingHorizontal: 20, marginTop: -20 }}>
                <Text style={{ fontSize: 22, fontWeight: '700', }}>Good Morning  </Text>
                <Text style={{ color: 'gray', marginTop: 2 }}>What job You looking for?  </Text>
                <View style={{ borderRadius: 15, height: 40, backgroundColor: '#E6E8E7', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                    <TextInput
                        placeholder='Search here'
                        style={{ paddingLeft: "6%",color:'black' }}
                    />
                    <Image
                        source={search}
                        style={{ width: 25, height: 25, alignSelf: 'center', marginRight: '3%' }}
                    />
                </View>
            </View>
            <ScrollView
            refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
             showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'handled'}>
                <View style={{ backgroundColor: '#F2F2F5', paddingHorizontal: 20 }}>

                    <View>

                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 15 }}> My jobs  </Text>

                        {
                            newJob?.map((item, index) => {
                                return (

                                    <TouchableOpacity key={item.id} style={{ backgroundColor: "#1FC7B2", marginTop: '6%', borderRadius: 10, padding: 10 }}
                                        onPress={() => { gotoScreenOne(item) }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View style={{}}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontSize: 18, fontWeight: '700' }}>{item?.title || "Job Title"}</Text>
                                                        <Text style={{ fontSize: 16, marginVertical: 2 }}>{item?.company_name || 'SSGC LTD'}</Text>
                                                        <Text style={{ fontSize: 16, marginVertical: 2 }}>{item?.city || 'Manchester'}</Text>
                                                        <View style={{ flexDirection: 'row', marginTop: 10, borderRadius: 5, padding: 7, backgroundColor: '#CACFD2', width: 200 }}>
                                                            <Ionicons name='md-cash-outline' size={15} />
                                                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}> £{item?.budget} an hour</Text>
                                                        </View>
                                                    </View>

                                                <Text style={{ marginTop: '4%',  fontWeight: 'bold' }}>Job Timing</Text>
                                                <Text style={{ marginTop: '0.7%', }}>{item?.start_time+"-"+item?.end_time}</Text>
                                            </View>
                                            <Image
                                                source={backGroundImage1}
                                                style={{ width: 80, height: 80, marginRight: '3%', }}
                                            />
                                        </View>
                                    </TouchableOpacity>

                                );
                            })
                        }

                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 10 }}> My Invitations  </Text>

                        {
                            myInvitation?.map((item, index) => {
                                return (

                                    <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { jobID: item.id })} key={item.id} style={{ backgroundColor: "#1FC7B2", marginTop: '6%', borderRadius: 10, padding: 10 }}
                                    >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{}}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={{ fontSize: 18, fontWeight: '700' }}>{item?.title || "Job Title"}</Text>
                                                        <Text style={{ fontSize: 16, marginVertical: 2 }}>{item?.company_name || 'SSGC LTD'}</Text>
                                                        <Text style={{ fontSize: 16, marginVertical: 2 }}>{item?.city || 'Manchester'}</Text>
                                                        <View style={{ flexDirection: 'row', marginTop: 10, borderRadius: 5, padding: 7, backgroundColor: '#CACFD2', width: 200 }}>
                                                            <Ionicons name='md-cash-outline' size={15} />
                                                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}> £{item?.budget} an hour</Text>
                                                        </View>
                                                    </View>

                                                <Text style={{ marginTop: '4%',  fontWeight: 'bold' }}>Job Timing</Text>
                                                <Text style={{ marginTop: '0.7%', }}>{item.start_time+"-"+item.end_time}</Text>
                                            </View>
                                            <Image
                                                source={backGroundImage1}
                                                style={{ width: 80, height: 80, marginRight: '3%', }}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        }

                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 10 }}> Recent Notifications  </Text>
                        <View>
                            {
                                notification?.map((item, index) => {
                                    return (
                                        <View key={item.created_at} style={{ marginBottom: "2%", }}>
                                            <View style={{ flexDirection: 'row', marginVertical: "2%", }}>
                                                <Image style={{ width: 20, height: 20, tintColor: '#FFDA6D' }}
                                                    source={info} />
                                                <Text style={{ marginHorizontal: '3%', }}>{item.text}</Text>
                                            </View>
                                            <View
                                                style={{ borderBottomColor: 'grey', borderWidth: 0.5, }}
                                            />
                                        </View>
                                    );
                                })
                            }
                        </View>

                    </View>
                    <View style={{ height: 50 }}></View>
                </View>
            </ScrollView>
            {isAnimating &&
                <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
            }
        </SafeAreaView >

    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1FC7B2",
        alignContent: 'center',
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',

    },
});
export default Home;
