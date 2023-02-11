
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
    BackHandler, SafeAreaView, KeyboardAvoidingView,
    Button
} from "react-native";
import { isIphoneX } from 'react-native-iphone-x-helper';
import backGroundImage1 from '../Assets/Images/backGround4.png';
import logo from '../Assets/Images/logo.png'
import name from '../Assets/Icons/name.png'
import addresss from '../Assets/Icons/address.png'
import back from '../Assets/Icons/Arrr.png';
import nationalityy from '../Assets/Icons/nationality.png';
import card from '../Assets/Icons/crad.png';
import phone from '../Assets/Icons/phone.png';
import { CommonActions } from '@react-navigation/native'
import RadioButton from '../Compmonent/RadioButton'
import user from '../Assets/Icons/user.png'
import passwordd from '../Assets/Icons/password.png'
var validator = require("email-validator");
import * as Animatable from 'react-native-animatable';
const screenWidth = Dimensions.get("window").width
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { domain } from '../Api/Api'
import { BASE_URL } from '../services/Url';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/Entypo';

export default function signUP({ navigation }) {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddres] = useState("");
    const [nationality, setNationality] = useState("");
    const [cardnumber, setcardnumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [referBy, setReferBy] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const [isAnimating, setAnimating] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    let [male, setMale] = useState(false);
    let [female, setFemale] = useState(false);
    let [gender, setGender] = useState("Gender");

    let [PreemitedYes, setPreemitedYes] = useState(false);
    let [PreemitedNo, setPreemitedNo] = useState(false);
    let [permittedd, setPermittedd] = useState(false)

    let [drivingYes, setDrivingYes] = useState(false);
    let [drivingNo, setDrivingNo] = useState(false);
    let [drivingg, setDrivingg] = useState(false);

    let [lisenceYes, setLisenceYes] = useState(false);
    let [lisenceNo, setLisenceNo] = useState(false);
    let [licensee, setLicensee] = useState(false);


    Back = () => {
        navigation.goBack()
    }

    const SiginSuccess = async () => {
        if (firstName.trim() === "") {
            alert("First name is required!");
            return
        }
        else if (lastName.trim() === "") {
            alert("Last name is required!");
            return
        }
        else if (nationality.trim() === "") {
            alert("Nationality is required!");
            return
        }
        else if (cardnumber.trim() === "") {
            alert("Card numberrcardnumberd is required!");
            return
        }
        else if (phoneNumber.trim() === "") {
            alert("phone Number is required!");
            return
        }
        else if (address === "") {
            alert("Address is required!");
            return
        }
        else if (gender == "Gender") {
            alert(gender);
            return
        }
        else if (email.trim() === "") {
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
        else if (password.length < 5) {
            alert("Password type more than 5 words");
            return
        }
        else {
            //this.setState({ isAnimating: true, isDisabled: true })
            //navigation.navigate('home')
            siginupApi()
        }
    }

    siginupApi = async () => {
        setAnimating(true)
        var data = new FormData();
        data.append("first_name", firstName)
        data.append("last_name", lastName)
        data.append("email", email)
        data.append("password", password)
        data.append("phone", phoneNumber)
        data.append("per_gender", gender)
        data.append("per_nationality", nationality)
        data.append("per_insurance", cardnumber)
        data.append("uk_permission", permittedd)
        data.append("license_penality", licensee)
        data.append("uk_dl", drivingg)
        data.append("per_pob", address)
        data.append("refer_by", referBy)

        console.log(data, "apiData")
        try {

            await fetch(BASE_URL + '/add_guard', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: data
            })
                .then(response => {
                    const statusCode = response.status;
                    console.log(response);
                    const data = response.json();
                    return Promise.all([statusCode, data]);

                })
                .then(async (data) => {
                    console.log('Response->', data)
                    setAnimating(false)
                    if (data[1].success) {
                       alert("Successfully Created your account")
                        navigation.dispatch({
                            ...CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'signIn' }],
                            }),
                        })
                        //navigation.navigate('signIn')
                    } else {
                        alert(data[1].error)
                    }

                })
                .catch(err => {
                    debugger;
                    setAnimating(false)
                    alert(err)
                    console.log('failed', err)
                })

        } catch (error) {
            setAnimating(false)
            console.log(error);
            alert(error)
        }
    }

    gotoSignIn = () => {
        navigation.navigate('signIn')
    }

    Back = () => {
        navigation.goBack()
    }

    setMaleValue = () => {

        if (male == true) {

            setMale(false)
            setFemale(false)
            setGender("GENDER")
        }
        else if (male == false) {
            //alert('ok')
            setMale(true)
            setFemale(false)
            setGender("male")

        }

    }
    setFemaleValue = () => {
        if (female == true) {
            setMale(false)
            setFemale(false)
            setGender("GENDER")

        }
        else if (female == false) {
            //alert('no')
            setMale(false)
            setFemale(true)
            setGender("female")

        }

    }

    setPreemitedYesValue = () => {
        if (PreemitedYes == true) {
            setPreemitedYes(false)
            setPreemitedNo(false)
            setPermittedd(false)
        }
        else if (PreemitedYes == false) {
            setPreemitedYes(true)
            setPreemitedNo(false)
            setPermittedd(true)
        }

    }
    setPreemitedNoValue = () => {
        if (PreemitedNo == true) {
            setPreemitedYes(false)
            setPreemitedNo(false)
            setPermittedd(false)
        }
        else if (PreemitedNo == false) {
            setPreemitedYes(false)
            setPreemitedNo(true)
            setPermittedd(false)
        }

    }

    setDerivingYesValue = () => {
        if (drivingYes == true) {
            setDrivingYes(false)
            setDrivingNo(false)
            setDrivingg(false)
        }
        else if (drivingYes == false) {
            setDrivingYes(true)
            setDrivingNo(false)
            setDrivingg(true)
        }

    }
    setDrivingNoValue = () => {
        if (drivingNo == true) {
            setDrivingYes(false)
            setDrivingNo(false)
            setDrivingg(false)
        }
        else if (drivingNo == false) {
            setDrivingYes(false)
            setDrivingNo(true)
            setDrivingg(false)
        }

    }



    setLisenceYesValue = () => {
        if (lisenceYes == true) {
            setLisenceYes(false)
            setLisenceNo(false)
            setLicensee(false)
        }
        else if (lisenceYes == false) {
            //alert(licensee)
            setLisenceYes(true)
            setLisenceNo(false)
            setLicensee(true)

        }

    }
    setLisenceNoValue = () => {
        if (lisenceNo == true) {
            setLisenceYes(false)
            setLisenceNo(false)
            setLicensee(false)
        }
        else if (lisenceNo == false) {
            //alert(licensee)
            setLisenceYes(false)
            setLisenceNo(true)
            setLicensee(false)

        }

    }

    GoToTwoPersonalCharScreen = () => {

        navigation.navigate('TwoPersonalCharScreen')

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
                showsVerticalScrollIndicator={false}>
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
                    <Image source={logo} style={styles.logo}></Image>
                    <Animatable.View style={[styles.bottomView, { marginTop: 0 }]} animation="fadeIn" >
                        <Text style={[styles.label, { marginLeft: 0, }]}>Enter Personal Detail</Text>
                    </Animatable.View>


                    <View style={{ width: "90%", flexDirection: "row" }}>
                        <View style={{ width: "50%" }}>
                            <Animatable.Text animation="fadeInUp" style={styles.label}>First Name</Animatable.Text>
                            <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                                <Image source={name} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                                <TextInput
                                    style={styles.textField}
                                    placeholder='First Name'
                                    placeholderTextColor='#d5c9de'
                                    onChangeText={(val) => setFirstName(val)}
                                    value={firstName}
                                >
                                </TextInput>

                            </Animatable.View>
                            <Animatable.View animation="fadeInUp" style={[styles.seperater, { width: "90%", alignSelf: "flex-start", }]}></Animatable.View>

                        </View>
                        <View style={{ width: "50%" }}>

                            <Animatable.Text animation="fadeInUp" style={styles.label}>Last Name</Animatable.Text>
                            <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                                <Image source={name} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                                <TextInput
                                    style={styles.textField}
                                    placeholder='Last Name'
                                    placeholderTextColor='#d5c9de'
                                    value={lastName}
                                    onChangeText={(val) => setLastName(val)}>
                                </TextInput>

                            </Animatable.View>
                            <Animatable.View animation="fadeInUp" style={[styles.seperater, { width: "90%", alignSelf: "flex-start", }]}></Animatable.View>

                        </View>
                    </View>

                    <Animatable.Text animation="fadeInUp" style={styles.label}>Referred By (Optional)</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={name} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Referred By'
                            placeholderTextColor='#d5c9de'
                            onChangeText={(val) => setReferBy(val)}
                            value={referBy}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>

                    <Animatable.Text animation="fadeInUp" style={styles.label}>Phone Number</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={phone} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Phone Number'
                            keyboardType="phone-pad"
                            placeholderTextColor='#d5c9de'
                            onChangeText={(val) => setPhoneNumber(val)}
                            value={phoneNumber}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>Place of Birth</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={addresss} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Place of Birth'
                            placeholderTextColor='#d5c9de'
                            value={address}
                            onChangeText={(val) => setAddres(val)}
                        >
                        </TextInput>
                    </Animatable.View>
                    {/* <View style={{flex:1}}>
                        <GooglePlacesAutocomplete
                            placeholder='Search Location'
                            styles={{
                                textInput:{paddingLeft:60,color: 'black'}
                            }}
                            onPress={(data, details = null) => {
                                setAddres(data?.description)
                                console.log(data);
                            }}
                            query={{
                                key: 'AIzaSyBbeMwEJjULlMWAG7n40lsIIrjJOXtBXi0',
                                language: 'en',
                            }}
                        />
                        </View> */}

                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>Nationality</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={nationalityy} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Nationality'
                            placeholderTextColor='#d5c9de'
                            value={nationality}
                            onChangeText={(val) => setNationality(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>National Insurance Number</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={card} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='National Insurance Number'
                            placeholderTextColor='#d5c9de'
                            value={cardnumber}
                            onChangeText={(val) => setcardnumber(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>Email</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={user} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='jhondoe@gmail.com'
                            placeholderTextColor='#d5c9de'
                            onChangeText={(val) => setEmail(val)}
                            value={email}
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                            textContentType={"name"}>
                        </TextInput>

                    </Animatable.View>

                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>

                    <Animatable.Text animation="fadeInUp" style={styles.label}>Password</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={passwordd} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            animation="fadeInUp"
                            style={styles.textField}
                            placeholder='********'
                            placeholderTextColor='#d5c9de'
                            autoCapitalize={'none'}
                            textContentType={"password"}
                            value={password}
                            onChangeText={(val) => setPassword(val)}
                            secureTextEntry={!showPassword}
                            >
                        </TextInput>

                        <TouchableOpacity
                        onPress={()=>{setShowPassword(showPassword ? false : true)}}
                         style={{ width: '5%',position:'absolute',right:30 }}>
                             <Icon name={showPassword ? "eye" : "eye-with-line"} size={18} />
                        </TouchableOpacity>

                    </Animatable.View>

                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={[styles.label, { fontWeight: "normal" }]}>Select your gender</Animatable.Text>

                    <Animatable.View animation="fadeInUp" style={{ marginLeft: 30, }}>

                        <RadioButton
                            setFirstValue={setMaleValue}
                            firstValue={male}
                            text1={"MALE"}
                            setSecondValue={setFemaleValue}
                            secondValue={female}
                            text2={"FEMALE"}
                        />
                    </Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={[styles.label, { fontWeight: "normal" }]}>Are You permitted work In UK?</Animatable.Text>

                    <Animatable.View animation="fadeInUp" style={{ marginLeft: 30, }}>
                        <RadioButton
                            setFirstValue={setPreemitedYesValue}
                            firstValue={PreemitedYes}
                            text1={"Yes"}
                            setSecondValue={setPreemitedNoValue}
                            secondValue={PreemitedNo}
                            text2={"No"}
                        />
                    </Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={[styles.label, { fontWeight: "normal" }]}>Full UK Driving License?</Animatable.Text>

                    <Animatable.View animation="fadeInUp" style={{ marginLeft: 30, }}>

                        <RadioButton
                            setFirstValue={setDerivingYesValue}
                            firstValue={drivingYes}
                            text1={"Yes"}
                            setSecondValue={setDrivingNoValue}
                            secondValue={drivingNo}
                            text2={"No"}
                        />
                    </Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={[styles.label, { fontWeight: "normal" }]}>Any Penalty on License</Animatable.Text>

                    <Animatable.View animation="fadeInUp" style={{ marginLeft: 30, }}>

                        <RadioButton
                            setFirstValue={setLisenceYesValue}
                            firstValue={lisenceYes}
                            text1={"Yes"}
                            setSecondValue={setLisenceNoValue}
                            secondValue={lisenceNo}
                            text2={"No"}
                        />
                    </Animatable.View>




                    <Animatable.View animation="fadeInUp" >

                        <TouchableOpacity onPress={() => SiginSuccess()} style={[styles.button, { borderWidth: 1, borderColor: "#1FC7B2", backgroundColor: "white", marginTop: 10, }]} >
                            <Text style={[styles.buttonText, { color: "#1FC7B2" }]}>Sign Up</Text>
                        </TouchableOpacity>
                    </Animatable.View>


                    <Animatable.View style={[styles.bottomView, { paddingVertical: 20 }]} animation="fadeIn" >
                        <Text style={styles.newUser}>Already have an account? </Text>
                        <Text style={styles.register} onPress={this.gotoSignIn}> Sign In</Text>
                    </Animatable.View>
                    <View style={{ height: 100 }}></View>
                </Animatable.View>

            </KeyboardAwareScrollView>


            {
                isAnimating &&
                <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
            }
        </SafeAreaView >
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

});