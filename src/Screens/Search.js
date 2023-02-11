// ./screens/Home.js

import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Text,
    StatusBar,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    AsyncStorage,
    FlatList,
    Platform,
    Dimensions,
    RefreshControl,
    useWindowDimensions
} from 'react-native';
import backGroundImage1 from '../Assets/Images/backGround2.png'
import bell from '../Assets/Icons/bell_icon.png'
import info from '../Assets/Icons/goldNoti.png'
import search from '../Assets/Icons/search1.png'
import questionmark from '../Assets/Icons/questionmark.png'
import dotline from '../Assets/Icons/doneline.png'
import filter from '../Assets/Icons/filter.png'
import services from '../services/Services'

import blackNoti from '../Assets/Icons/bell_icon.png'
import { Item } from "native-base";
const {height,width} = Dimensions.get("window");
import { TabView, SceneMap ,TabBar} from 'react-native-tab-view';

function Search({ navigation }) {
    const [searchData, setSearchData] = useState([])
    const [isAnimating, setAnimating] = useState(false);
    const [vettingAlert, setVettingAlert] = useState(true);
    const [allJobs, setAllJobs] = useState([])
    const [userProfile, setUserProfile] = useState()
    const [authAS,setAuthAS] = useState({});
    const [refreshing, setRefreshing] = useState(false)
    const [myInvitation, setMyInvitation] = useState([]);

    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'first', title: 'JOBS' },
      { key: 'second', title: 'Applied' },
      { key: 'third', title: 'INVITES' },
    ]);

    goToNotification = () => {
        navigation.navigate('Notification')
    }
    openManue = () => {
        navigation.openDrawer();
    }

    useEffect(() => {
        getJobs()
        getProfile()
        homeApi()
    }, [])

    const getJobs = async () => {
        setAnimating(true)
        const auth = await services.getAuthData();
        setAuthAS(auth);
        const result = await services.get(`show_jobs?email=${auth.email}`,auth.token)
        console.log(result);
        if (result.success) {
            setAllJobs(result.data)
            setAnimating(false)
            return
        }
        setAnimating(false)
        alert(result?.error ? result.error : 'Some thing went wrong!!')
    }

    const getProfile = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            const result = await services.get(`profile?email=${auth?.email}`, auth?.token)
            console.log(result)
            if (result.success && result.data) {
                setUserProfile(result.data)
                if(result.data?.two_person_reference_fill == true 
                   && result.data?.self_reference_fill == true
                   && result.data?.criminal_fill == true 
                   && result.data?.guard_experience == true 
                   && result.data?.guard_education == true
                   && result.data?.financial_fill == true
                  )
                {
                    setVettingAlert(false);
                }
            }
        }
        catch (ex) {
            alert('Some thing went wrong!!')
        }
        finally {
            setAnimating(false)
        }
    }
    
    homeApi = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            const result = await services.get(`get-home?email=${auth?.email}`,auth?.token)
            console.log(result);
            if (result?.success) {
                setAnimating(false)
                setMyInvitation(result?.data?.invite_jobs)
            }
        }
        catch (ex) {
            alert(result?.error ? result.error : 'Some thing went wrong!!')
        }
        finally {
            setAnimating(false)
        }
    }

    const searchItem = (item) => {
        const searchItem = item.toLowerCase()
        setSearchData(
            allJobs?.filter((i) => {
                return i.title.toLowerCase().match(searchItem)

            })
        )
    }
    onRefresh = () => {
        setRefreshing(true)
        getJobs()
        getProfile()
        setRefreshing(false)
    }

    const FirstRoute = () => (
        <View style={{ backgroundColor: '#F2F2F5', flex: 1, }}>
        <View keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}  >
        {vettingAlert &&
            <TouchableOpacity onPress={()=>{navigation.navigate('Profile',{ screen: 'Vetting'})}}>
                <View style={[{
                    width: '90%', alignSelf: "center", paddingTop: 60, paddingBottom: 20, marginTop: 20,
                    borderRadius: 10,
                    backgroundColor: 'white',
                }, styles.shadStyle]}>

                    <View style={{
                        marginTop: -70, width: 30, height: 30, marginLeft: -10, borderRadius: 20,
                    }}>
                        <Image source={questionmark} style={{ width: 30, height: 30 }}></Image>

                    </View>

                    <View style={{ flexDirection: 'row', width: "100%", height: 60, alignItems: "center" }}>
                        <View style={{ width: "30%", justifyContent: "center" }}>
                            <Image source={dotline} style={{ alignSelf: 'center', width: 60, height: 60, resizeMode: "contain" }} />
                        </View>
                        <View style={{ width: "70%", paddingRight: 20, }}>
                            <Text style={{ color: 'black', fontSize: 14, marginTop: 5, }}>Completely Setup Your Profile To Apply For The Job</Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
          }
            <View style={{ width: "90%", alignSelf: "center", flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, }}>Jobs Near You  </Text>
                <TouchableOpacity onPress={() => { navigation.navigate('filterScreen') }}>
                    <View>
                        <Image source={filter} style={{ alignSelf: 'center', width: 20, height: 20, resizeMode: "contain" }} />

                    </View>
                </TouchableOpacity>
            </View>
            <View style={{height:vettingAlert ? height/2 : height/1.70, marginBottom:60}}>
            <FlatList
                data={searchData?.length === 0 ? allJobs : searchData}
                style={{ paddingRight: 5,paddingLeft: 5}}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                renderItem={({ item, index }) => (
                    <View style={{ paddingLeft: 10, marginRight: 10 }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('JobDetails', { jobID: item.id })}
                        >
                            <View style={styles.itemContainer}>
                                <View style={{ alignItems: "center", alignSelf: "flex-start", marginRight: 10 }}>

                                    <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", width: 100, alignItems: "center", justifyContent: "center", }}>
                                        <Image style={{ width: 100, height: 100, resizeMode: "contain" }} source={backGroundImage1} />
                                    </View>

                                </View>

                                <View style={{ flex: 1, paddingRight: 8, flexDirection: "column", }}>
                                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                        <Text style={{ textTransform: 'uppercase', color: "black", fontSize: 14, fontWeight: "bold" }}>{item.title}</Text>
                                        
                                    </View>
                                    <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "column", }}>
                                            <View style={{ flexDirection: "row", }}>
                                                <View style={{flex:1}}>
                                                <Text  style={{ fontSize: 13, color: "#6BC7E2" }}>Night Shift</Text>
                                                </View>
                                                <View style={{flex:1,alignItems:'flex-end'}}>
                                                <Text style={{ textTransform: 'uppercase', color: "#1FC7B2", fontSize: 12, }}>£{item.budget}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: "row", }}>
                                                <Text numberOfLines={2} style={{ fontSize: 12, color: "#666666", marginTop: 5, }}>{item.detail}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                                            <Text style={{ color: "#666666", fontSize: 11, fontFamily: 'NotoSans-Medium', marginTop: 2 }}></Text>

                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ paddingLeft: 1, color: "#666666", fontSize: 9, }}>{item.location_name}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            />
            </View>
        </View>
    </View>
    );
      
    const SecondRoute = () => (
        <View style={{ backgroundColor: '#F2F2F5', flex: 1, }}>
             <View style={{height:vettingAlert ? height/2 : height/1.55, marginBottom:60}}>
            <FlatList
                data={allJobs?.filter(x=>x.applied=="1")}
                style={{ paddingRight: 5,paddingLeft: 5}}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                renderItem={({ item, index }) => (
                    <View style={{ paddingLeft: 10, marginRight: 10 }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('JobDetails', { jobID: item.id })}
                        >
                            <View style={styles.itemContainer}>
                                <View style={{ alignItems: "center", alignSelf: "flex-start", marginRight: 10 }}>

                                    <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start", width: 100, alignItems: "center", justifyContent: "center", }}>
                                        <Image style={{ width: 100, height: 100, resizeMode: "contain" }} source={backGroundImage1} />
                                    </View>

                                </View>

                                <View style={{ flex: 1, paddingRight: 8, flexDirection: "column", }}>
                                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                                        <Text style={{ textTransform: 'uppercase', color: "black", fontSize: 14, fontWeight: "bold" }}>{item.title}</Text>
                                        
                                    </View>
                                    <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "column", }}>
                                            <View style={{ flexDirection: "row", }}>
                                                <View style={{flex:1}}>
                                                <Text  style={{ fontSize: 13, color: "#6BC7E2" }}>Night Shift</Text>
                                                </View>
                                                <View style={{flex:1,alignItems:'flex-end'}}>
                                                <Text style={{ textTransform: 'uppercase', color: "#1FC7B2", fontSize: 12, }}>£{item.budget}</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: "row", }}>
                                                <Text numberOfLines={2} style={{ fontSize: 12, color: "#666666", marginTop: 5, }}>{item.detail}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                                            <Text style={{ color: "#666666", fontSize: 11, fontFamily: 'NotoSans-Medium', marginTop: 2 }}></Text>

                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                                                <Text style={{ paddingLeft: 1, color: "#666666", fontSize: 9, }}>{item.location_name}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            />
            </View>
        </View>
    );
    const ThirdRoute = () => (
        <View style={{ backgroundColor: '#F2F2F5', flex: 1, }}>
            <FlatList
                data={myInvitation}
                style={{ paddingRight: 5,paddingLeft: 5}}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { jobID: item.id })} key={item.id} style={{ backgroundColor: "#1FC7B2", marginTop: '6%', borderRadius: 10, padding: 10 }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{}}>
                                <Text style={{ fontWeight: 'bold', color: 'white', marginLeft: '5%', paddingTop: '5%' }}>{item?.title}</Text>
                                <Text style={{ paddingTop: '3%', color: 'white', marginLeft: '5%', }}>{item?.company_name}</Text>
                                <View style={{ padding: 8 }} />
                                <Text style={{ marginTop: '4%', color: 'white', marginLeft: '5%', fontWeight: '700' }}>Job Timing</Text>
                                <Text style={{ marginTop: '0.7%', color: 'white', marginLeft: '5%', }}>{item?.start_time + "-" + item?.end_time}</Text>
                            </View>
                            <Image
                                source={backGroundImage1}
                                style={{ width: 80, height: 80, marginRight: '3%', }}
                            />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

      const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        third:ThirdRoute
      });

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
            <View style={{ paddingHorizontal: 20, backgroundColor: '#F2F2F5', marginTop: -20 }}>
                <Text style={{ fontSize: 22, fontWeight: '700', }}>Search Results  </Text>
                <View style={{ borderRadius: 15, height: 40, backgroundColor: '#E6E8E7', flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                    <TextInput
                        onChangeText={(txt) => searchItem(txt)}
                        placeholder='Search here'
                        style={{ paddingLeft: "6%",color:'black' }}
                    />
                    <Image
                        source={search}
                        style={{ width: 25, height: 25, alignSelf: 'center', marginRight: '3%' }}
                    />
                </View>
            </View>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={props => <TabBar {...props}
                    indicatorStyle={{ backgroundColor: 'white' }}
                    style={{ backgroundColor: "#1FC7B2", }} />}
            />
            {isAnimating &&
                <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
            }
        </SafeAreaView>
    
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
    itemContainer: {

        // height: 90,
        backgroundColor: "white",
        marginTop: 7,
        padding: 10,
        paddingBottom: 5,
        marginBottom: 7,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,



    },
});
export default Search;
