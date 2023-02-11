import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './Url'

class Api {
    static async headers() {
        return await {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
    }

    static async getAuthData() {
        const ASData = await AsyncStorage.getItem('@LoginResponseKey');
        const ASData_parse = JSON.parse(ASData);
        return ASData_parse;
    }
    static async saveAuthData(data) {
        await AsyncStorage.setItem('@LoginResponseKey', JSON.stringify(data))
    }
    static async removeAuthData() {
        await AsyncStorage.removeItem('@LoginResponseKey')
    }
    static async authToken() {
        return await JSON.parse(await AsyncStorage.getItem('authToken'));
    }
    static get(route,authToken) {
        return this.xhr1(route, 'GET',authToken);
    }

    static delete1(route,authToken) {
        return this.xhr1(route, 'DELETE',authToken);
    }

    static post1(route,authToken) {
        return this.xhr1(route, 'POST',authToken);
    }

    static put(route,authToken) {
        return this.xhr1(route, 'PUT',authToken);
    }

    static post(route, params,authToken) {
        return this.xhr(route, params, 'POST',authToken);
    }

    static delete(route, params,authToken) {
        return this.xhr(route, params, 'DELETE',authToken);
    }

    static async abort(ab) {
        this.signal = ab;
    }

    static async xhr(route, params, verb,authToken) {
        try {
            const host = BASE_URL;
            const url = `${host}/${route}`;
            let options = Object.assign(
                { method: verb },
                // params ? {body: params} : null,
            );
            options.body = params;
            options.headers = {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: "Bearer " + authToken
                // 'x-sh-auth': token,
            };
            // console.log(url, options);
            let response = await fetch(url, options);
            if (response.ok) {
                //console.log('response',response.text());
                return await response.json();
            } else {
                //console.log('response',response.text());
                let d = await response.text();
                d = JSON.parse(d);
                d.code = response.status;
                //console.log('response',d,response);

                return d;
            }
        } catch (e) {
            return e.toString();
        }
    }

    static async xhr1(route, verb,authToken) {
        try {
            const host = BASE_URL;
            const url = `${host}/${route}`;
            console.log(url);
            let options = Object.assign(
                { method: verb },
                // params ? {body: params} : null,
            );
            // options.body = params;
            options.headers = {
                Accept: 'application/json',
                Authorization: "Bearer " + authToken
                // 'Content-Type': 'application/json',
                // 'x-sh-auth': token,
            };
            // console.log(url, options);
            let response = await fetch(url, options);
            // console.log('response', response);
            if (response.ok) {
                // console.log('response', response);
                return await response.json();
            } else {
                //console.log('response',response.text());
                let d = await response.text();
                d = JSON.parse(d);
                d.code = response.status;
                //console.log('response',d,response);

                return d;
            }
        } catch (e) {
            return e.toString();
        }
    }
}

export default Api;
