import React, { useState, useEffect, useContext, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    StyleSheet,
    StatusBar,
    Image,
    Modal,
    ActivityIndicator,
    ScrollView,
    PermissionsAndroid,
    TouchableHighlight,
    Alert,
    Button,
    Platform,
    Linking
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import CountDown from 'react-native-countdown-component';
import back from '../Assets/Icons/Arrr.png';
import modal from '../Assets/Images/modal1.png';
import modal1 from '../Assets/Images/modal2.png';
import modal2 from '../Assets/Images/modal3.png';
import modal3 from '../Assets/Images/modal4.png';
import calenderDate from '../Assets/Icons/calendardate.png'
import camera from '../Assets/Icons/camera.png'

import { domain } from '../Api/Api'
import services from '../services/Services'

import bell from '../Assets/Icons/bell_icon.png';
import backGroundImage1 from '../Assets/Images/backGroundImage1.png';
import ProgressCircle from 'react-native-progress-circle';
import RNLocation from 'react-native-location';
import { USER_TIMER } from '../redux/reducers/TimerAndCheckInUser'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons';

function ScreenOne({ navigation, route }) {
    const userTimer = useSelector(state => state.timer_checkin)
    const dispatch = useDispatch()
    const [SIKNESS, setSIKNESS] = useState(false);
    const [Holidays, setHolidays] = useState(false);
    const [Incident, setIncident] = useState(false);
    const [late, setlate] = useState(false);
    const [isCheckIn, setIsCheckIn] = useState(false);
    const [isAnimating, setAnimating] = useState(false);

    const [sinknessTxt, setSinknessTxt] = useState('')
    const [lateTxt, setLateTxt] = useState('')
    const [incidentReportTxt, setIncidentReportTxt] = useState('')

    const [timer,setTimer] = useState(0);
    const [authAS,setAuthAS] = useState({});
    const [jobDetail,setJobDetail] = useState({});


    RNLocation.configure({
        distanceFilter: 5.0
      });

    const saveTime = () => {
        dispatch({
            type: USER_TIMER,
            payload: userTimer
        })
    }

    Back = () => {
        navigation.goBack()
    }
    
    useEffect(async () => {
        const auth = await services.getAuthData();
        setAuthAS(auth);
        await saveJobDataToState(auth);
    }, [])

    const saveJobDataToState =async(auth=authAS)=>{
        try {
            setAnimating(true)
            const result = await services.get(`job_detail?email=${auth?.email}&job_id=${route.params.id}`, auth?.token)
            console.log(result);
            if (result.success) {
                await setJobDetail(result?.data[0]);
                setTimeCounter(result?.data[0]?.start_time,result?.data[0]?.end_time);
            }
        }
        catch (ex) {
            console.log(ex);
        }
        finally {
            setAnimating(false)
        }
    }

    goToNotification = () => {
        navigation.navigate('Notification')
    }

    const siknessSubmitt = async () => {

        setAnimating(true)
        if (sinknessTxt.length <= 0) {
            alert('please enter reason for sikness')
            return
        }

        const result = await services.post1(`add_sickness?token=2&job_id=4&date=2021-03-12&type=sickness&reason=${sinknessTxt}`)

        if (result.success) {
            setAnimating(false)
            setSIKNESS(false)
            alert('Sikness reason submitted successfully!!')
            return
        }
        setAnimating(false)
        alert(result?.error ? result.error : 'Some thing went wrong!!')
    }

    const lateSubmitt = async () => {
        setAnimating(true)
        if (lateTxt.length <= 0) {
            alert('please enter reason for late')
            return
        }

        const result = await services.post1(`add_late?token=2&job_id=4&date=2021-03-12&type=late&reason=${lateTxt}`)

        if (result.success) {
            setAnimating(false)
            setlate(false)
            alert('Late reason submitted successfully!!')
            return
        }
        setAnimating(false)
        alert(result?.error ? result.error : 'Some thing went wrong!!')
    }
    
    const permissionHandle = async () => {
        let location;
        let permission = await RNLocation.checkPermission({
            ios: 'whenInUse', // or 'always'
            android: {
                detail: 'coarse' // or 'fine'
            }
        });
        if (!permission) {
            permission = await RNLocation.requestPermission({
                ios: "whenInUse",
                android: {
                    detail: "coarse",
                    rationale: {
                        title: "We need to access your location",
                        message: "We use your location to show where you are on the map",
                        buttonPositive: "OK",
                        buttonNegative: "Cancel"
                    }
                }
            })
            console.log(permission)
            alert('Permission to access location was denied');
            location = await RNLocation.getLatestLocation({ timeout: 100 })
            console.log(location);
            return false;
        } else {
            location = await RNLocation.getLatestLocation({ timeout: 100 })
            if(location?.latitude == jobDetail?.latitute &&
               location?.longitude == jobDetail?.longitute)
            {
                console.log(location, location.longitude, location.latitude,location.timestamp)
                return true;
            }
            else{
                alert('Checkin Location is not correct');
                return false;
            }
        }
    }
    const isAccurateTimeToCheckin = () => {
        let start = moment(jobDetail?.date_from)
        let end = moment(jobDetail?.date_to);
        let currentDate = moment(new Date());
        let isExist = false;

        let sameOrAfter= moment(currentDate).isSameOrAfter(start);
        let sameOrBefore= moment(currentDate).isSameOrBefore(end); 
        if(sameOrAfter && sameOrBefore)
        isExist = true;

        console.log(isExist);
        return isExist;
    }

    const checkInCheckOut = async () => {
        isAccurateTimeToCheckin();
        if(jobDetail?.is_checkin != 1)
        {
            if(!isAccurateTimeToCheckin())
            {
              alert("Please Checkin at the Time");
              return;
            }
            const userPositionIsCorrent = await  permissionHandle();
            if(!userPositionIsCorrent)
            return
        }
        setAnimating(true)
        const url = `checkin?email=${authAS.email}&job_id=${route.params.id}&guard_id=${authAS.userId}&${jobDetail?.is_checkin ==1 ? "check_out=1" : "check_in=1"}&checkin_time=${Date.now()}`;
        console.log(url);
        const result = await services.post1(url,authAS.token);
        await saveJobDataToState();
        console.log(url,result);
        if (result.success) {
            setAnimating(false)
            return
        }
        setAnimating(false)
        alert(result?.error ? result.error : 'Some thing went wrong!!')
    }

    const shiftEnd = async () => {
        setAnimating(true)
        const result = await services.put(`end_shift?token=2&job_id=4&end_time=12:15:00`)
        if (result.success) {
            setAnimating(false)
            alert('Your shift is end now!')
            return
        }
        setAnimating(false)
        alert(result?.error ? result.error : 'Some thing went wrong!!')
    }

    const addIncident = async () => {
        if (incidentReportTxt.length <= 0) {
            alert('please add incident report first.')
            return
        }
        setAnimating(true)
        var data = new FormData();
        data.append("token", 2)
        data.append("job_id", 4)
        data.append("report", incidentReportTxt)
        const result = await services.post(`add_incident`, data)
        if (result.success) {
            setAnimating(false)
            setIncident(false)
            alert('Your incident report submitted successfully!')
            return
        }
        setAnimating(false)
        setIncident(false)
        alert(result?.error ? result.error : 'Some thing went wrong!!')
    }

    const setTimeCounter = (startTime, endTime) => {
        const s_h = parseInt(startTime?.split(':')[0]);
        const s_m = parseInt(startTime?.split(':')[1]);

        const e_h = parseInt(endTime?.split(':')[0]);
        const e_m = parseInt(endTime?.split(':')[1]);

        const hours = e_h-s_h;
        var minutes=0;

        if(e_m > s_m)
        minutes = e_m-s_m;
        else
        minutes = s_m-e_m;
        
        var counterTime = hours * 3600 + minutes * 60;
        setTimer(counterTime);
    }

    openLocationOnMap = async (location) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${location}`,
            android: `geo:0,0?q=${location}`,
        })

        Linking.openURL(url)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />
            <Modal visible={SIKNESS} transparent={false}>
                <ScrollView style={{ width: "100%", height: "100%", marginTop: "20%" }}>
                    <View style={styles.modalContainer}>
                        <Image source={modal} style={{ width: "100%", height: 200 }}></Image>

                        <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: '5%', paddingTop: '5%' }}>EXPLAIN REASON FOR SIKNESS</Text>

                        <View style={[styles.inputContainer]}>
                            <TextInput
                                value={sinknessTxt}
                                multiline={true}
                                autoCapitalize="none"
                                placeholder="Your Feedback"
                                placeholderTextColor={'#9a9999'}
                                onChangeText={(val) => setSinknessTxt(val)}
                                style={styles.input2}
                            />

                        </View>

                        <TouchableOpacity style={styles.ModalButton} onPress={siknessSubmitt}>
                            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => { setSIKNESS(false) }}>
                            <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>back</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
                {isAnimating &&
                    <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
                }
            </Modal>
            
            <Modal visible={Holidays} transparent={false}>
                <ScrollView style={{ width: "100%", height: "100%", marginTop: "20%" }}>
                    <View style={styles.modalContainer}>
                        <Image source={modal3} style={{ width: "100%", height: 200 }}></Image>

                        <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: '5%', paddingTop: '5%' }}>Holidays</Text>


                        < View style={{ flexDirection: 'row', alignItems: "center" }} >
                            <Image source={calenderDate} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                            <TextInput
                                style={styles.textField}
                                placeholder='Date'
                                placeholderTextColor='#d5c9de'
                            // onChangeText={(val) => setPhoneNumber(val)}
                            >
                            </TextInput>

                        </ View>
                        < View style={styles.seperater}></ View>

                        <View style={[styles.inputContainer]}>
                            <TextInput
                                multiline={true}
                                autoCapitalize="none"
                                placeholder='Date'
                                placeholderTextColor='#d5c9de'
                                onChangeText={(val) => { }}


                                style={styles.input2}

                                underlineColorAndroid='transparent' />


                        </View>

                        <TouchableOpacity style={styles.ModalButton} onPress={() => { setHolidays(false) }}>
                            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => { setHolidays(false) }}>
                            <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>back</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </Modal>

            <Modal visible={late} transparent={false}  >
                <ScrollView style={{
                    width: "100%", height: "100%", marginTop: "20%",

                }}>
                    <View style={styles.modalContainer}>
                        <Image source={modal2} style={{ width: "100%", height: 200 }}></Image>

                        <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: '5%', paddingTop: '5%' }}>Why You are late?</Text>

                        <View style={[styles.inputContainer]}>
                            <TextInput
                                value={lateTxt}
                                multiline={true}
                                autoCapitalize="none"
                                placeholder="Your Feedback"
                                placeholderTextColor={'#9a9999'}
                                onChangeText={(val) => { setLateTxt(val) }}
                                style={styles.input2}
                                underlineColorAndroid='transparent' />
                        </View>
                        <TouchableOpacity style={styles.ModalButton} onPress={lateSubmitt}>
                            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => { setlate(false) }}>
                            <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>back</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
                {isAnimating &&
                    <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
                }
            </Modal>

            <Modal visible={Incident}  >
                <ScrollView style={{ width: "100%", height: "100%", paddingTop: "20%", }}>
                    <View style={styles.modalContainer}>
                        <Image source={modal1} style={{ width: "100%", height: 200 }}></Image>
                        <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: '5%', paddingTop: '5%' }}>EXPLAIN REASON FOR SIKNESS</Text>

                        <View style={[styles.inputContainer, { height: 80 }]}>
                            <TextInput
                                value={incidentReportTxt}
                                multiline={true}
                                autoCapitalize="none"
                                placeholder="Your Feedback"
                                placeholderTextColor={'#9a9999'}
                                onChangeText={(val) => { setIncidentReportTxt(val) }}
                                style={styles.input2}
                                underlineColorAndroid='transparent' />
                        </View>
                        <TouchableOpacity
                            style={[styles.modalContainer, { backgroundColor: "#CFD2D2", width: "100%", marginTop: 20 }]}>
                            <Image source={camera} style={{ width: 40, height: 40 }}></Image>
                            <Text style={{ fontWeight: 'bold', color: 'black', }}>Upload Image</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.ModalButton} onPress={addIncident}>
                            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => { setIncident(false) }}>
                            <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>back</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
                {isAnimating &&
                    <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
                }
            </Modal>

            <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "#1FC7B2" }}>
                <TouchableOpacity style={styles.back} styles={{ width: "15%" }} onPress={() => { Back() }}>
                    <Image source={back} style={styles.backIcon}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '15%', justifyContent: "center", alignItems: "center" }} onPress={() => { goToNotification() }} >
                    <Image source={bell} style={{ width: 25, height: 25 }}></Image>
                </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#F2F2F5', flex: 1, }}>

                <ScrollView keyboardShouldPersistTaps='handled' style={{ marginBottom: '3%' }}>
                    <View style={{ backgroundColor: "#1FC7B2" }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '90%', marginLeft: '5%', paddingBottom: '5%' }}>
                            {/* <View style={{}}>
                                <Text style={{ fontWeight: 'bold', color: 'white', marginLeft: '5%', paddingTop: '5%' }}>{jobDetail?.title}</Text>
                                {jobDetail?.company_name ?
                                <Text style={{ paddingTop:'3%', color: 'white', marginLeft: '5%', }}>{jobDetail?.company_name}</Text>
                                :
                                <View />
                                }
                                {jobDetail?.address &&
                                <TouchableOpacity onPress={()=>{openLocationOnMap(jobDetail?.address)}}>
                                <Text style={{ paddingTop:jobDetail?.address ? '3%' : 0, color: 'white', marginLeft: '5%', }}>{jobDetail?.address}</Text>
                                </TouchableOpacity>
                                }
                                <View style={{ padding: 8 }} />
                                <Text style={{ marginTop: '4%', color: 'white', marginLeft: '5%', fontWeight: '700' }}>Job Timing</Text>
                                <Text style={{ marginTop: '0.7%', color: 'white', marginLeft: '5%', }}>{jobDetail?.start_time+"-"+jobDetail?.end_time}</Text>
                            </View> */}
                           
                            <View style={{ }}>
                                <Text style={{ fontSize: 18, fontWeight: '700' }}>{jobDetail?.title || "Job Title"}</Text>
                                <Text style={{ fontSize: 16, marginVertical: 2 }}>{jobDetail?.company_name || 'SSGC LTD'}</Text>
                                <Text style={{ fontSize: 16, marginVertical: 2 }}>{jobDetail?.city || 'Manchester'}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10, borderRadius: 5, padding: 7, backgroundColor: '#CACFD2', width: 200 }}>
                                    <Ionicons name='md-cash-outline' size={15} />
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}> £{jobDetail?.budget} an hour</Text>
                                </View>
                                <Text style={{ marginTop: '4%',  fontWeight: 'bold' }}>Job Timing</Text>
                             <Text style={{ marginTop: '0.7%', }}>{jobDetail?.start_time+"-"+jobDetail?.end_time}</Text>
                            </View>
                           
                            <Image
                                source={backGroundImage1}
                                style={{ width: 80, height: 80, }}
                            />
                        </View>
                    </View>
                    <View style={{ width: '100%', padding: "5%", elevation: 2, flexDirection: 'row', marginTop: '3%', paddingBottom: '10%', marginBottom: '5%' }}>
                        <ProgressCircle
                            percent={80}
                            radius={50}
                            borderWidth={8}
                            color='#FFDA6D'
                            shadowColor="#999"
                            bgColor="#fff"
                        >
                            {timer > 0 &&
                                <CountDown
                                    size={9}
                                    until={timer}
                                    onFinish={() => alert('Finished')}
                                    digitStyle={{ backgroundColor: '#FFF', borderWidth: 0, }}
                                    // digitTxtStyle={{ color: '#FFDA6D' }}
                                    timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
                                    // separatorStyle={{ color: '#1CC625' }}
                                    timeToShow={['H', 'M', 'S']}
                                    running={jobDetail?.is_checkin==1 ? true : false}
                                    timeLabels={{ m: null, s: null }}
                                    showSeparator
                                />
                            }
                        </ProgressCircle>
                       
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 0.49, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Sector</Text>
                                <Text style={{ fontSize: 12, paddingTop: '1.5%', paddingBottom: '15%', textAlign: 'center' }}>{jobDetail?.skill_name}</Text>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Services</Text>
                                <Text style={{ fontSize: 12, textAlign: 'center' }}>Lorem Ipsum</Text>
                            </View>
                            <View style={{ flex: 0.02, borderLeftWidth: 0.5, borderLeftColor: 'grey' }} />
                            <View style={{ flex: 0.49, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Job Type</Text>
                                <Text style={{ fontSize: 12, paddingTop: '1.5%', paddingBottom: '15%', textAlign: 'center' }}>{jobDetail?.job_type}</Text>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>Industry</Text>
                                <Text style={{ fontSize: 12, textAlign: 'center' }}>Corporate</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', marginTop: '3%' }}>

                        <TouchableOpacity onPress={checkInCheckOut} style={{ width: '90%', backgroundColor: '#1E7EC7', marginTop: '5%', marginLeft: '5%', padding: '3%', alignItems: 'center', borderRadius: 8 }}>
                            <Text style={{ color: 'white' }}>{jobDetail?.is_checkin == 1 ? 'CHECK OUT' : 'CHECK IN' }</Text>
                        </TouchableOpacity>

                        {jobDetail?.is_checkin == 1 &&
                        <>
                        <TouchableOpacity
                            onPress={shiftEnd}
                            style={{ width: '90%', backgroundColor: '#1E7EC7', marginTop: '5%', marginLeft: '5%', padding: '3%', alignItems: 'center', borderRadius: 8 }}>
                            <Text style={{ color: 'white' }}>END SHIFT</Text>
                        </TouchableOpacity>
                      
                        <TouchableOpacity style={{ width: '90%', backgroundColor: '#FE4154', marginTop: '5%', marginLeft: '5%', padding: '3%', alignItems: 'center', borderRadius: 8 }}
                            onPress={() => {
                                setIncident(true)
                            }}>
                            <Text style={{ color: 'white' }}>INCIDENT REPORT</Text>
                        </TouchableOpacity>
                        </>
                       }
                        <View style={{ flexDirection: 'row',paddingHorizontal:20, justifyContent: 'space-evenly', marginTop: '5%' }}>
                         {jobDetail?.is_checkin == 1 &&
                            <TouchableOpacity style={{ flex:1, backgroundColor: "#FE4154", borderRadius: 7, justifyContent: 'center', alignItems: 'center', padding: '3%' }} onPress={() => { setHolidays(true) }}>
                                <Text style={{ color: 'white' }}>EMERGENCY</Text>
                            </TouchableOpacity>
                           }
                            {jobDetail?.is_checkin != 1 &&
                            <TouchableOpacity style={{ flex:1, backgroundColor: "#1FC7B2", borderRadius: 7, justifyContent: 'center', alignItems: 'center', padding: '3%' }}
                                onPress={() => navigation.navigate('ChangeShift')}
                            >
                                <Text style={{ color: 'white' }}>CHANGE SHIFT</Text>
                            </TouchableOpacity>
                             }
                        </View>
                        {jobDetail?.is_checkin != 1 &&
                        <View style={{ flexDirection: 'row',paddingHorizontal:20, justifyContent: 'space-evenly', marginTop: '5%' }}>
                            <TouchableOpacity style={{ flex:1, backgroundColor: '#1E7EC7',marginRight:10, borderRadius: 7, justifyContent: 'center', alignItems: 'center', padding: '3%' }}
                                onPress={() => {
                                    setLateTxt('')
                                    setlate(true)
                                }}>
                                <Text style={{ color: 'white' }}>LATE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex:1, backgroundColor: '#1E7EC7', borderRadius: 7, justifyContent: 'center', alignItems: 'center', padding: '3%' }}
                                onPress={() => {
                                    setSinknessTxt('')
                                    setSIKNESS(true)
                                }}
                            >
                                <Text style={{ color: 'white' }}>SICKNESS</Text>
                            </TouchableOpacity>
                        </View>
                       }
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
        alignContent: 'center',
    },
    backIcon: {
        height: 20,
        width: 20,
    },
    back: {
        height: 50,
        width: 50,
        marginLeft: 15,
        justifyContent: 'center'
    },
    ModalButton: {
        marginBottom: 10,
        marginTop: 30,
        alignSelf: 'center',
        height: 40,
        width: "100%",
        backgroundColor: "#1FC7B2",
        justifyContent: 'center',
        alignItems: 'center',

        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textField: {
       color:'black',
        marginRight: 30,
        width: '70%',
        marginTop: 6,
        marginBottom: 3,
        paddingTop: '3%',
        paddingBottom: '3%',


    },
    seperater: {
        height: 0.5,
        width: "90%",
        backgroundColor: 'black'

    },
    modalContainer: {
        flex: 1,
        width: "90%",
        backgroundColor: "white",
        alignSelf: "center",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: "hidden",

    },
    inputContainer: {
        marginTop: 20,
        width: "100%",

        height: 100,
        backgroundColor: '#FFF',
        borderRadius: 25,

        borderWidth: 0.5,
        shadowColor: "#B3B3B3",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    input2: {
        fontSize: 15,
        width: "100%",
        paddingLeft: 20,
        paddingBottom: 140,
        color: '#9a9999',
        marginTop: 10,


    },
    modalHeading: {
        color: "black", fontSize: 22,
        fontWeight: 'bold', marginTop: 15,
        marginBottom: 20, alignSelf: "flex-start",
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

const options = {
    container: {
        paddingVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        color: '#FFF',
        marginLeft: 7,
    },
};

export default ScreenOne;