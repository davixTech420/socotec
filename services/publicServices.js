import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useAuth } from "@/context/userContext";

//esta es el puerto al que se comunica con el back y la url
const port = 3000;
const baseUrl = `http://10.48.4.195:${port}/api/public`;
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
export const useLogin = () => {
  const { login } = useAuth();
  const loginUser = async (user) => {
    try {
      const response = await axios.post(`${baseUrl}/login`, user);
      if (response.data && response.data.token) {
        await login(response?.data.token);
        router.replace("/(admin)/Dashboard");
        return { success: true };
      } else {
        return { success: false, message: 'No se recibió token' };
      }
    } catch (error) {
      return { success: false, message: error.message || 'Error desconocido' };
    }
  };

  return loginUser;
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