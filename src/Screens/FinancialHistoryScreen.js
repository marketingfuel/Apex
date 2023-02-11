import React, { useState ,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image, ImageBackground,
    StatusBar,
    Alert,
    TextInput,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    AsyncStorage, BackHandler, SafeAreaView, KeyboardAvoidingView,
    Button
} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import paycase from '../Assets/Icons/paycase.png';
import backGroundImage1 from '../Assets/Images/backGround4.png';
import logo from '../Assets/Images/logo.png'
import name from '../Assets/Icons/name.png'
import addresss from '../Assets/Icons/address.png'
import back from '../Assets/Icons/Arrr.png';
import nationalityy from '../Assets/Icons/nationality.png';
import card from '../Assets/Icons/crad.png';
import phone from '../Assets/Icons/phone.png';
import add from '../Assets/Icons/add.png';
import RadioButton from '../Compmonent/RadioButton'
import services from '../services/Services'

import user from '../Assets/Icons/user.png'
import passwordd from '../Assets/Icons/password.png'
var validator = require("email-validator");
import { domain } from "../Api/Api";

import * as Animatable from 'react-native-animatable';
const screenWidth = Dimensions.get("window").width
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import calenderDate from '../Assets/Icons/calendardate.png'


function FinancialHistory({ navigation }) {
    const [isAnimating, setAnimating] = useState(false);

    const [attachment,setAttachment] = useState(null);
    const [bankrupt,setBankrupt] = useState(null);
    const [ccj,setCCJ] = useState(null);

    useEffect(() => {
        getFinancialHistory()
    }, [])

    saveFinancialHistory = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            let url = `financial?email=${auth?.email}&financial_attachment=${attachment ? "1" : "0"}&financial_bankrupt=${bankrupt ? "1" : "0"}&financial_ccj=${ccj ? "1" : "0"}`
            const result = await services.post1(url, auth?.token);
            console.log(result);
            navigation.navigate("Vetting");
        }
        catch (ex) {
            console.log(ex)
        }
        finally {
            setAnimating(false)
        }
    }

    getFinancialHistory = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            let url = `get_financial_detail?email=${auth?.email}`
            const result = await services.get(url, auth?.token);
            if(result.success)
            {
                const data = result?.data[0];
                setAttachment(data?.financial_attachment == "0" ? false : true);
                setBankrupt(data?.financial_bankrupt == "0" ? false : true);
                setCCJ(data?.financial_ccj == "0" ? false : true);
            }
            console.log(result);
        }
        catch (ex) {
            console.log(ex)
        }
        finally {
            setAnimating(false)
        }
    }

    Back = () => {
        navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />
            <View style={{ width: "100%", backgroundColor: '#1FC7B2' }}>
                <TouchableOpacity style={styles.back} styles={{ width: "15%" }} onPress={() => { Back() }}>
                    <Image source={back} style={styles.backIcon}></Image>
                </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animatable.View animation="fadeInUp" style={{ height: 280, }} >

                    <ImageBackground source={backGroundImage1} style={{
                        flex: 1,
                        resizeMode: "contain",
                    }}>

                    </ImageBackground>
                </Animatable.View>
                <View style={{ backgroundColor: 'white', paddingBottom: '4%' }}>
                    <Animatable.View animation="fadeInUp" style={{ backgroundColor: "white" }} >

                        <Image source={logo} style={styles.logo}></Image>
                        <Animatable.View style={[styles.bottomView, { marginTop: 0 }]} animation="fadeIn" >
                            <Text style={[styles.label, { marginLeft: 0, }]}>Financial History</Text>
                        </Animatable.View>
                    </Animatable.View>
                    <View style={{ width: '90%', marginLeft: '5%', backgroundColor: 'white', marginTop: '5%' }}>
                        <Text style={{ fontSize: 15 }}>Have you any oustanding attachment to earning?</Text>
                        <Animatable.View animation="fadeInUp" style={{}}>
                        <RadioButton
                            setFirstValue={()=>{setAttachment(true)}}
                            firstValue={attachment}
                            text1={"Yes"}
                            setSecondValue={()=>{setAttachment(false)}}
                            secondValue={attachment != null ? !attachment : false}
                            text2={"No"}
                        />
                        </Animatable.View>
                    </View>

                    <View style={{ width: '90%', marginLeft: '5%', backgroundColor: 'white', marginTop: '5%' }}>
                        <Text style={{ fontSize: 15 }}>Do you have any bankcrupcy order or any voluntary arrangements?</Text>
                        <Animatable.View animation="fadeInUp" style={{}}>
                        <RadioButton
                            setFirstValue={()=>{setBankrupt(true)}}
                            firstValue={bankrupt}
                            text1={"Yes"}
                            setSecondValue={()=>{setBankrupt(false)}}
                            secondValue={bankrupt != null ? !bankrupt : false}
                            text2={"No"}
                        />
                        </Animatable.View>
                    </View>

                    <View style={{ width: '90%', marginLeft: '5%', backgroundColor: 'white', marginTop: '5%' }}>
                        <Text style={{ fontSize: 15 }}>Are you the subject of any country court proceedings(CCJs)?</Text>
                        <Animatable.View animation="fadeInUp" style={{}}>
                        <RadioButton
                            setFirstValue={()=>{setCCJ(true)}}
                            firstValue={ccj}
                            text1={"Yes"}
                            setSecondValue={()=>{setCCJ(false)}}
                            secondValue={ccj != null ? !ccj : false}
                            text2={"No"}
                        />
                        </Animatable.View>
                    </View>



                    {/* <View style={[{ marginTop: '4%', borderRadius: 10, width: '90%', marginLeft: '5%', flexDirection: 'row', alignItems: "center", justifyContent: "space-between", backgroundColor: 'white', elevation: 5, height: 40 }, styles.shadStyle]} >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={paycase} style={{ alignSelf: 'center', height: 15, width: 15, marginLeft: 15, marginRight: 10 }}></Image>

                            <TextInput
                                style={[styles.textField, { paddingTop: '1%', paddingBottom: '1%' }]}
                                placeholder='Add Job History'
                                placeholderTextColor='black'
                                onChangeText={(val) => setPhoneNumber(val)}
                            >
                            </TextInput>
                        </View>
                        <Image style={{ width: 10, height: 10, marginRight: 15 }} source={require('../Assets/Icons/plus.png')} />
                    </View> */}



                    {/* <View style={[{ marginTop: '4%', borderRadius: 10, width: '90%', marginLeft: '5%', flexDirection: 'row', alignItems: "center", backgroundColor: 'white', justifyContent: "space-between", elevation: 5, height: 40 }, styles.shadStyle]} >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../Assets/Icons/document.png')} style={{ alignSelf: 'center', height: 15, width: 15, marginLeft: 15, marginRight: 10 }}></Image>

                            <TextInput
                                style={[styles.textField, { paddingTop: '1%', paddingBottom: '1%' }]}
                                placeholder='Attach Document'
                                placeholderTextColor='black'
                                onChangeText={(val) => setPhoneNumber(val)}
                            >
                            </TextInput>
                        </View>
                        <Image style={{ width: 10, height: 10, marginRight: 15 }} source={require('../Assets/Icons/attchdoc.png')} />
                    </View> */}

                    <View style={[{ marginTop: '4%', borderRadius: 10, width: '90%', marginLeft: '5%', flexDirection: 'row', alignItems: "center", backgroundColor: 'white', justifyContent: "space-between", elevation: 5, height: 40 }, styles.shadStyle]} >
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={paycase} style={{ alignSelf: 'center', height: 15, width: 15, marginLeft: 15, marginRight: 10 }}></Image>

                            <TextInput
                                style={[styles.textField, { paddingTop: '1%', paddingBottom: '1%' }]}
                                placeholder='Declaration'
                                placeholderTextColor='black'
                                onChangeText={(val) => {}}
                            >
                            </TextInput>
                        </View>
                        <Image style={{ width: 10, height: 10, marginRight: 15 }} source={require('../Assets/Icons/plus.png')} />
                    </View>

                    <View style={{ flexDirection: 'row', width: '90%', marginLeft: '5%', marginTop: '10%' }}>
                        <Image source={require('../Assets/Icons/checked.png')} style={{
                            width: 15, height: 15
                        }} />
                        <Text style={{ fontSize: 15, marginLeft: 4 }}>Lorem Ipsum is has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled</Text>
                    </View>

                    <Animatable.View animation="fadeInUp" >

                        <TouchableOpacity onPress={saveFinancialHistory} style={styles.button}  >
                            <Text style={styles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                    </Animatable.View>


                    <View style={{ height: 100 }}></View>
                </View>
            </KeyboardAwareScrollView>
            {
                isAnimating &&
                <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
            }
        </SafeAreaView>
    );
}


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 35 : 0;
const STATUSBAR_COLOR = Platform.OS === 'ios' ? 'white' : '#1FC7B2';
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 0 : 56;
const styles = StyleSheet.create({
    statusBar: {
        height: STATUSBAR_HEIGHT,
        backgroundColor: STATUSBAR_COLOR
    },
    container: {
        flex: 1,
        backgroundColor: "#1FC7B2",
        marginBottom: isIphoneX() ? -35 : 0,
        paddingBottom: isIphoneX() ? 35 : 0,
        marginTop: isIphoneX() ? -5 : 0,
    },
    background: {
        flex: 1,
        resizeMode: "cover",
    },
    back: {

        height: 50,
        width: 50,
        marginLeft: 15,
        justifyContent: 'center'
    },
    backIcon: {
        height: 30,
        width: 30,
    },
    logo: {
        resizeMode: "contain",
        height: 90,
        width: 120,

        alignSelf: "center"
    },
    heading: {
        marginLeft: 30,
        marginTop: 5,
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subheading: {
        marginLeft: 30,
        marginTop: 10,
        fontSize: 20,
        fontWeight: '300',
        marginBottom: 0,
    },
    label: {
        marginLeft: 30,
        marginTop: 15,
        fontWeight: '300',
        fontSize: 14,
        fontWeight: 'bold'
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
        height: 1,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#d5c9de'

    },
    ForgotPassword: {
        alignSelf: 'center',
        marginTop: 15,
        color: '#acacac',
        fontSize: 15
    },
    button: {
        backgroundColor: "#1FC7B2", marginTop: 10,
        marginTop: 30,
        alignSelf: 'center',
        height: 50,
        borderRadius: 10,

        width: screenWidth - 60,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 17,
    },
    bottomView: {
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
    },
    newUser: {
        fontSize: 15,
        color: '#010a0a',
    },
    register: {
        color: '#1FC7B2',
        fontSize: 15,
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
    shadStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,

        elevation: 5,
    },

});
export default FinancialHistory;