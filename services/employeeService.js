import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//esta es el puerto al que se comunica con el back y la url
const port = 3000;
const baseUrl = `http://10.48.5.67:${port}/api/employee`;

const makeRequest = async (method, url, data = null) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      console.error('No se encontró el token');
      throw new Error('No se encontró el token');
    }

    const config = {
      method,
      url: `${baseUrl}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error en la petición ${method} a ${url}:`, error);
    throw error;
  }
};

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

export const getPermissionsMyGroup = async (id) => {
 return makeRequest('get', `/permissionsByGroup/${id}`);
}

