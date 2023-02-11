import React, { useState, useEffect, useContext, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    ScrollView,
    ActivityIndicator,
    Image,
    StyleSheet,
    StatusBar
} from 'react-native';
import back from '../Assets/Icons/Arrr.png';
import next from '../Assets/Icons/next.png';
import goldNoti from '../Assets/Icons/goldNoti.png';
import services from '../services/Services'


function Notification({ navigation }) {
    const [isAnimating, setAnimating] = useState(false);
    const [notification, setNotification] = useState([])

    Back = () => {
        navigation.goBack()
    }


    useEffect(() => {
        getNotifications()
    }, [])

    getNotifications = async () => {
        setAnimating(true)
        const auth = await services.getAuthData();
        const result = await services.get(`get-notification?email=${auth?.email}`,auth?.token)

        if (result.success) {
            setAnimating(false)
            setNotification(result.notification)
            return
        }
        setAnimating(false)
        alert(result?.error ? result.error : 'Some thing went wrong!!')
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />
            <View style={{ width: "100%", backgroundColor: "#1FC7B2", flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.back} styles={{ width: "15%" }} onPress={() => { Back() }}>
                    <Image source={back} style={styles.backIcon}></Image>
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 18 }}>Notification</Text>
            </View>
            <View style={{ backgroundColor: '#F2F2F5', flex: 1, }}>

                <FlatList
                    data={notification}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity>
                            <View style={{ marginTop: '5%', width: '90%', marginLeft: '5%', flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View style={{ flexDirection: "row" }}>
                                    <Image source={goldNoti} style={{ width: 20, height: 20, alignSelf: 'center', marginRight: 10 }} />
                                    <View>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: '2%' }}>{item.text}</Text>
                                        <Text style={{ fontSize: 12, color: "#75726E" }}>{item.created_at}</Text>

                                    </View>
                                </View>
                                <Image source={next} style={{ width: 15, height: 15, tintColor: '#1dc6b0', alignSelf: 'center' }} />
                            </View>
                            <View style={[styles.seperater, { marginTop: '3%' }]} />

                            {index == notification.length - 1 &&
                                < View style={{ height: 200 }}>
                                </View>
                            }
                        </TouchableOpacity>
                    )}
                />
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
        marginLeft: 20,
        marginRight: 30,
        marginBottom: 10,
        backgroundColor: '#d5c9de',
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

export default Notification;