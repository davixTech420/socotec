import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

//esta es el puerto al que se comunica con el back y la url
const port = 3000;
/* const baseUrl = `http://192.168.106.31:${port}/api/employee`; */
const baseUrl = `https://socotec.alwaysdata.net/api/employee`;

const makeRequest = async (method, url, data = null) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("No se encontró el token");
    }

    const config = {
      method,
      url: `${baseUrl}${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//routes for apiques

export const generateApique = async (id) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("No se encontró el token");
    }

    const apiUrl = `${baseUrl}/generateApique/${id}`;

    if (Platform.OS === "web") {
      // 🖥 Solución para Web
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Apique.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      // 📱 Solución para Móviles (iOS/Android)
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer",
      });

      const fileUri = FileSystem.documentDirectory + "Apique.xlsx";

      // Convertir arraybuffer a base64 sin usar Buffer
      const base64Data = arrayBufferToBase64(response.data);

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Compartir archivo
      await Sharing.shareAsync(fileUri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Descargar Apique",
        UTI: "com.microsoft.excel.xlsx",
      });
    }

    return true;
  } catch (error) {
    throw error;
  }
};

// Función auxiliar para convertir ArrayBuffer a Base64
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

export const getSampleApiqueId = async (id) => {
  return makeRequest("get", `/sampleApique/${id}`);
};

export const getApique = async () => {
  return makeRequest("get", "/apique");
};

export const createApique = async (data) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.post(`${baseUrl}/apique`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateApique = async (id, data) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.put(`${baseUrl}/apique/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteApique = async (id) => {
  return makeRequest("delete", `/apique/${id}`);
};

//routes for users active
export const getUsers = async () => {
  return makeRequest("get", "/users");
};

export const createUser = async (data) => {
  return makeRequest("post", "/users", data);
};

export const getUserById = async (id) => {
  return makeRequest("get", `/userById/${id}`);
};

export const updateUser = async (id, data) => {
  return makeRequest("put", `/users/${id}`, data);
};
export const deleteUser = async (id) => {
  return makeRequest("delete", `/users/${id}`);
};

export const activateUser = async (id) => {
  return makeRequest("put", `/users/${id}/active`);
};

export const inactivateUser = async (id) => {
  return makeRequest("put", `/users/${id}/inactive`);
};

export const getActiveUsers = async () => {
  return makeRequest("get", "/activeUsers");
};
export const getCampoUsers = async () => {
  return makeRequest("get", "/usersCampo");
};

//routes for inventory

export const getActiveInventory = async () => {
  return makeRequest("get", "/inventory");
};
export const getInventory = async () => {
  return makeRequest("get", "/inventoryAll");
};

export const createInventory = async (data) => {
  return makeRequest("post", "/inventory", data);
};

export const updateInventory = async (id, data) => {
  return makeRequest("put", `/inventory/${id}`, data);
};

export const deleteInventory = async (id) => {
  return makeRequest("delete", `/inventory/${id}`);
};

export const inactiveInventory = async (id) => {
  return makeRequest("put", `/inventory/${id}/inactive`);
};

export const activeInventory = async (id) => {
  return makeRequest("put", `/inventory/${id}/active`);
};

//routes ppe
export const getAssignment = async () => {
  return makeRequest("get", "/assignment");
};
export const getMyAssignment = async (id) => {
  return makeRequest("get", `/myAssignment/${id}`);
};
export const createAssignment = async (data) => {
  return makeRequest("post", "/assignment", data);
};

export const updateAssignment = async (id, data) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.put(`${baseUrl}/assignment/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* export const updateAssignment = async (id,data) => {
  return makeRequest("put",`/assignment/${id}`,data);
} */
export const deleteAssignment = async (id) => {
  return makeRequest("delete", `/assignment/${id}`);
};

//hiring
export const getHiring = async () => {
  return makeRequest("get", "/hiring");
};
export const createHiring = async (data) => {
  return makeRequest("post", "/hiring", data);
};
export const updateHiring = async (id, data) => {
  return makeRequest("put", `/hiring/${id}`, data);
};
export const deleteHiring = async (id) => {
  return makeRequest("delete", `/hiring/${id}`);
};

//tickets de it
export const getMyTickets = async (id) => {
  return makeRequest("get", `/myTickets/${id}`);
};

export const createTicket = async (data) => {
  return makeRequest("post", "/ticket", data);
};

export const updateTicket = async (id, data) => {
  return makeRequest("put", `/ticket/${id}`, data);
};
export const deleteTicket = async (id) => {
  return makeRequest("delete", `/ticket/${id}`);
};

export const getMyPermissions = async (id) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.get(`${baseUrl}/myPermissions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPermission = (data) => {
  return makeRequest("post", "/permissions", data);
};

export const deletePermission = async (id) => {
  return makeRequest("delete", `/permissions/${id}`);
};

export const updatePermission = async (id, data) => {
  return makeRequest("put", `/permissions/${id}`, data);
};

export const getPermissionsMyGroup = async (id) => {
  return makeRequest("get", `/permissionsByGroup/${id}`);
};

export const getPermissions = async () => {
  return makeRequest("get", "/permission");
};

/**
 * funcionalidades para las tareas
 */

export const createTask = async (data) => {
  return makeRequest("post", "/task", data);
};

export const getTaskMyGroup = async (id) => {
  return makeRequest("get", `/taskMyGroup/${id}`);
};

/**
 *
 * endpoints para los movimientos
 */

export const createMotion = async (data) => {
  return makeRequest("post", "/motions", data);
};

export const updateMotion = async (id, data) => {
  return makeRequest("put", `/motions/${id}`, data);
};

export const deleteMotion = async (id) => {
  return makeRequest("delete", `/motions/${id}`);
};

export const getMotions = async () => {
  return makeRequest("get", "/motions");
};

export const inactiveMotion = async (id) => {
  return makeRequest("put", `/motions/${id}/inactive`);
};

export const activeMotion = async (id) => {
  return makeRequest("put", `/motions/${id}/active`);
};

/**
 * aca temrina endpoint de los movimientos
 */

/**
 *
 * endpoint de cuentas
 */

export const getAccounts = async () => {
  return makeRequest("get", "/accounts");
};

export const createAccount = async (account) => {
  return makeRequest("post", "/accounts", account);
};

export const updateAccount = async (id, account) => {
  return makeRequest("put", `/accounts/${id}`, account);
};

export const deleteAccount = async (id) => {
  return makeRequest("delete", `/accounts/${id}`);
};

export const activeAccount = async (id) => {
  return makeRequest("put", `/accounts/${id}/active`);
};

export const inactiveAccount = async (id) => {
  return makeRequest("put", `/accounts/${id}/inactive`);
};

/**
 * aca termina endpoints de cuentas
 */
