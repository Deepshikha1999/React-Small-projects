const client_id = import.meta.env.VITE_CLIENT_ID;
const client_secret = import.meta.env.VITE_CLIENT_SECRET

const getToken = async () => {
    try {
        const auth_string = client_id + ":" + client_secret
        const auth_base64 = btoa(auth_string);
        const url = "https://accounts.spotify.com/api/token"
        const headers = {
            "Authorization": "Basic " + auth_base64,
            "Content-Type": "application/x-www-form-urlencoded"
        }

        const data = { "grant_type": "client_credentials" }
        let options = {};
        options.headers = headers
        options.body = new URLSearchParams(data);
        options.method = "POST"
        const response = await fetch(url, options)
        if (!response.ok) {
            throw new Error(`Http error! status: ${response.status}`)
        }
        const result = await response.json();
        return { "Authorization": "Bearer " + result["access_token"] }
    }

    catch (error) {
        console.error("Error fetching token:", error.message);
        throw error
    }

}


const search_For_Artist = async () => {
    try {
        const url = "https://api.spotify.com/v1/search"
        const headers = await getToken()
        if(!headers){
            throw new Error ("Token not found")
        }
        const artistName = "Arijit+Singh"
        const query = `q=${artistName}&type=artist&limit=1`
        const queryUrl = url + "?" + query
        let options = {}
        options.headers = headers
        options.method = "GET"
        options.json = true
        console.log(queryUrl)
        let response = await fetch(queryUrl, options)

        if (!response.ok) {
            throw new Error(`Http error in searchForArtist! status: ${response.status}`)
        }
        let result = await response.json();
        console.log(result)
    } catch (error) {
        console.error("Error fetching token:", error.message);
    }
}

export { search_For_Artist,getToken };