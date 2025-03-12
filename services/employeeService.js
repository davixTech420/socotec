import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//esta es el puerto al que se comunica con el back y la url
const port = 3000;
const baseUrl = `http://10.48.5.21:${port}/api/employee`;



export const getMyPermissions = async (id) => {
    try {
        const token = await AsyncStorage.getItem    ("userToken");
        const response = await axios.get(`${baseUrl}/myPermissions/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los permisos", error);
        throw error;
    }
}



