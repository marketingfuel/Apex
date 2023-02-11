
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

import user from '../Assets/Icons/user.png'
import passwordd from '../Assets/Icons/password.png'
var validator = require("email-validator");
import { domain } from "../Api/Api";

import * as Animatable from 'react-native-animatable';
const screenWidth = Dimensions.get("window").width
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import calenderDate from '../Assets/Icons/calendardate.png'
import DatePicker from 'react-native-date-picker'
import services from '../services/Services'

export default function AddExperience({ navigation }) {
    const [isAnimating, setAnimating] = useState(false);
    const [checkExValidation,setCheckExValidation] = useState(false);
    const [checkEduValidation,setCheckEduValidation] = useState(false);

    //Experience
    const [jobTitle, setJobTitle] = useState("");
    const [dateSDModel, setDateSDModel] = useState(new Date())
    const [isOpenSDModel, setIsOpenSDModel] = useState(false)
    const [Exp_SD, setExp_SD] = useState()

    const [dateEDModel, setDateEDModel] = useState(new Date())
    const [isOpenEDModel, setIsOpenEDModel] = useState(false)
    const [Exp_ED, setExp_ED] = useState()

    //Education
    const [degreeTitle, setDegreeTitle] = useState("");
    const [dateED_SDModel, setDateED_SDModel] = useState(new Date())
    const [isOpenED_SDModel, setIsOpenED_SDModel] = useState(false)
    const [Edu_SD, setEdu_SD] = useState()

    const [dateED_EDModel, setDateED_EDModel] = useState(new Date())
    const [isOpenED_EDModel, setIsOpenED_EDModel] = useState(false)
    const [Edu_ED, setEdu_ED] = useState()
   //End Education

    const [experience, setExperience] = useState([])
    const [education, setEducation] = useState([])
    
    Back = () => {
        navigation.goBack()
    }
    useEffect(() => {
        getExperience()
        getEducation()
    }, [])

    saveExperience =async () => {
        try {
            if(!jobTitle || !Exp_SD || !Exp_ED)
            {
                setCheckExValidation(true);
                return;
            }
            setCheckExValidation(false);
            setAnimating(true)
            const auth = await services.getAuthData();
            let url = `add-experience?email=${auth?.email}&title=${jobTitle}&start_year=${Exp_SD}&end_year=${Exp_ED}`
            const result = await services.post1(url, auth?.token);
            if (result.success) {
                getExperience();
            }
            console.log(result);
        }
        catch (ex) {
            alert(result?.error ? result.error : 'Some thing went wrong!!')
            console.log(ex)
        }
        finally {
            setAnimating(false)
        }
    }

    saveEducation = async () => {
        try {
            if(!degreeTitle || !Edu_SD || !Edu_ED)
            {
                setCheckEduValidation(true);
                return;
            }
            setCheckEduValidation(false);
            setAnimating(true)
            const auth = await services.getAuthData();
            let url = `add-education?email=${auth?.email}&name=${degreeTitle}&start_year=${Edu_SD}&end_year=${Edu_ED}`
            const result = await services.post1(url, auth?.token);
            if (result.success) {
                getEducation();
            }
            console.log(result);
        }
        catch (ex) {
            alert(result?.error ? result.error : 'Some thing went wrong!!')
            console.log(ex)
        }
        finally {
            setAnimating(false)
        }
    }
    getExperience = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            let url = `get_experience_detail?email=${auth?.email}`
            const result = await services.get(url, auth?.token);
            if (result.success) {
                const data = result?.data;
                setExperience(data);
            }
            console.log(result);
        }
        catch (ex) {
            alert(result?.error ? result.error : 'Some thing went wrong!!')
            console.log(ex)
        }
        finally {
            setAnimating(false)
        }
    }
    getEducation = async () =>{
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            let url = `get_education_detail?email=${auth?.email}`
            const result = await services.get(url, auth?.token);
            if (result.success) {
                const data = result?.data;
                setEducation(data);
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
    removeExperience=async (id)=>{
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            let url = `remove-experience?email=${auth?.email}&action=delete&id=${id}`
            const result = await services.post1(url, auth?.token);
            if (result.success) {
                getExperience();
            }
            console.log(result);
        }
        catch (ex) {
            alert(result?.error ? result.error : 'Some thing went wrong!!')
            console.log(ex)
        }
        finally {
            setAnimating(false)
        }
    }
    removeEducation=async (id)=>{
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            let url = `remove-education?email=${auth?.email}&action=delete&id=${id}`
            const result = await services.post1(url, auth?.token);
            if (result.success) {
                getEducation();
            }
            console.log(result);
        }
        catch (ex) {
            alert(result?.error ? result.error : 'Some thing went wrong!!')
            console.log(ex)
        }
        finally {
            setAnimating(false)
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
                   
                    <Image source={logo} style={styles.logo}></Image>
                    <View style={[{ width: '90%', marginLeft: '5%', backgroundColor: 'white', borderRadius: 10 }, styles.shadStyle]}>
                        <Animatable.View style={[styles.bottomView, { marginTop: 0, justifyContent: 'space-between', alignSelf: 'baseline', alignSelf: "center", width: '90%' }]} animation="fadeIn" >
                            <Text style={[styles.label, {fontSize:18, marginLeft: 0, }]}>Experience</Text>
                            {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Image source={add} style={{ width: 10, height: 10, marginBottom: 3, marginRight: 3 }} />
                            <Text style={[styles.label, { marginLeft: 0, color: 'blue', fontWeight: '500' }]}>Add More Experience</Text>
                        </View> */}
                        </Animatable.View>

                        <View
                            style={[{
                                marginTop: '4%',
                                borderRadius: 5,
                                width: '90%',
                                flexDirection: 'row',
                                alignSelf: "center",
                                alignItems: "center",
                                backgroundColor: 'white',
                                borderColor:checkExValidation && !jobTitle ? 'red'  : '',
                                borderWidth:checkExValidation && !jobTitle ? 1 : 0,
                                elevation: 5,
                                height: 40
                            }, styles.shadStyle]} >
                            <Image source={paycase} style={{ height: 15, width: 15, marginLeft: 20, marginRight: 5 }}></Image>
                            <TextInput
                                style={[styles.textField, { paddingTop: '1%', paddingBottom: '1%' }]}
                                placeholder={'Job Title'}
                                placeholderTextColor='black'
                                value={jobTitle}
                                onFocus={()=>{}}
                                onChangeText={(val) => { setJobTitle(val)}}
                            >
                            </TextInput>
                        </View>

                        <View style={{ width: "100%", flexDirection: "row", marginTop: '2%' }}>
                            <TouchableOpacity
                                onPress={() => { setIsOpenSDModel(true) }}
                                style={[{
                                    marginTop: '4%',
                                    borderRadius: 10,
                                    width: '42%',
                                    marginLeft: '5%',
                                    flexDirection: 'row',
                                    alignItems: "center",
                                    height: 40,
                                    backgroundColor: 'white',
                                    borderColor:checkExValidation && !Exp_SD ? 'red'  : '',
                                    borderWidth:checkExValidation && !Exp_SD ? 1 : 0,
                                    elevation: 5
                                },
                                styles.shadStyle]} >
                                <Image source={calenderDate} style={{ height: 15, width: 15, marginLeft: 20, marginRight: 5 }}></Image>
                                <TextInput
                                    style={[styles.textField]}
                                    placeholder={"Start Date"}
                                    value={Exp_SD}
                                    placeholderTextColor='black'
                                    editable={false}
                                >
                                </TextInput>
                                <DatePicker
                                    modal
                                    open={isOpenSDModel}
                                    date={dateSDModel}
                                    mode={"date"}
                                    onConfirm={(date) => {
                                        setIsOpenSDModel(false)
                                        const _date = new Date(date);
                                        setExp_SD(_date.getFullYear() + "/" + (_date.getMonth() + 1) + "/" + _date.getDate());
                                        setDateSDModel(date)
                                    }}
                                    onCancel={() => {
                                        setIsOpenSDModel(false)
                                    }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setIsOpenEDModel(true) }}
                                style={[{
                                    marginTop: '4%',
                                    borderRadius: 10,
                                    width: '42%',
                                    marginLeft: '5%',
                                    flexDirection: 'row',
                                    alignItems: "center",
                                    backgroundColor: 'white',
                                    borderColor:checkExValidation && !Exp_ED ? 'red'  : '',
                                    borderWidth:checkExValidation && !Exp_ED ? 1 : 0,
                                    elevation: 5
                                }, styles.shadStyle]} >
                                <Image source={calenderDate} style={{ height: 15, width: 15, marginLeft: 20, marginRight: 5 }}></Image>
                                <TextInput
                                    style={[styles.textField, { paddingTop: '1%', paddingBottom: '1%' }]}
                                    placeholder={"End Date"}
                                    value={Exp_ED}
                                    placeholderTextColor='black'
                                    editable={false}
                                >
                                </TextInput>
                                <DatePicker
                                    modal
                                    open={isOpenEDModel}
                                    date={dateEDModel}
                                    mode={"date"}
                                    onConfirm={(date) => {
                                        setIsOpenEDModel(false)
                                        const _date = new Date(date);
                                        setExp_ED(_date.getFullYear() + "/" + (_date.getMonth() + 1) + "/" + _date.getDate());
                                        setDateEDModel(date)
                                    }}
                                    onCancel={() => {
                                        setIsOpenEDModel(false)
                                    }}
                                />

                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={saveExperience} style={[styles.button, { height: 25, width: "50%",alignSelf:'flex-end',marginRight:'5%',marginBottom:10 }]}  >
                            <Text style={styles.buttonText}>Save Experience</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {experience?.map((item, index) => {
                        return(
                        <View key={item.id} style={[{
                            minHeight: 50,
                            backgroundColor: "white",
                            borderRadius: 10,
                            marginHorizontal: 20,
                            marginVertical: 10,
                            marginTop: 20,
                            flexDirection: 'row',
                            padding: 10
                        }, styles.shadStyle]}>
                            <View style={{ flex: 3 }}>
                                <Text style={{ marginBottom: 10, fontSize: 18 }}>{item.title}</Text>
                                <Text style={{}}>{item.start_year+" - "+item.end_year}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                <TouchableOpacity
                                onPress={()=>{removeExperience(item.id)}}
                                 style={{
                                    height: 30,
                                    width: 30,
                                    backgroundColor: 'red',
                                    borderRadius: 100,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ color: 'white' }}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )})}
                    {/* <View style={{ flexDirection: 'row', marginTop: '8%', marginBottom: 20 }}>
                        <Image source={require('../Assets/Icons/checked.png')} style={{ height: 15, width: 15, marginLeft: 20, marginRight: 5 }}></Image>
                        <Text>Currently Work here</Text>
                    </View> */}

                    <Text style={[styles.label, { fontSize: 18, marginLeft: '5%' }]}>Educational Information</Text>

                    <View style={[{ width: '90%', marginLeft: '5%', backgroundColor: 'white', borderRadius: 10, marginTop: '3%' }, styles.shadStyle]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '3%', marginVertical: '3%' }}>
                            <Text style={{ fontSize: 18, fontWeight: '700' }}>University</Text>
                            <Image source={require('../Assets/Icons/remove.png')} style={{
                                width: 10, height: 10, alignSelf: 'center'
                            }} />
                        </View>

                        <Animatable.View animation="fadeInUp"
                            style={{
                                flexDirection: 'row',
                                alignItems: "center",
                            }} >
                            <Image source={require('../Assets/Icons/degree.png')} style={{ alignSelf: 'center', height: 18, width: 18, marginLeft: 30, marginRight: 10 }}></Image>
                            <TextInput
                                style={[styles.textField,
                                {
                                    paddingBottom: '1%',
                                }]}
                                placeholder='Degree Title'
                                placeholderTextColor='black'
                                value={degreeTitle}
                                onChangeText={(val) => setDegreeTitle(val)}
                            >
                            </TextInput>
                        </Animatable.View>

                        <Animatable.View
                            animation="fadeInUp"
                            style={[styles.seperater,
                            {
                                backgroundColor: checkEduValidation && !degreeTitle ? 'red' : 'black',
                            }]}>
                        </Animatable.View>

                        <View style={{ marginTop: '4%', width: "90%", flexDirection: "row", backgroundColor: 'white', marginBottom: '5%', }}>
                            <TouchableOpacity onPress={()=>{setIsOpenED_SDModel(true)}} style={{ width: "50%" }}>
                                <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                                    <Image source={calenderDate} style={{ height: 18, width: 18, marginLeft: 30, marginRight: 10 }}></Image>
                                    <TextInput
                                        style={styles.textField}
                                        placeholder='Start Date'
                                        placeholderTextColor='black'
                                        value={Edu_SD}
                                        editable={false}
                                    >
                                    </TextInput>
                                    <DatePicker
                                        modal
                                        open={isOpenED_SDModel}
                                        date={dateED_SDModel}
                                        mode={"date"}
                                        onConfirm={(date) => {
                                            setIsOpenED_SDModel(false)
                                            const _date = new Date(date);
                                            setEdu_SD(_date.getFullYear() + "/" + (_date.getMonth() + 1) + "/" + _date.getDate());
                                            setDateED_SDModel(date)
                                        }}
                                        onCancel={() => {
                                            setIsOpenED_SDModel(false)
                                        }}
                                    />
                                </Animatable.View>
                                <Animatable.View
                                    animation="fadeInUp"
                                    style={[styles.seperater,
                                    {
                                        width: "90%",
                                        alignSelf: "flex-start",
                                        backgroundColor: checkEduValidation && !Edu_SD ? 'red' : 'black',
                                    }]}>
                                </Animatable.View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={()=>{setIsOpenED_EDModel(true)}} style={{ width: "50%" }}>
                                <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                                    <Image source={calenderDate} style={{ height: 18, width: 18, marginLeft: 30, marginRight: 10 }}></Image>
                                    <TextInput
                                        style={styles.textField}
                                        placeholder='End Date'
                                        placeholderTextColor='black'
                                        value={Edu_ED}
                                        editable={false}
                                        >
                                    </TextInput>
                                    <DatePicker
                                        modal
                                        open={isOpenED_EDModel}
                                        date={dateED_EDModel}
                                        mode={"date"}
                                        onConfirm={(date) => {
                                            setIsOpenED_EDModel(false)
                                            const _date = new Date(date);
                                            setEdu_ED(_date.getFullYear() + "/" + (_date.getMonth() + 1) + "/" + _date.getDate());
                                            setDateED_EDModel(date)
                                        }}
                                        onCancel={() => {
                                            setIsOpenED_EDModel(false)
                                        }}
                                    />
                                </Animatable.View>

                                <Animatable.View
                                    animation="fadeInUp"
                                    style={[styles.seperater,
                                    {
                                        width: "90%",
                                        alignSelf: "flex-start",
                                        backgroundColor: checkEduValidation && !Edu_ED ? 'red' : 'black',
                                    }]}>
                                </Animatable.View>

                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={saveEducation} style={[styles.button, { height: 25,alignSelf:'flex-end',marginRight:'5%', width: "50%",marginBottom:10 }]}  >
                            <Text style={styles.buttonText}>Save Education</Text>
                        </TouchableOpacity>
                    </View>
                    {education?.map((item, index) => {
                        return(
                        <View key={item.id} style={[{
                            minHeight: 50,
                            backgroundColor: "white",
                            borderRadius: 10,
                            marginHorizontal: 20,
                            marginVertical: 10,
                            marginTop: 20,
                            flexDirection: 'row',
                            padding: 10
                        }, styles.shadStyle]}>
                            <View style={{ flex: 3 }}>
                                <Text style={{ marginBottom: 10, fontSize: 18 }}>{item.name}</Text>
                                <Text style={{}}>{item.start_year+" - "+item.end_year}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                <TouchableOpacity
                                onPress={()=>{removeEducation(item.id)}}
                                 style={{
                                    height: 30,
                                    width: 30,
                                    backgroundColor: 'red',
                                    borderRadius: 100,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ color: 'white' }}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )})}
{/* 
                    <View style={[{ marginTop: '6%', borderRadius: 10, width: '90%', marginLeft: '5%', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", backgroundColor: 'white', elevation: 5, height: 40 }, styles.shadStyle]} >
                        <View style={{ flexDirection: 'row', }}>
                            <Image source={paycase} style={{ alignSelf: 'center', height: 15, width: 15, marginLeft: 15, marginRight: 10, }}></Image>

                            <TextInput
                                style={[styles.textField, { paddingTop: '1%', paddingBottom: '1%' }]}
                                placeholder='Add Collage'
                                placeholderTextColor='black'
                                onChangeText={(val) => setPhoneNumber(val)}
                            >
                            </TextInput>
                        </View>
                        <Image style={{ width: 10, height: 10, marginRight: 20 }} source={require('../Assets/Icons/plus.png')} />
                    </View>

                    <View style={[{ marginTop: '4%', borderRadius: 10, width: '90%', marginLeft: '5%', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", backgroundColor: 'white', elevation: 5, height: 40 }, styles.shadStyle]} >
                        <View style={{ flexDirection: 'row', }}>
                            <Image source={paycase} style={{ alignSelf: 'center', height: 15, width: 15, marginLeft: 15, marginRight: 10, }}></Image>

                            <TextInput
                                style={[styles.textField, { paddingTop: '1%', paddingBottom: '1%' }]}
                                placeholder='Add Collage'
                                placeholderTextColor='black'
                                onChangeText={(val) => setPhoneNumber(val)}
                            >
                            </TextInput>
                        </View>
                        <Image style={{ width: 10, height: 10, marginRight: 20 }} source={require('../Assets/Icons/plus.png')} />
                    </View> */}


                    <Animatable.View animation="fadeInUp" >
                        <TouchableOpacity onPress={()=>{navigation.navigate('FinancialHistoryScreen');}} style={styles.button}  >
                            <Text style={styles.buttonText}>Next</Text>
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
        height: 0.5,
        marginLeft: 30,
        marginRight: 20,
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