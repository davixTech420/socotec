import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

//esta es el puerto al que se comunica con el back y la url
const port = 3000;
/* const baseUrl = `http://192.168.245.230:${port}/api/employee`; */
const baseUrl = `https://socotecback.onrender.com:${port}/api/employee`;

const makeRequest = async (method, url, data = null) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("No se encontró el token");
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
    console.error(`Error en la petición ${method} a ${url}:`, error);
    throw error;
  }
};

//routes for apiques

export const generateApique = async (id) => {
  try {
    const apiUrl = `${baseUrl}/generateApique/${id}`;

    if (Platform.OS === "web") {
      // 🖥 Solución para Web
      const response = await axios.get(apiUrl, {
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
    console.error("Error al descargar el archivo:", error.message || error);
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
  return makeRequest("get",`/sampleApique/${id}`);
}

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
  return makeRequest("get","/users");
}

export const createUser = async (data) => {
  return makeRequest("post","/users",data);
}

export const updateUser = async (id,data) => {
  return makeRequest("put",`/users/${id}`,data);
}
export const deleteUser = async(id) => {
  return makeRequest("delete",`/users/${id}`);
}

export const activateUser = async(id) => {
  return makeRequest("put",`/users/${id}/active`);
}

export const inactivateUser = async(id) => {
  return makeRequest("put",`/users/${id}/inactive`);
}



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
    console.error("Error al obtener los permisos", error);
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
    console.error("Error al obtener los permisos", error);
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
