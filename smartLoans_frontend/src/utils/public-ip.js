import axios from 'axios'
let ip=null;
export async function getPublicIp() {
    if (ip) {
        //console. log('Using cached public IP:', ip);
        return ip;
    }
    try {
        const response = await axios.get('/ip' );
        ip = response.data.ip;
        console.log('Public IP:', ip);
        return ip;
    } catch (error) {
        console.error('Error fetching public IP:', error.message);
        ip=null;
    }

}