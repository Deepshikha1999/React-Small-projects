import axios, { HttpStatusCode } from 'axios';
import dotenv from "dotenv";
dotenv.config();
const rapidAPIKey = process.env.XRAPIDAPIKEY;
const rapidAPIHost = process.env.XRAPIDAPIHOST;
const DEFAULT_ID = 730;


const getPages = async () => {
    try {
        let randomPage = Math.floor(Math.random() * 10);
        let url = "https://games-details.p.rapidapi.com/page/" + randomPage.toString();
        console.log(url)
        let response = await requestPromise(url);
        return response;
    }
    catch (err) {
        return {
            error: JSON.stringify(err)
        }
    }
}

export const getGameById = async () => {
    try {
        let randomPageInfo = await getPages();
        if (randomPageInfo.status !== HttpStatusCode.Ok) throw "Page not found";
        if (!randomPageInfo?.data?.pages) return "Data not found";
        const data = randomPageInfo.data.pages;
        if (!data || data.length == 0) return "Data is empty";

        return data;
    }
    catch (err) {
        return {
            error: JSON.stringify(err)
        }
    }

}

export const shareDetails = async (id) => {
    try {
        if (!id)
            id = DEFAULT_ID;
        const url = `https://games-details.p.rapidapi.com/gameinfo/single_game/${id}`;
        console.log(url)
        let response = await requestPromise(url);

        return response;
    }
    catch (err) {
        return {
            error: JSON.stringify(err)
        }
    }
}


const requestPromise = async (url) => {
    try {
        let headers = {
            'x-rapidapi-key': rapidAPIKey,
            'x-rapidapi-host': rapidAPIHost
        }
        const options = {
            method: 'GET',
            url: url,
            headers
        };
        const response = await axios.request(options);
        if (!response?.data || !response?.data.status == HttpStatusCode.Ok) {
            throw "data not found";
        }
        return response.data;
    }
    catch (err) {
        throw err;
    }
}


export const getRandomWordFromAPI = async () => {
    try {
        let headers = {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        };
        const options = {
            method: "GET",
            url: " https://random-word-api.herokuapp.com/word?length=5&diff=1",
            headers
        }
        const response = await axios.request(options);
        if (!response?.data || !response?.data.status == HttpStatusCode.Ok) {
            throw "data not found";
        }
        return response.data[0];
    }
    catch (err) {
        throw err;
    }
}