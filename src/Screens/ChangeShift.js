import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import back from '../Assets/Icons/Arrr.png';
import profileIcon from '../Assets/Icons/profileIcon.png';
import arrowDown from '../Assets/Icons/downarrow.png';
import reload from '../Assets/Icons/reload.png';
import questionmark from '../Assets/Icons/question-mark.png';

function ChangeShift({ navigation }) {



    Back = () => {
        navigation.goBack()
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />
            <View style={{ width: "100%", backgroundColor: "#1FC7B2", flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.back} styles={{ width: "15%" }} onPress={() => { Back() }}>
                    <Image source={back} style={styles.backIcon}></Image>
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: "bold" }}>Change Shift</Text>
            </View>

            <View style={{ backgroundColor: '#F2F2F5', flex: 1, }}>
                <ScrollView keyboardShouldPersistTaps="handled">

                    <Text style={{ fontSize: 16, textAlign: 'center', marginTop: '15%', fontWeight: '600' }}>Explain Why You Want to Change Shift</Text>

                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', marginTop: '15%', marginLeft: '7%' }} >

                        <Image source={questionmark} style={{ height: 20, width: 20, marginTop: 20, marginRight: '3%' }}></Image>
                        <TextInput
                            style={styles.textField}
                            placeholder='Reason'
                            placeholderTextColor='black'
                            autoCapitalize={'none'}
                        >
                        </TextInput>

                    </Animatable.View>

                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>

                    <Animatable.View animation="fadeInUp" style={{ flexDirection: 'row', marginTop: '3%', marginLeft: '7%' }} >

                        <Image source={reload} style={{ height: 20, width: 20, marginTop: 20, marginRight: '3%' }}></Image>
                        <TextInput
                            style={styles.textField}
                            placeholder='To Evening'
                            placeholderTextColor='black'
                            autoCapitalize={'none'}
                        >
                        </TextInput>
                        <Image source={arrowDown} style={{ width: 13, height: 13, alignSelf: 'center', marginTop: '5%' }} />
                    </Animatable.View>
                    <Animatable.View animation="fadeInUp" style={styles.seperater}></Animatable.View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('ChangeShift')}
                        style={{ borderRadius: 15, width: '85%', backgroundColor: '#1dc7b1', alignSelf: 'center', marginTop: '10%', height: 40, justifyContent: 'center', marginBottom: '15%' }}>
                        <Text style={{ textAlign: 'center', color: 'white' }}>CONFRIM NOW</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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

    seperater: {
        height: 1,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 10,
        backgroundColor: '#d5c9de',
    },
    textField: {
        // marginLeft: 30,
        marginRight: 30,
        width: '70%',
        marginTop: 6,
        marginBottom: -2,
        paddingTop: '3%',
        paddingBottom: '3%',
    },
});

export default ChangeShift;