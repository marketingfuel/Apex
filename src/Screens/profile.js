// ./screens/Home.js

import React, { useState, useEffect, useContext, useRef } from "react";
import { View, StyleSheet, Button, ActivityIndicator, Text,Modal, StatusBar,TextInput, TouchableWithoutFeedback, TouchableOpacity, Image, ScrollView, SafeAreaView, FlatList, Platform,Dimensions,KeyboardAvoidingView,Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import bell from '../Assets/Icons/bell_icon.png'
import profile_icon from '../Assets/Icons/profile_icon.png'
import star from '../Assets/Icons/star.png'
import add from '../Assets/Icons/add.png'
import briefecase from '../Assets/Icons/briefecase.png';
import coin from '../Assets/Icons/coin.png';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
const screenWidth = Dimensions.get("window").width
import services from '../services/Services'
import paycase from '../Assets/Icons/paycase.png';
import * as Animatable from 'react-native-animatable';
import RadioButton from '../Compmonent/RadioButton';
import modal from '../Assets/Images/modal1.png';
import modal3 from '../Assets/Images/modal4.png';
import calenderDate from '../Assets/Icons/calendardate.png';
import DatePicker from 'react-native-date-picker'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNRestart from 'react-native-restart';

function Profile({ navigation }) {
    const [isAnimating, setAnimating] = useState(false);
    const [userProfile, setUserProfile] = useState()
    const [siknessModal, setSiknessModal] = useState(false)
    const [sinknessTxt, setSinknessTxt] = useState('')
    const [holidayModal, setHolidayModal] = useState(false)
    const [editProfileModel, setEditProfileModel] = useState(false)

    const [profilePic, setProfilePic] = useState()
    const [changeProfilePic, setChangeProfilePic] = useState()
    const [selectedImageSource, setSelectedImageSource] = useState()
    const [firstName, setFirstName] = useState()
    const [lastName, setlastName] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [description, setDescription] = useState()
    const [experience, setExperience] = useState()

    const [address, setAddress] = useState()
    const [companyCode, setCompanyCode] = useState()
    const [vetting, setVetting] = useState()
    const [showAddress, setShowAddress] = useState(false)
    const [transportationTO,setTransportationTO] = useState(false);
    const [showTransportation, setShowTransportation] = useState(false)
    const [editMode_companyCode, setEditMode_companyCode] = useState(false)

    const [isOpenSDModel, setIsOpenSDModel] = useState(false)
    const [dateSDModel, setDateSDModel] = useState(new Date())
    const [Exp_SD, setExp_SD] = useState()
    const dispatch = useDispatch();

    const base_url= "https://live.apexsecuritysystem.co.uk";

    useEffect(() => {
        getProfile()
    }, []);

    const getProfile = async () => {
        setAnimating(true)
        const auth = await services.getAuthData();
        const result = await services.get(`profile?email=${auth?.email}`,auth?.token)
        if (result.success) {
            setAnimating(false)
            setUserProfile(result.data);
            setProfile(result.data);
            console.log(result)
            return
        }
        setAnimating(false)
        alert(result?.error ? result.error : 'Some thing went wrong!!')
    }

    const setProfile = async (data) => {
        setProfilePic(data?.personal_info[0]?.picture)
        setFirstName(data?.personal_info[0]?.first_name)
        setlastName(data?.personal_info[0]?.last_name)
        setEmail(data?.personal_info[0]?.email)
        setPhone(data?.personal_info[0]?.phone)
        setDescription(data?.personal_info[0]?.description)
        setExperience(data?.experience)
        setAddress(data?.personal_info[0]?.address)
        setCompanyCode(data?.personal_info[0]?.company_code)
        setVetting(data?.vetting)
        setTransportationTO(data?.personal_info[0]?.transportation == '1' ? true : false)
    }

    const updateProfile = async (transparent = null) => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();

            var data = new FormData();
            data.append("email", auth?.email);
            data.append("first_name", firstName);
            data.append("last_name", lastName);
            data.append("phone", phone);
            data.append("description", description);
            data.append("experience", experience);
            data.append("address", address);
            data.append("transportation", transparent != null ? (transparent == true ? '1' : '0') : (transportationTO == true ? '1' : '0'));
            data.append("company_code", companyCode);
            if (selectedImageSource) {
                data.append("profile_pic", { uri: selectedImageSource.uri, name: selectedImageSource.name, type: selectedImageSource.type })
            }

            // let url=`update-profile?first_name=${firstName}&last_name=${lastName}&phone=${phone}&email=${auth?.email}&description=${description}&experience=${experience}&address=${address}&transportation=${transparent != null ? (transparent == true ? '1' : '0') : (transportationTO==true ? '1' : '0')}&company_code=${companyCode}&profile_pic=${selectedImageSource}`
            // const result = await services.post1(url , auth?.token)
            
            const result = await services.post('update-profile' ,data, auth?.token)
            console.log(result)
            if (result.success) {
                setUserProfile(result.data);
                setProfile(result.data)
                console.log(result)
                setEditProfileModel(false)
            }
            setAnimating(false)
        }
        catch (ex) {
            console.log(ex);
            alert('Some thing went wrong!!')
        }
        finally {
            setAnimating(false)
            setShowAddress(false)
        }
    }

    const showImagePicker = () => {
        const options = {
            title: 'Select profile picture',
            takePhotoButtonTitle: 'Take a picture',
            chooseFromLibraryButtonTitle: 'Select from library',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        // Open Image Library:
        launchImageLibrary(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const extension = response.assets[0].uri.substring(response.assets[0].uri.lastIndexOf(".") + 1);
                const source = {
                    uri: response.assets[0].uri,
                    name: response.assets[0].fileName || new Date().getTime().toString() + "." + extension,
                    type: "image/" + extension
                };
                setChangeProfilePic(response.assets[0].uri);
                setSelectedImageSource(source);
            }
        });
    }

    goToNotification = () => {
        navigation.navigate('Notification')
    }

    return (
        <SafeAreaView style={[styles.container]}>

           <Modal visible={siknessModal} transparent={false}>
                <ScrollView style={{ width: "100%", height: "100%", marginTop: "20%" }}>
                    <View style={styles.modalContainer}>
                        <Image source={modal} style={{ width: "100%", height: 200 }}></Image>

                        <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: '5%', paddingTop: '5%' }}>EXPLAIN REASON FOR SICKNESS</Text>

                        {/* <View style={[styles.inputContainer]}> */}
                            <TextInput
                                value={sinknessTxt}
                                multiline={true}
                                autoCapitalize="none"
                                placeholder="Explain reason here"
                                placeholderTextColor={'#9a9999'}
                                onChangeText={(val) => setSinknessTxt(val)}
                                style={styles.input}
                            />

                        {/* </View> */}

                        <TouchableOpacity style={styles.ModalButton} onPress={()=>{}}>
                            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => { setSiknessModal(false) }}>
                            <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>back</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
                {isAnimating &&
                    <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
                }
            </Modal>

            <Modal visible={editProfileModel} transparent={false}>
            <KeyboardAvoidingView behavior="padding">
                <ScrollView style={{ width: "100%",padding:20, marginTop: "20%" }}>
                <Text style={{ color: 'black', fontSize: 24, fontWeight: 'bold',marginBottom:15 }}>Edit Profile</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={{ uri: changeProfilePic || base_url+profilePic }} style={{ width: 100, height: 100, borderRadius: 100, marginBottom: 10,marginRight:10 }}></Image>
                            <TouchableOpacity style={{justifyContent:'center'}} onPress={() => { showImagePicker() }}>
                                <Text style={{ color: "#1a0dab" }}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                <Text style={styles.inputFieldLabel}>First Name</Text>
                    <TextInput
                        style={styles.inputField}
                        placeholder='First Name'
                        value={firstName}
                        onChangeText={(val)=>{
                          setFirstName(val);
                        }}
                    />
                     <Text style={styles.inputFieldLabel}>Last Name</Text>
                     <TextInput
                        style={styles.inputField}
                        placeholder='Last Name'
                        value={lastName}
                        onChangeText={(val)=>{
                          setlastName(val);
                        }}
                    />
                       <Text style={styles.inputFieldLabel}>Email</Text>
                     <TextInput
                        style={[styles.inputField,{backgroundColor:'#F6F6F1'}]}
                        placeholder='Email'
                        value={email}
                        editable={false}
                        onChangeText={(val)=>{
                          setEmail(val);
                        }}
                    />
                       <Text style={styles.inputFieldLabel}>Phone</Text>
                     <TextInput
                        style={styles.inputField}
                        placeholder='Phone'
                        value={phone}
                        onChangeText={(val)=>{
                          setPhone(val);
                        }}
                    />
                    <Text style={styles.inputFieldLabel}>Details</Text>
                     <TextInput
                        style={[styles.inputField,{height:100}]}
                        placeholder='Description'
                        multiline={true}
                        value={description}
                        onChangeText={(val)=>{
                          setDescription(val);
                        }}
                    />
                    <View style={{ flexDirection: 'row',marginTop: '5%',marginBottom:'20%' }}>
                        <TouchableOpacity
                                onPress={() => {
                                    setChangeProfilePic('');
                                    setSelectedImageSource(null);
                                    getProfile();
                                    setEditProfileModel(false)
                                }}
                            style={{
                                flex: 1,
                                padding: '3%',
                                marginRight:5,
                                backgroundColor: '#FE4154',
                                borderRadius: 8,
                                justifyContent: 'center',
                            }}>
                            <Text style={{ textAlign: 'center', color: 'white' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { updateProfile() }}
                            style={{
                                flex: 1,
                                padding: '3%',
                                backgroundColor: '#1FC7B2',
                                borderRadius: 8,
                                justifyContent: 'center',
                            }}>
                            <Text style={{ textAlign: 'center', color: 'white' }}>Save</Text>
                        </TouchableOpacity>
                        </View>
                </ScrollView>
                </KeyboardAvoidingView>
                {isAnimating &&
                    <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
                }
            </Modal>
            
            <Modal visible={holidayModal} transparent={false}>
                <ScrollView style={{ width: "100%", height: "100%", marginTop: "20%" }}>
                    <View style={styles.modalContainer}>
                        <Image source={modal3} style={{ width: "100%", height: 200 }}></Image>
                        <Text style={{ fontWeight: 'bold', color: 'black', marginLeft: '5%', paddingTop: '5%' }}>Holidays</Text>
                        < View style={{ flexDirection: 'row', alignItems: "center" }} >
                            
                            <TouchableOpacity onPress={()=>{setIsOpenSDModel(true)}}>
                            <Image source={calenderDate} style={{ height: 20, width: 20, marginLeft: 30, marginRight: 10 }}></Image>
                            </TouchableOpacity>
                            
                            <TextInput
                                style={styles.textField}
                                placeholder='Date'
                                value={Exp_SD}
                                placeholderTextColor='#d5c9de'
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

                        </ View>
                        < View style={styles.seperater}></ View>
                        {/* <View style={[styles.inputContainer]}> */}
                            <TextInput
                                multiline={true}
                                autoCapitalize="none"
                                placeholder='Details'
                                placeholderTextColor='#d5c9de'
                                onChangeText={(val) => { }}
                                style={styles.input}
                                underlineColorAndroid='transparent' />
                        {/* </View> */}

                        <TouchableOpacity style={styles.ModalButton} onPress={() => { setHolidayModal(false) }}>
                            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => { setHolidayModal(false) }}>
                            <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold', textAlign: "center" }}>back</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </Modal>


            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />

            {/* top bar */}
            <View style={{ width: "100%", flexDirection: "row",justifyContent:'flex-end', height: 60, backgroundColor: '#1FC7B2' }}>
                <TouchableOpacity style={{marginRight:20 }} onPress={() => { goToNotification() }} >
                    <Image source={bell} style={{ width: 25, height: 25 }}></Image>
                </TouchableOpacity>
            </View>


            {/* top bar */}

            <ScrollView keyboardShouldPersistTaps="handled" style={{}} >
                <View style={{ backgroundColor: '#F2F2F5', }}>

                    <View style={{ flex: 1, width: "100%", backgroundColor: "#1FC7B2", paddingHorizontal: 10, paddingBottom: 20 }}>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ width: "40%", alignItems: "center" }}>
                                <Image source={{ uri:base_url+ userProfile?.personal_info[0]?.picture }}
                                    style={{ width: 110, height: 110, borderRadius: 100, }}
                                />
                                <TouchableOpacity
                                    onPress={() => setEditProfileModel(true)}
                                    style={{ width:'100%',marginTop:10 }}   >
                                    <Text style={{ color: 'white',alignSelf:'center', fontSize: 18}}>Edit Profile</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "60%" }}>
                                <View style={{ flexDirection: 'row', paddingTop: '2%', justifyContent: 'space-between', }}>
                                    <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14 }}>{userProfile?.personal_info[0]?.first_name+" "+userProfile?.personal_info[0]?.last_name}</Text>
                                </View>
                                <Text style={{ color: 'gray', paddingTop: "3%" }}>{userProfile?.personal_info[0]?.phone}</Text>
                                <Text style={{ color: 'gray', }}>{userProfile?.personal_info[0]?.email}</Text>
                                <View style={{ width: '80%' }}>
                                    <Text style={{ color: 'white', fontWeight: '700', paddingTop: '3%' }}>
                                       {userProfile?.personal_info[0]?.description}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row',marginTop:10, alignItems: 'center', }}>
                                        <Image source={star}
                                            style={{ width: 20, height: 20, paddingRight: '3%' }}
                                        />
                                        <Image source={star}
                                            style={{ width: 20, height: 20, paddingRight: '3%' }}
                                        />
                                        <Image source={star}
                                            style={{ width: 20, height: 20, paddingRight: '3%' }}
                                        />
                                         <Image source={star}
                                            style={{ width: 20, height: 20, paddingRight: '3%' }}
                                        />
                                         <Image source={star}
                                            style={{ width: 20, height: 20, paddingRight: '3%' }}
                                        />
                                        {/* <Text style={{ color: 'white' }}>4.8</Text> */}
                                    </View>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('YourPay')}
                                    style={{ flexDirection: 'row', width: '100%', alignItems: "center",width:200,marginTop:10,borderRadius:10,justifyContent:'center',padding:5,backgroundColor:'#1E7EC7' }}   >
                                    {/* <Image source={coin} style={{ width: 20, height: 20, tintColor: 'white' }} /> */}
                                    <Text style={{ color: 'white', fontSize: 18, marginLeft: 3 }}>Your Pay</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#F2F2F5', }}>
                        <TouchableOpacity
                            onPress={() => {navigation.navigate('WorkPrefrence',{ screen: 'Shop',params: { activeTab: 5 }, })}}>
                            <View style={{
                                padding: 5, width: '90%', alignSelf: "center", height: 50, marginTop: 15, elevation: 3,
                                borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between',
                                backgroundColor: 'white',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image source={briefecase}
                                        style={{ width: 20, height: 20, paddingTop: '8%', marginHorizontal: '3%' }}
                                    />
                                    <Text>{"Experience"}</Text>
                                </View>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{
                                        paddingHorizontal: 5
                                    }}>{userProfile?.experience}</Text>
                                    <Image source={add}
                                        style={{ marginHorizontal: 5, width: 15, height: 15, }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {setShowAddress(showAddress ? false : true)}}>
                            <View style={{
                                padding: 5, width: '90%', alignSelf: "center", height: 50, marginTop: 15, elevation: 3,
                                borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between',
                                backgroundColor: 'white',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image source={briefecase}
                                        style={{ width: 20, height: 20, paddingTop: '8%', marginHorizontal: '3%' }}
                                    />
                                    <Text>{"Address"}</Text>
                                </View>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{
                                        paddingHorizontal: 5
                                    }}>{userProfile?.personal_info[0]?.address}</Text>
                                    <Image source={add}
                                        style={{ marginHorizontal: 5, width: 15, height: 15, }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        {showAddress &&
                        <Animatable.View
                         animation="fadeInDown" 
                         style={[{
                            width: '90%',
                            marginLeft: '5%',
                            marginTop:'2%',
                            backgroundColor: 'white',
                            borderRadius: 4
                        }, styles.shadStyle]}>
                            <TextInput
                                style={[styles.shadStyle, {
                                    padding: 10,
                                    color:'black',
                                    borderRadius: 5,
                                    margin: '5%',
                                    backgroundColor: 'white',
                                }]}
                                placeholder={'Address'}
                                value={address}
                                onFocus={() => { }}
                                onChangeText={(val) => { setAddress(val) }}
                            >
                            </TextInput>
                        <TouchableOpacity onPress={()=>{updateProfile()}}  style={[styles.button, { height: 25, width: "50%",alignSelf:'flex-end',marginRight:'5%',marginBottom:10 }]}  >
                            <Text style={styles.buttonText}>Save Address</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                        }
                        <TouchableOpacity
                            onPress={() => {setShowTransportation(showTransportation ? false : true)}}>
                            <View style={{
                                padding: 5, width: '90%', alignSelf: "center", height: 50, marginTop: 15, elevation: 3,
                                borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between',
                                backgroundColor: 'white',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image source={briefecase}
                                        style={{ width: 20, height: 20, paddingTop: '8%', marginHorizontal: '3%' }}
                                    />
                                    <Text>{"Transportation"}</Text>
                                </View>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{
                                        paddingHorizontal: 5
                                    }}>{userProfile?.personal_info[0]?.transportation == '0' ? "False" : "True"}</Text>
                                    <Image source={add}
                                        style={{ marginHorizontal: 5, width: 15, height: 15, }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        {showTransportation &&
                            <Animatable.View animation="fadeInDown" style={{ marginLeft: 30, }}>
                                <RadioButton
                                    setFirstValue={() => {
                                        setTransportationTO(true);
                                        updateProfile(true)
                                    }
                                    }
                                    firstValue={transportationTO}
                                    text1={"Yes"}
                                    setSecondValue={() => {
                                        setTransportationTO(false);
                                        updateProfile(false)
                                    }
                                    }
                                    secondValue={!transportationTO}
                                    text2={"No"}
                                />
                            </Animatable.View>
                        }
                        <TouchableOpacity
                            onPress={() => {navigation.navigate('Vetting');}}>
                            <View style={{
                                padding: 5, width: '90%', alignSelf: "center", height: 50, marginTop: 15, elevation: 3,
                                borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between',
                                backgroundColor: 'white',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image source={briefecase}
                                        style={{ width: 20, height: 20, paddingTop: '8%', marginHorizontal: '3%' }}
                                    />
                                    <Text>{"Vetting"}</Text>
                                </View>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{
                                        paddingHorizontal: 5
                                    }}>{userProfile?.vetting}</Text>
                                    <Image source={add}
                                        style={{ marginHorizontal: 5, width: 15, height: 15, }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {setEditMode_companyCode(editMode_companyCode ? false : true)}}>
                            <View style={{
                                padding: 5, width: '90%', alignSelf: "center", height: 50, marginTop: 15, elevation: 3,
                                borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between',
                                backgroundColor: 'white',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image source={briefecase}
                                        style={{ width: 20, height: 20, paddingTop: '8%', marginHorizontal: '3%' }}
                                    />
                                    <Text>{"Company Code"}</Text>
                                </View>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{
                                        paddingHorizontal: 5
                                    }}>{userProfile?.personal_info[0]?.company_code}</Text>
                                    <Image source={add}
                                        style={{ marginHorizontal: 5, width: 15, height: 15, }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                        {editMode_companyCode &&
                        <Animatable.View
                         animation="fadeInDown" 
                         style={[{
                            width: '90%',
                            marginLeft: '5%',
                            marginTop:'2%',
                            backgroundColor: 'white',
                            borderRadius: 4
                        }, styles.shadStyle]}>
                            <TextInput
                                style={[styles.shadStyle, {
                                    padding: 10,
                                    color:'black',
                                    borderRadius: 5,
                                    margin: '5%',
                                    backgroundColor: 'white',
                                }]}
                                placeholder={'Enter Code'}
                                value={companyCode}
                                onFocus={() => { }}
                                onChangeText={(val) => { setCompanyCode(val) }}
                            >
                            </TextInput>
                        <TouchableOpacity onPress={()=>{updateProfile()}}  style={[styles.button, { height: 25, width: "50%",alignSelf:'flex-end',marginRight:'5%',marginBottom:10 }]}  >
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                        }
                        {/* <TouchableOpacity
                            onPress={() => {navigation.navigate('Vetting');}}>
                            <View style={{
                                padding: 5, width: '90%', alignSelf: "center", height: 50, marginTop: 15, elevation: 3,
                                borderRadius: 4, flexDirection: 'row', justifyContent: 'space-between',
                                backgroundColor: 'white',
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.20,
                                shadowRadius: 1.41,
                                elevation: 2,
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image source={briefecase}
                                        style={{ width: 20, height: 20, paddingTop: '8%', marginHorizontal: '3%' }}
                                    />
                                    <Text>{"Sickness"}</Text>
                                </View>
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row'
                                }}>
                                    <Text style={{
                                        paddingHorizontal: 5
                                    }}>{""}</Text>
                                    <Image source={add}
                                        style={{ marginHorizontal: 5, width: 15, height: 15, }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity> */}
                    </View>
                    <View style={{ flexDirection: 'row',marginTop: '5%',marginHorizontal:20 }}>
                        <TouchableOpacity
                            onPress={() => {setSiknessModal(true) }}
                            style={{
                                flex: 1,
                                backgroundColor: '#1E7EC7',
                                padding: '3%',
                                marginRight:5,
                                alignItems: 'center',
                                borderRadius: 8
                            }}>
                            <Text style={{ color: 'white' }}>Sickness</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row',marginTop: '5%',marginHorizontal:20 }}>
                    <TouchableOpacity
                    onPress={()=>{setHolidayModal(true)}}
                       style={{
                            flex: 1,
                            padding: '3%',
                            backgroundColor: '#FE4154',
                            borderRadius: 8,
                            justifyContent: 'center', 
                        }}>
                            <Text style={{ textAlign: 'center', color: 'white' }}>REQUEST HOLIDAYS</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row',marginTop: '5%',marginHorizontal:20 }}>
                        <TouchableOpacity
                            onPress={async () => {
                                Alert.alert(
                                    "Are you sure?",
                                    "",
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                        },
                                        {
                                            text: "Log Out",
                                            onPress: async () => {
                                                await services.removeAuthData();
                                                RNRestart.Restart();
                                            }
                                        }
                                    ]
                                );
                             }}
                            style={{
                                flex: 1,
                                padding: '3%',
                                backgroundColor: '#FE4154',
                                borderRadius: 8,
                                justifyContent: 'center',
                            }}>
                            <Text style={{ textAlign: 'center', color: 'white' }}>LOGOUT</Text>
                        </TouchableOpacity>
                        </View>
                    <View style={{ height: 100, }}></View>
                </View>
            </ScrollView >
            {isAnimating &&
                <ActivityIndicator size="large" color="#1FC7B2" animating={isAnimating} style={styles.loading} />
            }
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1FC7B2",
        alignContent: 'center',
    },
    ImageView: {
        height: 120,
        width: 120,
        borderRadius: 60,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center"


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
    textField: {
        color:'black',
        marginTop: 6,
        marginBottom: 3,
        paddingTop: '3%',
        paddingBottom: '3%',
    },
    inputField:{
     color:'black',
     padding:10,
     borderWidth:1,
     borderRadius:10,
     marginVertical:10
    },
    inputFieldLabel: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 8
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
    button: {
        backgroundColor: "#1FC7B2", marginTop: 10,
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
    input:{
        color:'black',
        marginTop: 20,
        padding:20,
        borderWidth:1,
        width:'100%',
        height:100,
        borderRadius: 25,

    }
});

export default Profile;
