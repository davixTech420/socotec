import axios from "axios";

//esta es el puerto al que se comunica con el back y la url
const port = 3000;
const baseUrl = `http://localhost:${port}/api/public`;
export const emailRegistro = async (user) => {
  try {
    const response = await axios.post(`${baseUrl}/emailRegistro`, user);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};