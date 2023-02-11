// ./screens/Home.js

import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    ScrollView,
    Linking,
    Platform,
    SafeAreaView,
    Modal
} from 'react-native';

import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import FRB from '../services/Firebase';
import services from '../services/Services'
import back from '../Assets/Icons/Arrr.png';
import EvilIconsIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import moment from 'moment'

function Messages({route, navigation }) {
    const [messages, setMessages] = useState([]);
   const [auth,setAuth]=useState();
   const [imageUrl,setImageUrl]=useState();
   const [resizeimageName,setResizeimageName] = useState();
   const [uploadImageUrl,setUploadImageUrl] = useState();
   const [chatImage,setChatImage] = useState();

    useEffect(async () => {
        const _auth = await services.getAuthData();
        FRB.get(message=>
            setMessages(previous =>GiftedChat.append(previous.messages, message))
        ,_auth?.email,route.params?.email);
        setAuth(_auth);
        return()=>{
            FRB.off();
        }
    }, [])

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
                let _uri =response.assets[0].uri; 
                let _name = response.assets[0].fileName || new Date().getTime().toString() + "." + extension;
                setImageUrl(_uri);
                resizeImage(_uri,_name);
            }
        });
    }

    const showFilePicker = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log('res : ' + res);
            saveFileToFirebase(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('Canceled from single doc picker');
            } else {
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    }

    const resizeImage = (_uri,_name) => {
        let newWidth = 400;
        let newHeight = 400;
        let compressFormat = 'PNG';
        let quality = 100;
        let rotation = 0;
        let outputPath = null;
        let imageUri = _uri;
        ImageResizer.createResizedImage(
            imageUri,
            newWidth,
            newHeight,
            compressFormat,
            quality,
            rotation,
            outputPath,
        )
            .then((response) => {
                // response.uri is the URI of the new image that can now be displayed, uploaded...
                //resized image uri
                let uri = response.uri;
                console.log(uri);
                //generating image name
                let imageName = _name;
                //to resolve file path issue on different platforms
                let uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                //setting the image name and image uri in the state

                setResizeimageName(imageName);
                setUploadImageUrl(uploadUri);

                saveImageToFirebase(imageName,uploadUri);
            })
            .catch((err) => {
                console.log('image resizing error => ', err);
            });
    }
    
    const saveImageToFirebase = (imageName,uploadUri) => {
        firebase
            .storage()
            .ref(imageName)
            .putFile(uploadUri)
            .then((snapshot) => {
                console.log("imageRef"+imageName);
                console.log(snapshot);
                //You can check the image is now uploaded in the storage bucket
                console.log(`${imageName} has been successfully uploaded.`);
                getImageFromFirebase(imageName);
            })
            .catch((e) => console.log('uploading image error => ', e));
    }
    const getImageFromFirebase = (_imageRef) => {
        let imageRef = firebase.storage().ref('/' + _imageRef);
        imageRef
          .getDownloadURL()
          .then((url) => {
            //from url you can fetched the uploaded image easily
            console.log("retriveImage",url);
            setChatImage(url);

            sendImage({
                 image:url,
                  user: {
                      _id: FRB.uid,
                      name: auth?.email,
                      email: auth?.email
                  }
              })

          })
          .catch((e) => console.log('getting downloadURL of image error => ', e));
    }

    const saveFileToFirebase = (fileRes) => {
        console.log(fileRes);
        firebase
            .storage()
            .ref(fileRes?.name)
            .putFile(fileRes?.uri)
            .then((snapshot) => {
                getFileFromFirebase(fileRes);
                console.log(snapshot);
                //You can check the image is now uploaded in the storage bucket
                console.log(`${fileRes?.name} has been successfully uploaded.`);
            })
            .catch((e) => console.log('uploading image error => ', e));
    }

    const getFileFromFirebase = async (fileRes) => {
        const url = await storage()
            .ref("/" + fileRes?.name)
            .getDownloadURL();
        let file = {
            name: fileRes.name,
            type: fileRes.type,
            downloadUrl: url
        }
        sendFile({
            file: file,
            user: {
                _id: FRB.uid,
                name: auth?.email,
                email: auth?.email
            }
        })
    }

    const sendMessage = (message) =>{
        FRB.send(message,auth?.email,route.params?.email)
    }
    const sendImage = (message) =>{
        FRB.sendImage(message,auth?.email,route.params?.email)
    }
    const sendFile = (message) =>{
        FRB.sendFile(message,auth?.email,route.params?.email)
    }
    const renderBubble = (props) => {
        const { currentMessage } = props;
        let currentMessageDate = moment(currentMessage?.createdAt).format('hh:mm A');
        if (currentMessage.file) {
            return (
                <TouchableOpacity
                    onPress={() => { Linking.openURL(currentMessage.file?.downloadUrl) }}
                    style={{
                        marginVertical: 10,
                        minHeight: 50,
                        borderRadius: 10,
                        justifyContent: 'center',
                        padding:5,
                        width: '40%',
                        backgroundColor:'#0084ff'
                    }}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
                    <Text style={{ fontSize: 14,color:'white',fontWeight:'bold' }}>{currentMessage.file?.name}</Text>
                    <MaterialCommunityIcons name="download-circle-outline" size={25} />
                    </View>
                    <Text style={{ fontSize: 10,color:'white',alignSelf:'flex-end',marginRight:5 }}>{currentMessageDate.toString()}</Text>
                </TouchableOpacity>
            )
        }
        else { return <Bubble {...props} /> }
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <View style={{ flexDirection: "row",padding:10, height: 60, backgroundColor: '#1FC7B2', justifyContent: "space-between" }}>
                <TouchableOpacity  onPress={() => { navigation.navigate("Chat") }} style={{justifyContent: "center" }}   >
                    <Image source={back} style={styles.backIcon}></Image>
                </TouchableOpacity>
                <View style={{justifyContent: "center" }}>
                    <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>{route.params?.name}</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        borderWidth: 1,
                        height: 27,
                        width: 27,
                        marginTop: 5,
                        borderRadius: 100,
                        marginRight:10
                    }}
                    onPress={() => { showImagePicker() }} >
                    <EvilIconsIcons name={"camera"} size={25} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        justifyContent: "center",
                        height: 27,
                        width: 27,
                        marginTop: 5,
                    }}
                    onPress={() => { showFilePicker() }} >
                <MaterialIcons name={"attach-file"} size={25} />
                </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <GiftedChat
                    messages={messages}
                    onSend={(message)=>{sendMessage(message)}}
                    renderBubble={renderBubble}
                    user={{
                        _id:FRB.uid,
                        name:auth?.email,
                        email:auth?.email
                    }}
                />
            </View>
        </SafeAreaView >

    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        marginBottom:40
    },
    backIcon: {
        height: 20,
        width: 20,
        // color:'#1FC7B2'
    },
    back: {
        height: 50,
        width: 50,
        marginLeft: 15,
        justifyContent: 'center'
    }
});

export default Messages;
