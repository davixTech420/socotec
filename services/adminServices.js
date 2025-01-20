import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

//esta es el puerto al que se comunica con el back y la url
const port = 3000;
const baseUrl = `http://10.48.5.156:${port}/api/admin`;
 
//end point para enviar el email recien se registra un usuario
export const getUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null
  
      if (!token) {
        console.error('No se encontró el token');
        return; // O maneja el error como desees
      }
  
      const response = await axios.get(`${baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`, // Asegúrate de usar "Bearer" si es un JWT
          'Content-Type': 'application/json',
        },
      });
  
      return response.data; // Retorna los datos de la respuesta
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };


//end point para la funcionalidades de la tabla inventarios
  export const createInventory = async (data) => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null
  
      if (!token) {
        console.error('No se encontró el token');
        return; // O maneja el error como desees
      }
  
      const response = await axios.post(`${baseUrl}/inventory`,data,{
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });
      return response.data; // Retorna los datos de la respuesta
    } catch (error) {
      console.error('Error al enviar inventario:', error);
    }
  };
  export const getInventory = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null
  
      if (!token) {
        console.error('No se encontró el token');
        return; // O maneja el error como desees
      }
  
      const response = await axios.get(`${baseUrl}/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`, // Asegúrate de usar "Bearer" si es un JWT
          'Content-Type': 'application/json',
        },
      });
      return response.data; // Retorna los datos de la respuesta
    } catch (error) {
      console.error('Error al obtener inventario:', error);
    }
  }
