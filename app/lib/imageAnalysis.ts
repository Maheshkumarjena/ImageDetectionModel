// this example uses axios
import axios from 'axios';
import dotenv from 'dotenv';
import { Url } from 'url';
dotenv.config();


const APIKEY = process.env.IMAGE_ANALYSIS_API_KEY;
const APISECRET = process.env.IMAGE_ANALYSIS_API_SECRET;

export const imageAnalysis = async (imageUrl: string): Promise<string | undefined> => {
    try {
        const response = await axios.get('https://api.sightengine.com/1.0/check.json', {
            params: {
                url: imageUrl,
                models: 'genai',
                api_user: 565932214,
                api_secret: 'QFqEsnnDuWfGgKEWWciy2jQvLqJFVcxi',
            },
        });
        return response.data.type;
    } catch (error: any) {
        console.error("Image analysis error:", error.response?.data || error.message);
        return undefined;
    }
};
