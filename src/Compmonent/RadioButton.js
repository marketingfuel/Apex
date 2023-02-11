import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text, FlatList,
    Image, ScrollView,
    TextInput,
    TouchableOpacity, TouchableWithoutFeedback, ImageBackground,
    Alert,
    StatusBar,

} from 'react-native';
import fillCircle from '../Assets/Icons/fillCircle.png';
import emptyCircle from '../Assets/Icons/emptyCircle.png';


class RadioButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: ""
        }
    }

    render() {
        return (
            <View style={{ alignItems: "center", width: '100%', flexDirection: "row", marginTop: 10 }}>
                <TouchableWithoutFeedback onPress={this.props.setFirstValue}  >
                    <View style={{ flexDirection: "row", alignItems: "center", height: 20 }}>

                        <View style={{ padding: 3, flexDirection: "row", borderRadius: 10, marginRight: 5, }}>
                            <View style={{ padding: 1 }}>
                                <Image
                                    source={
                                        this.props.firstValue == true ? fillCircle : emptyCircle
                                    }
                                    resizeMode="contain"
                                    style={this.props.firstValue == true ? { height: 16, width: 16 } : { height: 12, width: 12 }}

                                />
                            </View>
                        </View>
                        <View >
                            <Text style={{ color: 'black', fontSize: 12, }}>{this.props.text1}</Text>
                        </View>

                    </View>
                </TouchableWithoutFeedback >
                <View style={{ width: 20 }}></View>
                <TouchableWithoutFeedback onPress={this.props.setSecondValue} >
                    <View style={{ flexDirection: "row", alignItems: "center", height: 20 }}>
                        <View style={{ padding: 3, flexDirection: "row", borderRadius: 10, marginRight: 5, }}>
                            <View style={{ padding: 1 }}>
                                <Image
                                    source={
                                        this.props.secondValue == true ? fillCircle : emptyCircle
                                    }
                                    resizeMode="contain"
                                    style={this.props.secondValue == true ? { height: 16, width: 16 } : { height: 12, width: 12 }}
                                />
                            </View>
                        </View>
                        <View >
                            <Text style={{ color: 'black', fontSize: 12, }}>{this.props.text2}</Text>
                        </View>

                    </View>
                </TouchableWithoutFeedback >
            </View>
        );
    }
}

export default RadioButton;