
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
import backGroundImage1 from '../Assets/Images/backGround4.png'
import logo from '../Assets/Images/logo.png'
import name from '../Assets/Icons/name.png'
import addresss from '../Assets/Icons/address.png'
import back from '../Assets/Icons/Arrr.png';
import nationalityy from '../Assets/Icons/nationality.png';
import card from '../Assets/Icons/crad.png';
import phone from '../Assets/Icons/phone.png';
import ocupation from '../Assets/Icons/ocupation.png';
import longLive from '../Assets/Icons/longLive.png';
import PostalCode from '../Assets/Icons/postalCode.png';
// import { RadioButton } from 'react-native-paper';
import RadioButton from '../Compmonent/RadioButton'
import services from '../services/Services'

import user from '../Assets/Icons/user.png'
import passwordd from '../Assets/Icons/password.png'
var validator = require("email-validator");
import { domain } from "../Api/Api";

import * as Animatable from 'react-native-animatable';
const screenWidth = Dimensions.get("window").width
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

export default function TwoPersonalCharScreen({ navigation }) {
    const [firstName1, setFirstName1] = useState("");
    const [Ocuppation1, setOcuppation1] = useState("");
    const [address, setAddres1] = useState("");
    const [postalCode, setPostalCode1] = useState("");
    const [cardnumber1, setcardnumber1] = useState("");
    const [phoneNumber1, setPhoneNumber1] = useState("");

    const [firstName2, setFirstName2] = useState("");
    const [Ocuppation2, setOcuppation2] = useState("");
    const [address2, setAddres2] = useState("");
    const [postalCode2, setPostalCode2] = useState("");
    const [cardnumber2, setcardnumber2] = useState("");
    const [phoneNumber2, setPhoneNumber2] = useState("");

    const [referance, setReferance] = useState(null);
    const [isAnimating, setAnimating] = useState(false);

    useEffect(() => {
        getReference()
    }, [])

    Back = () => {
        navigation.goBack()
    }
    saveReferences = async () => {
        setAnimating(true);
        try {
            const auth = await services.getAuthData();
            let url = `two_person_reference?email=${auth?.email}&p1_name=${firstName1}&p1_ocuppation=${Ocuppation1}&p1_address=${address}&p1_postcode=${postalCode}&p1_phone=${phoneNumber1}&p1_email=${auth?.email}&p1_known=${cardnumber1}&p2_name=${firstName2}&p2_ocuppation=${Ocuppation2}&p2_address=${address2}&p2_postcode=${postalCode2}&p2_phone=${phoneNumber2}&p2_email=${auth?.email}&p2_known=${cardnumber2}&self_employement=${referance ? 1 : 0}`;
            const result = await services.post1(url,auth?.token);
            console.log(result);
            navigation.navigate('SelfEmploymentRefScreen');
        }
        catch (ex) {
          console.log(ex);
        }
        finally{
            setAnimating(false);
        }
    }

    getReference = async () => {
            setAnimating(true);
            try {
                const auth = await services.getAuthData();
                let url = `get_person_reference?email=${auth?.email}`
                const result = await services.get(url, auth?.token);
                if (result.success) {
                    const data = result?.data[0];
                    setFirstName1(data?.se_per1_name);
                    setOcuppation1(data?.se_per1_occ);
                    setAddres1(data?.se_per1_add);
                    setPostalCode1(data?.se_per1_postcode);
                    setcardnumber1(data?.se_per1_known); // Known
                    setPhoneNumber1(data?.se_per1_phone);

                    setFirstName2(data?.se_per2_name);
                    setOcuppation2(data?.se_per2_occ);
                    setAddres2(data?.se_per2_add);
                    setPostalCode2(data?.se_per2_postcode);
                    setcardnumber2(data?.se_per2_known);
                    setPhoneNumber2(data?.se_per2_phone);
                    setReferance(data?.self_emp=="0" ? false : true)
                }
                console.log(result);
            }
            catch (ex) {
                console.log(ex);
            }
            finally {
                setAnimating(false);
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
                    <Image source={logo} style={styles.logo}></Image>
                    <Animatable.View style={[styles.bottomView, { marginTop: 0 }]} animation="fadeIn" >
                        <Text style={[styles.label, { marginLeft: 0, fontSize: 16 }]}>Two Personal Character References</Text>
                    </Animatable.View>

                    <Text style={[styles.label, { marginLeft: 0, fontSize: 16, textAlign: "left", marginLeft: 30 }]}>Person One</Text>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>Name</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={name} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Name'
                            placeholderTextColor='#d5c9de'
                            value={firstName1}
                            onChangeText={(val) => setFirstName1(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>

                    <Animatable.Text animation="fadeInUp" style={styles.label}>Ocuppation</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={ocupation} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Ocuppation'
                            placeholderTextColor='#d5c9de'
                            value={Ocuppation1}
                            onChangeText={(val) => setOcuppation1(val)}
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
                            value={phoneNumber1}
                            onChangeText={(val) => setPhoneNumber1(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>Address</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={addresss} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Address'
                            placeholderTextColor='#d5c9de'
                            value={address}
                            onChangeText={(val) => setAddres1(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>Post Code</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={PostalCode} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Post Code'
                            placeholderTextColor='#d5c9de'
                            value={postalCode}
                            onChangeText={(val) => setPostalCode1(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>How long Known?</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={longLive} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='How long Known?'
                            placeholderTextColor='#d5c9de'
                            value={cardnumber1}
                            onChangeText={(val) => setcardnumber1(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>


                    <Text style={[styles.label, { marginLeft: 0, fontSize: 16, textAlign: "left", marginLeft: 30, marginTop: 30 }]}>Person Two</Text>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>Name</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={name} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Name'
                            placeholderTextColor='#d5c9de'
                            value={firstName2}
                            onChangeText={(val) => setFirstName2(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>

                    <Animatable.Text animation="fadeInUp" style={styles.label}>Ocuppation</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={ocupation} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Ocuppation'
                            placeholderTextColor='#d5c9de'
                            value={Ocuppation2}
                            onChangeText={(val) => setOcuppation2(val)}
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
                            placeholderTextColor='#d5c9de'
                            value={phoneNumber2}
                            onChangeText={(val) => setPhoneNumber2(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>Address</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={addresss} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Address'
                            placeholderTextColor='#d5c9de'
                            value={address2}
                            onChangeText={(val) => setAddres2(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>Post Code</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={PostalCode} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='Post Code'
                            placeholderTextColor='#d5c9de'
                            value={postalCode2}
                            onChangeText={(val) => setPostalCode2(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                    <Animatable.Text animation="fadeInUp" style={styles.label}>How long Known?</Animatable.Text>
                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                        <Image source={longLive} style={{ height: 18, width: '5%', marginLeft: 30, marginRight: 10 }}></Image>

                        <TextInput
                            style={styles.textField}
                            placeholder='How long Known?'
                            placeholderTextColor='#d5c9de'
                            value={cardnumber2}
                            onChangeText={(val) => setcardnumber2(val)}
                        >
                        </TextInput>

                    </Animatable.View>


                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>

                    <Animatable.Text animation="fadeInUp" style={[styles.label, { fontWeight: "normal" }]}>Two Personal Character References</Animatable.Text>

                    <Animatable.View animation="fadeInUp" style={{ marginLeft: 30, }}>
                         <RadioButton
                            setFirstValue={()=>setReferance(true)}
                            firstValue={referance}
                            text1={"Yes"}
                            setSecondValue={()=>setReferance(false)}
                            secondValue={referance != null ? !referance : false}
                            text2={"No"}
                        />
                    </Animatable.View>



                    <Animatable.View animation="fadeInUp" >

                        <TouchableOpacity onPress={saveReferences} style={styles.button}  >
                            <Text style={styles.buttonText}>Save And Next</Text>
                        </TouchableOpacity>
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