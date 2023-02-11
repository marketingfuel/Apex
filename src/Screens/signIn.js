
import React, { useState, useEffect, useContext, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
    Alert,
    TextInput,
    Dimensions,
    ActivityIndicator, ImageBackground,
    TouchableOpacity,
    ScrollView, BackHandler, SafeAreaView,
    Button
} from "react-native";
import { isIphoneX } from 'react-native-iphone-x-helper';
import backGroundImage1 from '../Assets/Images/backGroundImage1.png'
import logo from '../Assets/Images/logo.png'
import google from '../Assets/Images/google.png'
import user from '../Assets/Icons/user.png'
import passwordd from '../Assets/Icons/password.png'
var validator = require("email-validator");
import * as Animatable from 'react-native-animatable';
const screenWidth = Dimensions.get("window").width
import services from '../services/Services'
import Icon from 'react-native-vector-icons/Entypo';

export default function login({ navigation }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAnimating, setAnimating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    buSignUp = () => {
        navigation.navigate('signUpScreen')
    }
    buForgotPassword = () => {
        navigation.navigate('forgetPassword')
    }
    Back = () => {
        Navigation.pop(this.props.componentId)
    }
    SiginSuccess = async () => {
        if (email.trim() === "") {
            alert("Email is required");
            return
        }
        else if (validator.validate(email.trim()) === false) {
            alert("Email format is not correct.");
            return
        }
        else if (password === "") {
            alert("Password is required!");
            return
        }
        else {
            loginApi()
        }
    }
    loginApi = async () => {
        try {
            setAnimating(true)
            const result = await services.get(`login_freelancer?email=${email}&password=${password}`)
            console.log(result)
            if (result?.success) {
                const loginResponse = {
                    token: result.data[0]?.api_token,
                    email: result.data[0]?.email,
                    userId: result.data[0]?.id
                }

                await services.saveAuthData(loginResponse);
                setAnimating(false)
                navigation.navigate("App");
            }
            else{
                alert(result?.message || 'Incorrect Email or Password')
            }
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
    emailChangeHandler = (value) => {
        setEmail(value)
    }
    passwordChangeHandler = (value) => {
        setPassword(value)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />

            <ScrollView keyboardShouldPersistTaps={'handled'}>
                <Animatable.View animation="fadeInUp" style={{ height: 300, }} >
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
                    <Animatable.Image animation="fadeInUp" source={logo} style={styles.logo}></Animatable.Image>
                    <Animatable.View style={[styles.bottomView, { marginTop: 10, marginBottom: 10 }]} animation="fadeIn" >
                        <Text style={styles.label}>Enter Login Detail</Text>
                    </Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>Email</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }} >

                        
                        <TextInput
                            style={styles.textField}
                            placeholder='jhondoe@gmail.com'
                            placeholderTextColor='#d5c9de'
                            onChangeText={emailChangeHandler}
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                            value={email}
                            textContentType={"name"}>
                        </TextInput>

                        <Image source={user} style={{ height: 15, width: '4%', marginRight: 35 }}></Image>
                    </Animatable.View>

                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>

                    <Animatable.Text animation="fadeInUp" style={styles.label}>Password</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }} >
                        <TextInput
                            animation="fadeInUp"
                            style={styles.textField}
                            placeholder='********'
                            placeholderTextColor='#d5c9de'
                            autoCapitalize={'none'}
                            textContentType={"password"}
                            onChangeText={passwordChangeHandler}
                            value={password}
                            secureTextEntry={!showPassword}>
                        </TextInput>
                        <TouchableOpacity
                        onPress={()=>{setShowPassword(showPassword ? false : true)}}
                         style={{ width: '5%', marginRight: 35 }}>
                             <Icon name={showPassword ? "eye" : "eye-with-line"} size={18} />
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.ForgotPassword} onPress={buForgotPassword}>Forgot Password?   </Animatable.Text>
                    <Animatable.View animation="fadeInUp" >
                        <TouchableOpacity style={styles.button} onPress={() => SiginSuccess()}>
                            <Text style={styles.buttonText}>Sign In </Text>
                        </TouchableOpacity>
                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" >

                        <TouchableOpacity disabled={false} onPress={buSignUp} style={[styles.button, { borderWidth: 1, borderColor: "#1FC7B2", backgroundColor: "white", marginTop: 10, }]}>
                            <Text style={[styles.buttonText, { color: "#1FC7B2" }]}>Sign Up </Text>
                        </TouchableOpacity>
                    </Animatable.View>



                    {/* <Animatable.View style={styles.bottomView} animation="fadeIn" >
                        <Text style={styles.newUser}>Or login with</Text>
                    </Animatable.View> */}

                    <Animatable.View style={[styles.bottomView, { marginTop: 10, marginBottom: 100 }]} animation="fadeIn" >
                        {/* <Animatable.Image animation="fadeInUp" source={google} style={{ width: 30, height: 30 }}></Animatable.Image> */}
                    </Animatable.View>
                </Animatable.View>
            </ScrollView>


            {isAnimating &&
                <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
            }
        </SafeAreaView>
    )
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
        marginLeft: 30,
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
        marginBottom: 10,
        backgroundColor: '#d5c9de'

    },
    ForgotPassword: {
        alignSelf: "flex-end",
        marginRight: 20,
        fontStyle: "italic",
        marginTop: 5,
        color: '#1FC7B2',
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
        marginTop: 30,
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        marginBottom: 10,
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

});