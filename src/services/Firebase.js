import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
var _ = require('lodash');

class FRB {
    constructor() {
        this.init();
        this.checkAuth();
    }

    init = async () => {
        if (!firebase.apps.length) {
           await firebase.initializeApp({
                apiKey: "AIzaSyAdJjyo4qJyPDtneXd_fVx0V7LS2GzcBxc",
                authDomain: "apex-eacf6.firebaseapp.com",
                databaseURL: "https://apex-eacf6-default-rtdb.firebaseio.com",
                projectId: "apex-eacf6",
                storageBucket: "apex-eacf6.appspot.com",
                messagingSenderId: "450502489436",
                appId: "1:450502489436:web:cf51e4633a95c04b5cbd99",
                measurementId: "G-CCHV31C4KS"
            });
        }
    }

    checkAuth = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
        })
    }

    send = (messages,senderEmail,receiverEmail) => {
       
       let key = this.getDBStorageKey(senderEmail,receiverEmail);
        messages.forEach(item => {
            const message = {
                text: item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: item.user
            }
            this.db.child("/"+key).push(message);
            // this.db.push(message);
        });
    }
    sendImage = (messages, senderEmail, receiverEmail) => {

        let key = this.getDBStorageKey(senderEmail, receiverEmail);
        const message = {
            text:messages?.text,
            image:messages.image,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: messages.user
        }
        this.db.child("/" + key).push(message);
    }

    sendFile = (messages, senderEmail, receiverEmail) => {
        let key = this.getDBStorageKey(senderEmail, receiverEmail);
        const message = {
            text:messages?.text,
            file:messages.file,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: messages.user
        }
        this.db.child("/" + key).push(message);
    }

    parse = message => {
        const { user, text, timestamp,image,file } = message.data;
        const _id = message.key;
        // const { key: _id } = message;
        const createdAt = new Date(timestamp);

        return {
            _id,
            createdAt,
            text,
            image,
            file,
            user
        }
    }

    get = (callback,senderEmail,receiverEmail) => {
        let key = this.getDBStorageKey(senderEmail,receiverEmail);
        this.db.child("/"+key).on("value", snapshot => 
        {
            let data = snapshot.val() ? snapshot.val() : {};
            let response = [];
            snapshot._snapshot.childKeys?.forEach(key => {
                let _res = this.parse({key:key,data:data[key]})
                response.push(_res);
            });
            callback(response.reverse());
        }
        );
    }

    off() {
        this.db.off();
    }

    get db() {
        return firebase.database().ref("messages");
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    getDBStorageKey(sender, receiver) {
        let alphabet = "abcdefghijklmnopqrstuvwxyz";
        let senderFirstCharater = sender[0];
        let receiverFirstCharater = receiver[0];

        let senderIndex = alphabet.indexOf(senderFirstCharater);
        let receiverIndex = alphabet.indexOf(receiverFirstCharater);

        sender=sender.split("@")[0];
        receiver=receiver.split("@")[0];
        let key =  receiverIndex > senderIndex ? sender + "_" + receiver : receiver + "_" + sender;
        return key;
    }

}

export default new FRB();