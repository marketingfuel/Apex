import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Image,
    ScrollView,
    ImageBackground,
    TextInput
} from 'react-native';
import paymentImage from '../Assets/Images/SelectPayment.png';
import * as Animatable from 'react-native-animatable';
import { isIphoneX } from 'react-native-iphone-x-helper';
import back from '../Assets/Icons/Arrr.png';
import profileIcon from '../Assets/Icons/profileIcon.png';
import cvvIcon from '../Assets/Icons/cvvIcon.png';
import calenderIcon from '../Assets/Icons/calender.png';
import visaIcon from '../Assets/Icons/visaIcon.png';

function Payment({ navigation }) {
    Back = () => {
        navigation.goBack()
    }


    goToNotification = () => {
        navigation.navigate('Notification')
    }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />


            <View style={{ width: "100%", backgroundColor: "#1FC7B2", flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.back} styles={{ width: "15%" }} onPress={() => { Back() }}>
                    <Image source={back} style={styles.backIcon}></Image>
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: "bold" }}>Select Payment Method</Text>
            </View>
            <View style={{ backgroundColor: '#F2F2F5', flex: 1, }}>

                <ScrollView keyboardShouldPersistTaps="handled">
                    <Animatable.View animation="fadeInUp" style={{ height: 350, }} >
                        <ImageBackground source={paymentImage} style={{
                            flex: 1,
                            resizeMode: "contain ",
                        }}>
                        </ImageBackground>
                    </Animatable.View>
                    <Animatable.View animation='fadeInUp' style={{ backgroundColor: 'white', marginTop: '3%' }}>
                        <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', backgroundColor: 'white', marginTop: '3%', marginLeft: '7%', alignItems: "center" }} >
                            <Image source={visaIcon} style={{ height: 18, width: 18, marginRight: 5 }}></Image>
                            <TextInput
                                style={styles.textField}
                                placeholder='Visa Card Number'
                                placeholderTextColor='black'
                                autoCapitalize={'none'}
                            >
                            </TextInput>

                        </Animatable.View>

                        <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>
                        <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', backgroundColor: 'white', marginLeft: '7%', alignItems: "center" }} >
                            <Image source={profileIcon} style={{ height: 18, width: 18, marginRight: 5 }}></Image>
                            <TextInput
                                style={styles.textField}
                                placeholder='Card Holder Name'
                                placeholderTextColor='black'
                                autoCapitalize={'none'}
                            >
                            </TextInput>

                        </Animatable.View>

                        <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>


                    </Animatable.View>
                    <View style={{ backgroundColor: 'white' }}>
                        <View style={{ width: "90%", flexDirection: "row", backgroundColor: 'white' }}>
                            <View style={{ width: "50%" }}>
                                <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                                    <Image source={calenderIcon} style={{ height: 18, width: '9%', marginLeft: 30, marginRight: 10 }}></Image>

                                    <TextInput
                                        style={styles.textField}
                                        placeholder='MM/YY'
                                        placeholderTextColor='black'
                                    >
                                    </TextInput>

                                </Animatable.View>
                                <Animatable.View animation="fadeInUp" style={[styles.seperater, { width: "90%", alignSelf: "flex-start", }]}></Animatable.View>

                            </View>
                            <View style={{ width: "50%" }}>
                                <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', alignItems: "center" }} >
                                    <Image source={cvvIcon} style={{ height: 18, width: 18, marginLeft: 30, marginRight: 10 }}></Image>

                                    <TextInput
                                        style={styles.textField}
                                        placeholder='CVV'
                                        placeholderTextColor='black'>
                                    </TextInput>

                                </Animatable.View>
                                <Animatable.View animation="fadeInUp" style={[styles.seperater, { width: "90%", alignSelf: "flex-start", }]}></Animatable.View>

                            </View>
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#1FC7B2", width: '90%', marginLeft: '5%', padding: '3.5%', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: '4%', marginBottom: '15%' }}>
                            <Text style={{ color: 'white', fontSize: 16 }}>CONFIRM</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
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
        alignContent: 'center',
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
    textField: {
        // marginLeft: 30,
        marginRight: 30,
        width: '70%',


        paddingTop: '3%',
        paddingBottom: '3%',
    },
    seperater: {
        height: 1,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 10,
        backgroundColor: '#d5c9de',
    },

})

export default Payment;