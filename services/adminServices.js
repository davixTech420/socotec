import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

//esta es el puerto al que se comunica con el back y la url
const port = 3000;
const baseUrl = `http://10.48.5.114:${port}/api/admin`;
 
//end point para enviar el email recien se registra un usuario
export const getUsers = async () => {
  try {
    return response = await axios.get(`${baseUrl}/users`,
        {
          headers: {
            Authorization: await AsyncStorage.getItem("userToken"),
            'Content-Type': 'application/json'
          }
        });
  } catch (error) {
    console.log(error);
  }
};

