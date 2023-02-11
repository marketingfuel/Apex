
import React, { useState, useEffect, useContext, useRef } from "react";
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
} from "react-native";
import { isIphoneX } from 'react-native-iphone-x-helper';
import backGroundImage1 from '../Assets/Images/backGround2.png'
import logo from '../Assets/Images/logo.png'
import name from '../Assets/Icons/name.png'
import addresss from '../Assets/Icons/address.png'
import back from '../Assets/Icons/Arrr.png';
import RadioButton from '../Compmonent/RadioButton'
const screenheight = Dimensions.get('window').height;
import user from '../Assets/Icons/user.png'
import passwordd from '../Assets/Icons/password.png'
var validator = require("email-validator");
import { domain } from "../Api/Api";
import * as Animatable from 'react-native-animatable';
const screenWidth = Dimensions.get("window").width
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import services from '../services/Services'


export default function ForgetPassword({ navigation }) {

    const [email, setEmail] = useState("");
    const [isAnimating, setAnimating] = useState(false);
    const [isDisabled, setDisabled] = useState(false);

    Back = () => {
        navigation.goBack()
    }

    sendEmail = async () => {
        if (email) {
            alert(`Check your email ! \n If your email ${email} is associated with your account at Apex. then you must receive a password reset email.`)
            navigation.navigate('signIn')
            try {
                setAnimating(true)
                const result = await services.get(`forgot_password?email=${email}`)
                console.log(result)
                // if (result?.success) {
                //     setAnimating(false)
                // }
                // else {
                //     alert(result?.message)
                // }
                setAnimating(false)
            }
            catch (ex) {
                alert(ex.message || 'Server Error');
                console.log(ex);
            }
            finally {
                setAnimating(false)
            }
        }
        else {
            alert("Email is required")
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />
            <View style={{ width: "100%" }}>
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
                <Animatable.View animation="fadeInUp" style={{ backgroundColor: "white" }} >
                    {/* 
                    <Animatable.Text animation="fadeInUp" style={styles.subheading}>Proceed with your</Animatable.Text>
                    <Animatable.Text animation="fadeInUp" style={styles.heading}>Login</Animatable.Text> */}
                    <Animatable.View style={[styles.bottomView, { marginTop: 0 }]} animation="fadeIn" >
                        <Text style={[styles.label, { marginLeft: 0, }]}>Enter Email to Reset Password</Text>
                    </Animatable.View>

                    <Animatable.Text animation="fadeInUp" style={styles.label}>Email</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', justifyContent: 'space-between' }} >

                        <TextInput
                            style={styles.textField}
                            placeholder='jhondoe@gmail.com'
                            placeholderTextColor='#d5c9de'
                            value={email}
                            onChangeText={(val)=>{
                              setEmail(val);
                            }}
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                            textContentType={"name"}>
                        </TextInput>

                        <Image source={user} style={{ height: 15, width: '4%', marginTop: 17, marginRight: 35 }}></Image>
                    </Animatable.View>
                    <Animatable.View animation="fadeInUp" >

                        <TouchableOpacity style={styles.button} onPress={() => sendEmail()}>
                            <Text style={styles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                    </Animatable.View>

                    <Image source={logo} style={styles.logo}></Image>

                    <View style={{ height: 100 }}></View>
                </Animatable.View>

            </KeyboardAwareScrollView>

            {
                isAnimating &&
                <ActivityIndicator size="large" color="#0178B9" animating={isAnimating} style={styles.loading} />
            }
        </SafeAreaView >
    )
}


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 35 : 0;
const STATUSBAR_COLOR = Platform.OS === 'ios' ? 'white' : '#0178B9';
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
        marginTop: Platform.OS == "ios" ? screenheight - 700 : screenheight - 650,

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
        marginLeft: 30,
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
        marginBottom: 10,
        backgroundColor: '#d5c9de'

    },
    ForgotPassword: {
        alignSelf: 'center',
        marginTop: 15,
        color: '#acacac',
        fontSize: 15
    },
    button: {
        marginTop: 30,
        alignSelf: 'center',
        height: 50,
        width: screenWidth - 60,
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
        fontSize: 17,
    },
    bottomView: {
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        marginBottom: 10,
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

});