import React, { useState, useEffect, useContext, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView, FlatList,
    ScrollView,
    Image,
    StyleSheet,
    StatusBar
} from 'react-native';
import back from '../Assets/Icons/Arrr.png';
import next from '../Assets/Icons/next.png';
import goldNoti from '../Assets/Icons/goldNoti.png';


function filter({ navigation }) {
    const [filter, setNotifiation] = useState([
        {
            title: "Sector", job: "security",
        },
        {
            title: "Sector", job: "security",
        },
        {
            title: "Sector", job: "security",
        },
        {
            title: "Sector", job: "security",
        },
        {
            title: "Sector", job: "security",
        },
        {
            title: "Sector", job: "security",
        },
        {
            title: "Sector", job: "security",
        },
        {
            title: "Sector", job: "security",
        },
    ])
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
                <Text style={{ color: 'white', fontSize: 18 }}>Filter</Text>
            </View>
            <View style={{ backgroundColor: '#F2F2F5', flex: 1, }}>
                <View style={{ width: '90%', marginTop: '5%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: '5%' }}>
                    <Text style={{ fontSize: 16, color: '#1dc6b0', fontWeight: 'bold' }}>Filter By</Text>
                    <Text style={{ fontSize: 14, color: 'red' }}>Clear All</Text>
                </View>
                <View style={[styles.seperater, { width: '90%', alignSelf: "center", marginTop: '4%' }]} />

                <FlatList
                    data={filter}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity>
                            <View style={{ marginTop: '5%', width: '90%', marginLeft: '5%', flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View style={{ flexDirection: "row" }}>
                                    <View>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: '2%' }}>{item.title}</Text>
                                        <Text style={{ fontSize: 14, color: "#75726E" }}>{item.job}</Text>

                                    </View>
                                </View>
                                <Image source={next} style={{ width: 15, height: 15, tintColor: '#1dc6b0', }} />
                            </View>
                            <View style={[styles.seperater, { marginTop: '3%' }]} />

                            {index == filter.length - 1 &&
                                < View style={{ height: 200 }}>


                                </View>
                            }
                        </TouchableOpacity>


                    )}
                />



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
        marginLeft: 20,
        marginRight: 30,
        marginBottom: 10,
        backgroundColor: '#d5c9de',
    },
});

export default filter;