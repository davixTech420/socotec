import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

//esta es el puerto al que se comunica con el back y la url
const port = 3000;
const baseUrl = `http://10.48.5.114:${port}/api/public`;
//end point para enviar el email recien se registra un usuario
export const emailRegistro = async (user) => {
  try {
    const response = await axios.post(`${baseUrl}/emailRegistro`, user);
    return response;
  } catch (error) {
    console.log(error);
  }
};

//end point para logearse y crear el token de inicio
export const login = async (user) => {
  try {
    const response = await axios.post(`${baseUrl}/login`, user);
    if (response.data && response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      return  router.navigate("/(admin)/Dashboard") /* { success: true, token: response.data.token } */;
    } else {
      return { success: false, message: 'No se recibió token' };
    }
  } catch (error) {
    return { success: false, message: error.message || 'Error desconocido' };
  }
};



//end point para enviar el email de recuperacion
export const forgotPassword = async (user) => {
  try {
    await axios.post(`${baseUrl}/emailPassword`, user).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
};


export const changePassword = async (user) => {
  try {
    await axios.post(`${baseUrl}/forgotPassword`, user).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
};