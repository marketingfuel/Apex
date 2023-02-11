// ./screens/Home.js

import React, { useState, useEffect, useContext, useRef } from "react";
import down from '../Assets/Icons/down.png';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    ActivityIndicator,
    StatusBar,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    FlatList,
    Platform,
    Linking,
    RefreshControl
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import bell from '../Assets/Icons/bell_icon.png'
import bag from '../Assets/Icons/bag.png'
import briefecase from '../Assets/Icons/briefcase1.png'
import next from '../Assets/Icons/next.png'
import visa from '../Assets/Icons/visa.png'
import address from '../Assets/Icons/location.png'
import services from '../services/Services'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import moment from 'moment'
import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown } from 'react-native-material-dropdown-v2';
const screenWidth = Dimensions.get("window").width - 30;
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

const chartConfig = {
    // backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#1FC7B2",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
};
function donates(props,{ navigation }) {

    const [activeTab,setActiveTab]= useState(props.route.params?.activeTab || 1);
    const [isAnimating, setAnimating] = useState(false);
    const [isDisabled, setDisabled] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);

    const [isEditMode_location, setIsEditMode_location] = useState(true);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [allSkills, setAllSkills] = useState([]);

    const [locationValue,setLocationValue] = useState(null);
    const [allLocations, setAllLocations] = useState([]);
    const [state, setState] = useState({

        Calender: true,
        Location: false,
        Earnings: false,
        Skills: false,
        Experience: false,


        BGCalender: 'white',
        BGLocation: "#1FC7B2",
        BGEarnings: "#1FC7B2",
        BGSkills: "#1FC7B2",
        BGExperience: "#1FC7B2",


        textLocation: "white",
        textCalender: "#1FC7B2",
        textEarnings: "white",
        textSkills: "white",
        textExperience: "white",



        textWeightEarnings: "500",
        textWeightCalender: "600",
        textWeightLocation: "500",
        textWeightSkills: "500",
        textWeightExperience: "500",

    });
    const [refreshing, setRefreshing] = useState(false);
    const [LocationList, setLocationList] = useState([]);
    const [SkilLList, setSkilList] = useState([]);
    const [experienceList, setExperience] = useState([]);
    const [data, setData] = useState({
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43],
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: ["Total earning 123$"] // optional
    });
    const [Work_History_Array, setWork_History_Array] = useState([
        {
            title: 'Notifications Title', date: "22 Oct 2020", amount: "250$"
        },
        {
            title: 'Notifications Title', date: "22 Oct 2020", amount: "250$"
        },
        {
            title: 'Notifications Title', date: "22 Oct 2020", amount: "250$"
        }
    ]);
    const [markedDates, setMarkedDates] = useState({});
    
    useEffect(async () => {
        getSkills()
        getLocations()
        getExperience()
        getAllSkills()
        getAllLocations()
        getJobs();
    }, []);
   
    useEffect(()=>{
        if(props.route.params?.activeTab == 5){
            changeFifthTab();
        }
        return()=>{
           props.navigation.setParams({activeTab:1});
        };
    },[props.route.params?.activeTab])
    
    
    const getDisableDates = async (__markedDates) => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            const result = await services.get(`disabled-date?email=` + auth?.email, auth?.token)
            console.log("disable dates", result);
            if (result.success) {
                let _markedDates = __markedDates;
                result?.data.forEach((item) => {
                    console.log(item?.disabled_date)
                    _markedDates = {
                        ..._markedDates,
                        [item.disabled_date.toString()]: {
                            periods: [
                                { startingDay: true, endingDay: true, color: '#FF0000' },
                            ],
                            disable: true
                        }
                    }
                })
                console.log(_markedDates);
                setMarkedDates(_markedDates);
            }
        }
        catch (ex) {
            console.log(ex);
        }
        finally {
            setAnimating(false)
        }
    }
    const saveDisableDate = async (date) => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            const result = await services.post1(`save-disabled-date?email=${auth?.email}&date=${date}`, auth?.token)
            console.log(date, result);
            if (result.success) {
            }
        }
        catch (ex) {
            console.log(ex);
        }
        finally {
            setAnimating(false)
        }
    }

    onRefresh = () => {
        setRefreshing(true)
        getExperience()
        setRefreshing(false)
    }

    const getJobs = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            const result = await services.get(`get-home?email=` + auth?.email, auth?.token)
            console.log(result);
            if (result.success) {
                await markJobDates(result?.data?.new_jobs)
            }
        }
        catch (ex) {
          console.log(ex);
          alert(ex?.message || 'Some thing went wrong!!')
        }
        finally {
            setAnimating(false)
        }
    }

    const markJobDates = async (data) => {
        let _markedDates = markedDates;
        data = data.sort(function (x, y) {
            return moment(x.date_from) - moment(y.date_from);
        });

        data.forEach(job => {
            let jobColor = "#"+job.title["0"]+"7BDE2";
            let startDate = moment(job.date_from);
            let endDate = moment(job.date_to);

            for (let d = moment(startDate); d.isSameOrBefore(endDate); d.add(1, 'days')) {
                let _dFormate = d.format('YYYY-MM-DD');
                if (_markedDates.hasOwnProperty(_dFormate.toString())) {
                    if (d.isSame(startDate)) {
                        _markedDates[_dFormate.toString()].periods.push({ startingDay: true, endingDay: false, color: jobColor })
                    }
                    else if (d.isSame(endDate)) {
                        _markedDates[_dFormate.toString()].periods.push({ startingDay: false, endingDay: true, color: jobColor })
                    }
                    else {
                        _markedDates[_dFormate.toString()].periods.push({ startingDay: false, endingDay: false, color: jobColor })
                    }
                }
                else {
                    //if Start date
                    if (d.isSame(startDate)) {
                        _markedDates = {
                            ..._markedDates,
                            [_dFormate]: {
                                periods: [
                                    { startingDay: true, endingDay: false, color: jobColor },
                                ]
                            }
                        }
                    }
                    //if end date
                    else if (d.isSame(endDate)) {
                        _markedDates = {
                            ..._markedDates,
                            [_dFormate]: {
                                periods: [
                                    { startingDay: false, endingDay: true, color: jobColor },
                                ]
                            }
                        }
                    }
                    else {
                        _markedDates = {
                            ..._markedDates,
                            [_dFormate]: {
                                periods: [
                                    { startingDay: false, endingDay: false, color: jobColor },
                                ]
                            }
                        }
                    }
                }
            }
        });

       getDisableDates(_markedDates);
       setMarkedDates(_markedDates);
    }

    const getSkills = async () => {
        setAnimating(true)
        const auth = await services.getAuthData();
        const result = await services.get(`workpreference?email=${auth?.email}&type=skills`,auth?.token)
         console.log(result);
        if (result.success) {
            setAnimating(false)
            setSkilList(result.skills)
            return
        }
        setAnimating(false)
        alert(result?.error ? result.error : 'Some thing went wrong!!')
    }
    const getLocations = async () => {
        setAnimating(true)
        const auth = await services.getAuthData();
        const result = await services.get(`workpreference?email=${auth?.email}&type=location`,auth?.token)
        console.log(result);
        if (result.success) {
            setAnimating(false)
            setLocationList(result.location)
            return
        }
        setAnimating(false)
        alert(result?.error ? result.error : 'Some thing went wrong!!')
    }

    const getExperience = async () => {
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

    const getAllSkills = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            let url = `all_skill_location?email=${auth?.email}&type=skills`
            const result = await services.get(url, auth?.token);
            if (result.success) {
                const data = result?.skills;
                let _skills = [];
                data.forEach(element => {
                    let _skill = { label: element.skill_name, value: element.id }
                    _skills.push(_skill);
                });
                setAllSkills(_skills);
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

    const getAllLocations = async () => {
        try {
            setAnimating(true)
            const auth = await services.getAuthData();
            let url = `all_skill_location?email=${auth?.email}&type=location`
            const result = await services.get(url, auth?.token);
            if (result.success) {
               
                const data = result?.location;
                let _locations = [];
                data.forEach(element => {
                    let _location = { label: element.location_name, value:element.location_id }
                    _locations.push(_location);
                });
                setAllLocations(_locations);
            }
            console.log("Locations",result);
        }
        catch (ex) {
            alert('Some thing went wrong!!')
            console.log(ex)
        }
        finally {
            setAnimating(false)
        }
    }

    const addSkill = async (id) => {
        if (id != null) {
            try {
                setAnimating(true)
                const auth = await services.getAuthData();
                let url = `add_skill?email=${auth?.email}&type=skill&action=add&id=${id}`
                const result = await services.post1(url, auth?.token);
                if (result.success) {
                    getSkills()
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
    }

    const removeSkill = async (id) => {
        if (id != null) {
            try {
                setAnimating(true)
                const auth = await services.getAuthData();
                let url = `remove_skill?email=${auth?.email}&type=skill&action=remove&id=${id}`
                const result = await services.delete1(url, auth?.token);
                if (result.success) {
                    getSkills()
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
    }

    const addLocation = async (id) => {
        if (id != null) {
            try {
                setAnimating(true)
                const auth = await services.getAuthData();
                let url = `add_location?email=${auth?.email}&type=location&id=1&action=add&location=${id}`
                const result = await services.post1(url, auth?.token);
                if (result.success) {
                    getLocations()
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
    }

    const removeLocation = async (id) => {
        if (id != null) {
            try {
                setAnimating(true)
                const auth = await services.getAuthData();
                let url = `remove_location?email=${auth?.email}&type=location&action=remove&id=${id}`
                const result = await services.post1(url, auth?.token);
                if (result.success) {
                    getLocations()
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
    }

    const openLocationOnMap = async (location) => {
        const url = Platform.select({
            ios: `maps:0,0?q=${location}`,
            android: `geo:0,0?q=${location}`,
        })

        Linking.openURL(url)
    }

    changeFirstTab = () => {
        setState({
            Location: false, Calender: true, Earnings: false, Skills: false, Experience: false,
            BGLocation: "#1FC7B2", BGEarnings: '#1FC7B2', BGCalender: 'white', BGSkills: "#1FC7B2", BGExperience: "#1FC7B2",
            textLocation: "white", textCalender: "#1FC7B2", textEarnings: "white", textSkills: "white", textExperience: "white",
            textWeightEarnings: "500", textWeightCalender: "600", textWeightLocation: "500", textWeightSkills: "500", textWeightExperience: "500"
        });
    }

    goToNotification = () => {
        props.navigation.navigate('Notification')
    }

    changeSeconTab = () => {

        setState({
            Location: true, Calender: false, Earnings: false, Skills: false, Experience: false,
            BGLocation: 'white', BGCalender: "#1FC7B2", BGEarnings: "#1FC7B2", BGSkills: "#1FC7B2", BGExperience: "#1FC7B2",
            textLocation: "#1FC7B2", textCalender: "white", textEarnings: "white", textSkills: "white", textExperience: "white",
            textWeightEarnings: "500", textWeightCalender: "500", textWeightLocation: "600", textWeightLocation: "500", textWeightSkills: "500", textWeightExperience: "500"


        });
        console.log(state.Location)

    }

    changeThirdTab = () => {
        setState({
            Location: false, Calender: false, Earnings: true, Skills: false, Experience: false,
            BGLocation: "#1FC7B2", BGEarnings: 'white', BGCalender: "#1FC7B2", BGSkills: "#1FC7B2", BGExperience: "#1FC7B2",
            textLocation: "white", textCalender: "white", textEarnings: "#1FC7B2", textSkills: "white", textExperience: "white",
            textWeightEarnings: "600", textWeightCalender: "500", textWeightLocation: "500", textWeightLocation: "500", textWeightSkills: "500", textWeightExperience: "500"
        });

    }

    changeforthTab = () => {
        setState({
            Location: false, Calender: false, Earnings: false, Skills: true, Experience: false,
            BGLocation: "#1FC7B2", BGEarnings: '#1FC7B2', BGCalender: "#1FC7B2", BGSkills: 'white', BGExperience: "#1FC7B2",
            textLocation: "white", textCalender: "white", textEarnings: "white", textSkills: "#1FC7B2", textExperience: "white",
            textWeightEarnings: "500", textWeightCalender: "500", textWeightLocation: "500", textWeightLocation: "500", textWeightSkills: "600", textWeightExperience: "500"
        });

    }

    changeFifthTab = () => {
        setState({
            Location: false, Calender: false, Earnings: false, Skills: false, Experience: true,
            BGLocation: "#1FC7B2", BGEarnings: '#1FC7B2', BGCalender: "#1FC7B2", BGSkills: '#1FC7B2', BGExperience: 'white',
            textLocation: "white", textCalender: "white", textEarnings: "white", textSkills: "white", textExperience: "#1FC7B2",
            textWeightEarnings: "500", textWeightCalender: "500", textWeightLocation: "500", textWeightLocation: "500", textWeightSkills: "500", textWeightExperience: "600"
        });

    }

    return (
        <SafeAreaView style={[styles.container]}>
            <StatusBar barStyle="light-content" backgroundColor="#1FC7B2" />

            {/* top bar */}
            {/* top bar */}
            <View style={{ width: "100%", flexDirection: "row", height: 60, backgroundColor: '#1FC7B2', justifyContent: "space-between" }}>
                {/* <TouchableOpacity style={{ width: '15%', justifyContent: "center", alignItems: "center" }}   >

                </TouchableOpacity> */}
                <View style={{ width: "70%", justifyContent: "center", marginLeft: 20 }}>
                    <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>Work Prefrences</Text>
                </View>
                <TouchableOpacity style={{ width: '15%', justifyContent: "center", alignItems: "center" }} onPress={() => { goToNotification() }} >
                    <Image source={bell} style={{ width: 25, height: 25 }}></Image>
                </TouchableOpacity>
            </View>
            {/* top bar */}

            <View style={{ justifyContent: "center", flexDirection: "row", width: "98%", alignSelf: "center", height: 37, alignItems: "center", borderRadius: 20, backgroundColor: '#1FC7B2', paddingBottom: 10, marginTop: 10 }}>

                <TouchableOpacity style={styles.tab} onPress={() => { changeFirstTab() }}>

                    <View style={{ height: 33, backgroundColor: state.BGCalender, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 12, color: state.textCalender, fontWeight: state.textWeightCalender }}>Calender</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => { changeSeconTab() }}>
                    <View style={{ height: 33, backgroundColor: state.BGLocation, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 12, color: state.textLocation, fontWeight: state.textWeightLocation }}>Location</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => { changeThirdTab() }}>

                    <View style={{ height: 33, backgroundColor: state.BGEarnings, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 12, color: state.textEarnings, fontWeight: state.textWeightEarnings }}>Earnings</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => { changeforthTab() }}>

                    <View style={{ height: 33, backgroundColor: state.BGSkills, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 12, color: state.textSkills, fontWeight: state.textWeightSkills }}>Skills</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => { changeFifthTab() }}>

                    <View style={{ height: 33, backgroundColor: state.BGExperience, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 12, color: state.textExperience, fontWeight: state.textWeightExperience }}>Experience</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#F2F2F5', width: "100%", height: "90%", }}>

                {state.Calender == true &&
                    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}  >
                        <View style={{ width: "100%", }}>
                            <Calendar
                                style={{
                                    height: 400
                                }}
                                theme={{
                                    backgroundColor: '#ffffff',
                                    calendarBackground: '#ffffff',
                                    todayTextColor: '#197B81',
                                    arrowColor: '#197B81',
                                    monthTextColor: '#197B81',
                                    indicatorColor: '#197B81',
                                    textDayFontWeight: '300',
                                    textMonthFontWeight: '500',
                                    textDayHeaderFontWeight: '300',
                                    textDayFontSize: 16,
                                    textMonthFontSize: 16,
                                    textDayHeaderFontSize: 16
                                }}
                                current={new Date()}
                                minDate={new Date()}
                                monthFormat={'MMMM yyyy'}
                                hideArrows={false}
                                disableMonthChange={false}
                                firstDay={1}
                                hideExtraDays={true}
                                hideDayNames={false}
                                showWeekNumbers={false}
                                disableAllTouchEventsForDisabledDays={true}
                                enableSwipeMonths={true}
                                markingType={'multi-period'}
                                markedDates={markedDates}
                                onDayPress={day => {
                                    let _markedDates = markedDates;
                                    let _dFormate = day.dateString.toString();

                                    if (_markedDates.hasOwnProperty(_dFormate)) {
                                        if(_markedDates[_dFormate].hasOwnProperty('disable'))
                                        {
                                            delete _markedDates[_dFormate.toString()];
                                            _markedDates = {..._markedDates};
                                            saveDisableDate(_dFormate);
                                        }
                                    }
                                    else {
                                        _markedDates = {
                                            ..._markedDates,
                                            [_dFormate]: {
                                                periods: [
                                                    { startingDay: true, endingDay: true, color: '#FF0000'},
                                                ],
                                                disable:true
                                            }
                                        }
                                        saveDisableDate(_dFormate);
                                    }
                                    setMarkedDates(_markedDates);
                                }}
                                //   onDayLongPress={day => {
                                //     let dateString= day.dateString;
                                //     let markeDate={
                                //         [dateString]: { selected: true, marked: true, selectedColor: '#1FC7B2' },
                                //     }
                                //     setMarkedDates(markeDate);
                                //     console.log('selected day', day);
                                //   }}
                            />

                            <TouchableOpacity style={[styles.button, { marginTop: '27%' }]}  >
                                <Text style={[styles.buttonText,]}>Confirm</Text>
                            </TouchableOpacity>


                        </View>
                    </ScrollView>
                }
                {state.Location == true &&
                    <View style={{ flex: 1, width: "100%", }}>
                        <View style={{ width: "90%", alignSelf: "center", flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, }}>Location  </Text>
                            <TouchableOpacity onPress={()=>{setIsEditMode_location(isEditMode_location ? false : true)}} >
                                <View>
                                    <Text style={{
                                        fontSize: 16, fontStyle: "italic", color: '#1FC7B2',
                                    }}>{isEditMode_location ? "Done" : "Edit"}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {isEditMode_location &&
                        <View style={{
                            padding: 20,
                            flex:1,
                            paddingBottom: 0,
                            borderRadius:10,
                            backgroundColor:'white',
                            marginHorizontal: 20
                        }}>
                            <Text style={{
                                fontSize: 16,
                            }}>Add More Locations
                            </Text>
                            <View style={{flex:1}}>
                        <GooglePlacesAutocomplete
                            placeholder='Search Location'
                            onPress={(data, details = null) => {
                                // 'details' is provided when fetchDetails = true
                                setLocationValue(data?.description)
                                console.log(data);
                            }}
                            query={{
                                key: 'AIzaSyBbeMwEJjULlMWAG7n40lsIIrjJOXtBXi0',
                                language: 'en',
                            }}
                        />
                        </View>
                            {/* <Dropdown
                                label='Select Location'
                                value={locationValue}
                                onChangeText={setLocationValue}
                                data={allLocations}
                            /> */}
                            <TouchableOpacity onPress={() => {addLocation(locationValue)}}
                                style={[styles.button, {
                                    height: 25,
                                    width: "50%",
                                    alignSelf: 'flex-end',
                                    marginBottom:10
                                }]}  >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        }
                        <FlatList
                            data={LocationList}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                onPress={()=>openLocationOnMap(item.name)}
                                 key={item.id}>
                                    <View style={[{
                                        width: '90%', alignSelf: "center", height: 50, marginTop: 15,
                                        borderRadius: 10, flexDirection: 'row',
                                        backgroundColor: 'white',
                                    }, styles.shadStyle]}>
                                        <View style={{ height: 50, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, backgroundColor: "#1FC7B2", width: 7 }}></View>
                                        <View style={{ alignItems: 'center',flex:1, flexDirection: 'row' }}>
                                                <View style={{flex:4,flexDirection:'row',alignItems: 'center'}}>
                                                <Image source={address}
                                                    style={{ width: 25, height: 25, marginHorizontal: 5 }}
                                                />
                                                <Text style={{ fontSize: 13, color: "black" }}>{item.location}</Text>
                                                </View>
                                                {isEditMode_location &&
                                                <View style={{flex:1,alignItems:'flex-end',marginRight:10}}>
                                                <TouchableOpacity
                                                    onPress={()=> {removeLocation(item.id)}}
                                                    style={{
                                                        height: 20,
                                                        width: 20,
                                                        backgroundColor: 'red',
                                                        borderRadius: 100,
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                    <Text style={{ color: 'white' }}>X</Text>
                                                </TouchableOpacity>
                                                </View>
                                               }
                                            </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                }
                {state.Earnings == true &&
                    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}  >
                        <View>
                            <View style={{ flex: 1, width: "95%", alignSelf: "center", marginTop: 20, justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>

                                <View style={[{ width: "30%", paddingVertical: 10, backgroundColor: '#52C7A7', borderRadius: 10, justifyContent: "center", justifyContent: "center", paddingHorizontal: 10 }, styles.shadStyle]}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <Image source={bag}
                                            style={{ width: 20, height: 20, }}
                                        />
                                        <Text style={{ fontSize: 16, color: "white", marginLeft: 5 }}>Today</Text>
                                    </View>
                                    <Text style={{ fontSize: 16, color: "white", marginTop: 10 }}>$250.00</Text>

                                </View>
                                <View style={[{ width: "30%", paddingVertical: 10, backgroundColor: '#F2716E', borderRadius: 10, justifyContent: "center", justifyContent: "center", paddingHorizontal: 10 }, styles.shadStyle]}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <Image source={bag}
                                            style={{ width: 20, height: 20, }}
                                        />
                                        <Text style={{ fontSize: 16, color: "white", marginLeft: 5 }}>Today</Text>
                                    </View>
                                    <Text style={{ fontSize: 16, color: "white", marginTop: 10 }}>$250.00</Text>

                                </View>
                                <View style={[{ width: "30%", paddingVertical: 10, backgroundColor: '#6C7AD2', borderRadius: 10, justifyContent: "center", paddingHorizontal: 10 }, styles.shadStyle]}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <Image source={bag}
                                            style={{ width: 20, height: 20, }}
                                        />
                                        <Text style={{ fontSize: 16, color: "white", marginLeft: 5 }}>Today</Text>
                                    </View>
                                    <Text style={{ fontSize: 16, color: "white", marginTop: 10 }}>$250.00</Text>

                                </View>




                            </View>

                            <Text style={{ fontWeight: 'bold', fontSize: 16, marginVertical: 10, marginTop: 20, marginHorizontal: 20 }}>Summery  </Text>
                            <View style={[{ width: "95%", paddingVertical: 10, borderRadius: 10, justifyContent: "center", justifyContent: "center", alignSelf: "center", paddingHorizontal: 10 }]}>
                                <LineChart
                                    data={data}
                                    width={screenWidth}
                                    height={256}
                                    verticalLabelRotation={30}
                                    chartConfig={chartConfig}
                                    bezier
                                />
                            </View>

                            <Text style={{ fontWeight: 'bold', fontSize: 16, marginVertical: 10, marginTop: 20, marginHorizontal: 20 }}>My Card  </Text>
                            <TouchableOpacity onPress={()=>{props.navigation.navigate('Payment')}}>
                                <View style={[{
                                    padding: 5, width: '90%', alignSelf: "center", height: 50, marginTop: 5,
                                    borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between',
                                    backgroundColor: 'white',

                                }, styles.shadStyle]}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <Image source={visa}
                                            style={{ width: 20, height: 20, paddingTop: '8%', marginHorizontal: '3%', marginHorizontal: 10 }}
                                        />
                                        <Text style={{ fontSize: 16, color: "black", }}>$250.00</Text>
                                    </View>

                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <Image source={next}
                                            style={{ marginHorizontal: 5, width: 15, height: 15, }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <Text style={{ fontWeight: 'bold', fontSize: 16, marginVertical: 10, marginTop: 20, marginHorizontal: 20 }}>Work History  </Text>

                            <View style={{ width: "90%", alignSelf: "center" }}>
                                {
                                    Work_History_Array.map((item, index) => {
                                        return (
                                            <TouchableOpacity>
                                                <View style={{ marginBottom: "2%", flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>
                                                    <View style={{ flexDirection: 'row', marginVertical: "2%", alignItems: "center" }}>
                                                        <Image style={{ width: 30, height: 30, marginRight: 10 }}
                                                            source={briefecase} />
                                                        <View>
                                                            <Text style={{ marginHorizontal: '3%', }}>{item.title}</Text>
                                                            <Text style={{ marginHorizontal: '3%', }}>{item.date}</Text>

                                                        </View>
                                                    </View>
                                                    <Text style={{ marginHorizontal: '3%', color: "#EBB32E", fontSize: 15, fontWeight: "bold" }}>{item.amount}</Text>

                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })
                                }
                            </View>
                            < View style={{ height: 200 }}>


                            </View>

                        </View>
                    </ScrollView>
                }
                {state.Skills == true &&
                    <View style={{ flex: 1, width: "100%", }}>
                        <View style={{ flex: 1, width: "100%", }}>
                            <View style={{ width: "90%", alignSelf: "center", flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 20 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16, }}>Skills  </Text>
                                <TouchableOpacity onPress={()=>{setIsEditMode(isEditMode ? false : true)}} >
                                <View>
                                    <Text style={{
                                        fontSize: 16, fontStyle: "italic", color: '#1FC7B2',
                                    }}>{isEditMode ? "Done" : "Edit"}</Text>
                                </View>
                            </TouchableOpacity>
                            </View>
                        {isEditMode &&
                        <View style={{
                            padding: 20,
                            paddingBottom: 0,
                            borderRadius:10,
                            backgroundColor:'white',
                            marginHorizontal: 20
                        }}>
                            <Text style={{
                                fontSize: 16,
                            }}>Add More Skills
                            </Text>
                            <Dropdown
                                label='Select Skill'
                                value={value}
                                onChangeText={setValue}
                                data={allSkills}
                            />
                            <TouchableOpacity onPress={() => {addSkill(value)}}
                                style={[styles.button, {
                                    height: 25,
                                    width: "50%",
                                    alignSelf: 'flex-end',
                                    marginBottom:10
                                }]}  >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                        }
                        <View>
                            <FlatList
                                data={SkilLList}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item, index) => item.skill_id}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity key={item.skill_id}>
                                        <View style={[{
                                            width: '90%', alignSelf: "center", height: 50, marginTop: 15,
                                            borderRadius: 10, flexDirection: 'row',
                                            backgroundColor: 'white',
                                        }, styles.shadStyle]}>
                                            <View style={{ height: 50, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, backgroundColor: "#1FC7B2", width: 7 }}></View>
                                            <View style={{ alignItems: 'center',flex:1, flexDirection: 'row' }}>
                                                <View style={{flex:4,flexDirection:'row',alignItems: 'center'}}>
                                                <Image source={address}
                                                    style={{ width: 25, height: 25, marginHorizontal: 5 }}
                                                />
                                                <Text style={{ fontSize: 13, color: "black" }}>{item.skill_name}</Text>
                                                </View>
                                                {isEditMode &&
                                                <View style={{flex:1,alignItems:'flex-end',marginRight:10}}>
                                                <TouchableOpacity
                                                    onPress={()=> {removeSkill(item.skill_id)}}
                                                    style={{
                                                        height: 20,
                                                        width: 20,
                                                        backgroundColor: 'red',
                                                        borderRadius: 100,
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                    <Text style={{ color: 'white' }}>X</Text>
                                                </TouchableOpacity>
                                                </View>
                                               }
                                            </View>

                                        </View>
                                    </TouchableOpacity>

                                )}
                            />
                        </View>
                        </View>
                    </View>
                }
                {state.Experience == true &&
                    <View style={{ flex: 1, width: "100%", }}>
                        <View style={{ width: "90%", alignSelf: "center", flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 20 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16, }}>Experience  </Text>
                            <TouchableOpacity  onPress={()=>{
                                props.navigation.navigate('AddExperianceScreen')
                            }}>
                                <View>
                                    <Text style={{
                                        fontSize: 16, fontStyle: "italic", color: '#1FC7B2',
                                    }}>{experienceList?.length > 0 ? "Edit" : "Add"} </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={experienceList}
                            style={{marginBottom:70}}
                            refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                           }
                            renderItem={({ item, index }) => (
                                <TouchableOpacity>
                                    <View style={[{
                                        width: '90%', alignSelf: "center", padding: 20, marginTop: 40,
                                        borderRadius: 5,
                                        backgroundColor: 'white',
                                    }, styles.shadStyle]}>

                                        <View style={{
                                            width: '100%', height: 30, marginTop: -40,
                                            marginLeft: -20,
                                            borderRadius: 20, justifyContent: "center", alignItems: "center",
                                            backgroundColor: index % 2 == 0 ? "#35C4EF" : "#F2716E",
                                        }}>
                                            <Text style={{ fontSize: 16, color: "white", }}>{item.title}</Text>
                                        </View>
                                        <Text style={{ fontSize: 14, color: "#B0B0B0", fontWeight: "bold", marginTop: 10 }}>Responsibiltity</Text>
                                        <Text style={{ fontSize: 16, color: "black" }}>{item.reponsibility}</Text>
                                        <Text style={{ fontSize: 14, color: "#B0B0B0", fontWeight: "bold", marginTop: 10 }}>Experiance</Text>
                                        <Text style={{ fontSize: 16, color: "black" }}>{new Date(item.end_year)?.getFullYear()-new Date(item.start_year)?.getFullYear()+" year"}</Text>
                                        <Text style={{ fontSize: 14, color: "#B0B0B0", fontWeight: "bold", marginTop: 10 }}>Period</Text>
                                        <Text style={{ fontSize: 16, color: "black" }}>{item.start_year+" - "+item.end_year}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />

                    </View>
                }

            </View>

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



    buttonText: {
        color: '#FFFFFF',
        fontSize: 17,
    },
    textField: {

        fontSize: 15,
        width: "90%",


    },
    button: {
        alignSelf: 'center',
        height: 50,
        width: "70%",
        backgroundColor: '#1FC7B2',
        justifyContent: 'center',
        borderRadius: 11,
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
    tab: {
        width: "20%",
        height: 33,
    },
    shadStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
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

export default donates;
