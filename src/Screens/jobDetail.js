import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Linking,
    Platform
} from 'react-native';
import back from '../Assets/Icons/Arrr.png';
import pizza from '../Assets/Icons/pizza.png';
import jobImage from '../Assets/Images/backGround2.png'
import locationTwo from '../Assets/Icons/locationtwo.png';
import maps from '../Assets/Icons/maps.png';
import arrowDown from '../Assets/Icons/downarrow.png';
import services from '../services/Services'
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


function JobDetails({ route, navigation }) {
    const [isAnimating, setAnimating] = useState(false);
    const [jobDetail, setJobDetail] = useState()
    const { jobID } = route.params

    Back = () => {
        navigation.goBack()
    }

    useEffect(() => {
        getJobDetail()
    }, [jobID])

    const getJobDetail = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            const result = await services.get(`job_detail?email=${auth?.email}&job_id=${jobID}`,auth?.token)
            console.log(result);
            if (result.success && result.data) {
                setJobDetail(result.data[0])
            }
            else{
                alert(result.message)
            }
        }
        catch (ex) {
            alert('Some thing went wrong!!')
        }
        finally {
            setAnimating(false)
        }
    }

    const applyJob = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            const result = await services.post1(`apply_job?email=${auth?.email}&job_id=${jobID}`,auth?.token)
            console.log(result);
            if (result.success) {
                getJobDetail();
                alert(result.message)
            }
        }
        catch (ex) {
            alert('Some thing went wrong!!')
        }
        finally {
            setAnimating(false)
        }
    }

    const openLocationOnMap = async (location) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${location}`,
            android: `geo:0,0?q=${location}`,
        })

        Linking.openURL(url)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />
            <View style={{ width: "100%", backgroundColor: "#1FC7B2", flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.back} styles={{ width: "15%" }} onPress={() => { Back() }}>
                    <Image source={back} style={styles.backIcon}></Image>
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 18 }}>Job Detail</Text>
            </View>

            <View style={{ backgroundColor: '#F2F2F5', flex: 1, }}>
                <ScrollView keyboardShouldPersistTaps="handled">

                    <View style={{flexDirection: 'row', paddingHorizontal:20, marginTop: '10%' }}>
                        <Image source={jobImage} style={{flex:1, width: 170, height: 120,marginRight:10, borderRadius: 7, }} />
                        <View style={{flex:1}}>
                            <Text style={{ fontSize: 18, fontWeight: '700' }}>{jobDetail?.title || "Job Title"}</Text>
                            <Text style={{ fontSize: 16,marginVertical:2}}>{jobDetail?.company_name || 'SSGC LTD'}</Text>
                            <Text style={{ fontSize: 16,marginVertical:2}}>{jobDetail?.city || 'Manchester'}</Text>
                            <View style={{ flexDirection: 'row',marginTop:10, borderRadius:5,padding: 7,backgroundColor:'#CACFD2',width:'70%' }}>
                                <Ionicons name='md-cash-outline' size={15} />
                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}> £{jobDetail?.budget} an hour</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.seperater, { marginLeft: 0, marginRight: 0, marginTop: '5%' }]} />
                    <View style={{ flexDirection: 'row',flex:1 }}>
                        <View style={{flex:1,padding:20}}>
                            <Text style={{ fontSize: 17, fontWeight: 'bold',marginBottom:10 }}>Job Description</Text>
                            <Text style={{  fontSize: 15}}>{jobDetail?.detail}</Text>
                            <Text style={{  fontSize: 15}}>Lorem Ipsum is simply dummy text of the</Text>
                            <Text style={{  fontSize: 15}}>Lorem Ipsum is simply dummy text of the</Text>
                        </View>

                    </View>
                   

                    <View style={[styles.seperater, { marginLeft: 0, marginRight: 0, marginTop: '5%' }]} />

                    <View style={{ width: '90%', marginLeft: '5%', marginTop: '1%' }}>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>Location</Text>
                        </View>

                        <TouchableOpacity onPress={()=>{openLocationOnMap(jobDetail?.location_name)}} style={{ flexDirection: 'row',marginVertical:10 }}>
                                <Image source={locationTwo} style={{ width: 20, height: 20 }} />
                                <Text style={{ color: '#1dc7b1', fontSize: 17 }}>{jobDetail?.location_name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{openLocationOnMap(jobDetail?.location_name)}} style={{ width: '100%' }}>
                            <Image source={maps} style={{ width: '100%', height: 120, marginTop: '3%' }} />
                        </TouchableOpacity>

                    </View>
                    {/* <Text style={{ marginTop: '3%', marginLeft: '5%', fontSize: 17, fontWeight: 'bold' }}>Car Parking</Text>
                    <Text style={{ marginTop: '1%', marginLeft: '5%' }}>{jobDetail?.car_parking === '0' ? 'Not Available' : 'Available'}</Text> */}

                    {/* <Text style={{ marginTop: '3%', marginLeft: '5%', fontSize: 17, fontWeight: 'bold' }}>Requirements</Text>

                    <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: '5%', marginTop: '2%' }}>
                        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "black" }}></View>

                        <Text style={{ marginLeft: '3%', fontSize: 15 }}>Lorem Ipsum is simply dummy text of the</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: '5%', marginTop: '2%' }}>
                        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "black" }}></View>

                        <Text style={{ marginLeft: '3%', fontSize: 15 }}>Lorem Ipsum is simply dummy text of the</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: '5%', marginTop: '2%' }}>
                        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "black" }}></View>

                        <Text style={{ marginLeft: '3%', fontSize: 15 }}>Lorem Ipsum is simply dummy text of the</Text>
                    </View> */}

                    {/* <Text style={{ fontSize: 20, marginLeft: '5%', marginTop: '7%' }}>Shift Available</Text> */}

                    <View style={{ width: '90%', marginLeft: "5%", flexDirection: 'row', justifyContent: 'space-between', marginTop: '5%' }}>
                        <Text style={{ fontSize: 19, alignSelf: 'center' }}>Date</Text>
                        <Image style={{ width: 15, height: 15, alignSelf: 'center' }} source={arrowDown} />
                    </View>

                    <View style={{ flexDirection: 'row', width: '90%', marginLeft: '5%', borderWidth: 0.5, borderRadius: 8, borderColor: '#d5c9de', marginTop: '5%' }}>
                        <View style={{ paddingVertical: '7%', marginLeft: '7%', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18 }} >05</Text>
                            <Text style={{ fontSize: 18, color: 'gray' }}>Aug</Text>
                        </View>

                        <View style={{ paddingVertical: '7%', marginLeft: '9%', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18 }} >06</Text>
                            <Text style={{ fontSize: 18, color: 'gray' }}>Aug</Text>
                        </View>

                        <View style={{ paddingVertical: '7%', marginLeft: '9%', alignItems: 'center', }}>
                            <Text style={{ fontSize: 18, color: '#1dc7b1', }} >07</Text>
                            <Text style={{ fontSize: 18, color: '#1dc7b1', }}>Aug</Text>
                        </View>

                        <View style={{ paddingVertical: '7%', marginLeft: '9%', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18 }} >08</Text>
                            <Text style={{ fontSize: 18, color: 'gray' }}>Aug</Text>
                        </View>

                        <View style={{ paddingVertical: '7%', marginLeft: '9%', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18 }} >09</Text>
                            <Text style={{ fontSize: 18, color: 'gray' }}>Aug</Text>
                        </View>

                    </View>
                    <Text style={{ fontSize: 19, marginLeft: '5%', marginTop: '5%' }}>Time</Text>
                   
                    <View style={{ flexDirection: 'row', width: '90%', marginLeft: '5%', borderWidth: 0.5, borderRadius: 8, borderColor: '#d5c9de', marginTop: '5%' }}>
                        <Text style={{ paddingVertical: '5%', fontSize: 18, marginLeft: '7%' }}>12:00</Text>
                        <Text style={{ paddingVertical: '5%', fontSize: 18, marginLeft: '5%', color: '#1dc7b1' }}>01:00</Text>
                        <Text style={{ paddingVertical: '5%', fontSize: 18, marginLeft: '5%' }}>02:00</Text>
                        <Text style={{ paddingVertical: '5%', fontSize: 18, marginLeft: '5%' }}>03:00</Text>
                        <Text style={{ paddingVertical: '5%', fontSize: 18, marginLeft: '5%' }}>04:00</Text>

                    </View>
                  

                    {/* <View style={{ width: '90%', marginLeft: '5%', }}>
                        <Text style={{ fontSize: 20, marginLeft: '5%', marginTop: '6%' }}>Uniform</Text>
                        <Image source={require('../Assets/Images/backGround4.png')} style={{ width: '100%', height: 200, marginVertical: '5%' }} />
                    </View>
                    <Text style={{ marginTop: '3%', marginLeft: '5%', fontSize: 17, fontWeight: 'bold' }}>Requirements</Text>

                    <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: '5%', marginTop: '2%' }}>
                        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "black" }}></View>

                        <Text style={{ marginLeft: '3%', fontSize: 15 }}>Lorem Ipsum is simply dummy text of the</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: '5%', marginTop: '2%' }}>
                        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "black" }}></View>

                        <Text style={{ marginLeft: '3%', fontSize: 15 }}>Lorem Ipsum is simply dummy text of the</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: '5%', marginTop: '2%' }}>
                        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: "black" }}></View>
                        <Text style={{ marginLeft: '3%', fontSize: 15 }}>Lorem Ipsum is simply dummy text of the</Text>
                    </View> */}
              <View style={{padding:20}}>
                    <TouchableOpacity
                        onPress={applyJob}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                            {jobDetail?.applied == 1 ? "APPLIED" : "APPLY NOW"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{alert('Job Saved Successfully')}}
                        style={styles.buttonWithIcon}>
                            <EntypoIcons name='heart-outlined' style={{marginRight:10}} size={25} />
                        <Text style={styles.buttonWithIconText}>
                            {"Save this job"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{alert('Comming Soon')}}
                        style={styles.buttonWithIcon}>
                            <Ionicons name='copy-sharp' style={{marginRight:10}} size={25} />
                        <Text style={styles.buttonWithIconText}>
                            {"Share this job"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{alert('Reported Successfully')}}
                        style={styles.buttonWithIcon}>
                            <MaterialCommunityIcons name='flag' style={{marginRight:10}} size={25} />
                        <Text style={styles.buttonWithIconText}>
                            {"Report job"}
                        </Text>
                    </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            {isAnimating &&
                <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1FC7B2",
    },
    back: {
        height: 50,
        width: 50,
        marginLeft: 15,
        justifyContent: 'center'
    },
    backIcon: {
        height: 20,
        width: 20,
    },
    button:{
        borderRadius: 15,
        backgroundColor:'#2355C3',
        height: 40,
        justifyContent: 'center',
        marginVertical: 7
    },
    buttonWithIcon:{
        borderRadius: 15,
        backgroundColor:'#CACFD2',
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
        marginVertical: 7,
        flexDirection:'row',
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight:'bold'
    },
    buttonWithIconText:{
        textAlign: 'center',
        color: 'black',
        fontWeight:'bold'
    },
    seperater: {
        height: 1,
        marginLeft: 20,
        marginRight: 30,
        marginBottom: 10,
        backgroundColor: '#d5c9de',
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
})

export default JobDetails;