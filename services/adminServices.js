import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
//esta es el puerto al que se comunica con el back y la url
const port = 3000;
/* const baseUrl = `http://192.168.106.31:${port}/api/admin`; */
const baseUrl = `https://socotec.alwaysdata.net/api/admin`;

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

export const getDashboard = async () => {
  return makeRequest("get", "/dashboard");
};

//routes for files apique

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

//routes the ppe protect
export const getAssignment = async () => {
  return makeRequest("get", "/assignment");
};
export const createAssignment = async (data) => {
  return makeRequest("post", "/assignment", data);
};

export const updateAssignment = async (id, data) => {
  return makeRequest("put", `/assignment/${id}`, data);
};
export const deleteAssignment = async (id) => {
  return makeRequest("delete", `/assignment/${id}`);
};

// rutas de candidatos

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
/**
 *
 * end point tickets de it
 */

export const getTickets = async () => {
  return makeRequest("get", "/ticket");
};
export const createTicket = async (data) => {
  return makeRequest("post", "/ticket", data);
};

export const updateTicket = async (id,data) => {
  return makeRequest("put", `/ticket/${id}`, data);
};


export const deleteTicket = async (id) => {
  return makeRequest("delete", `/ticket/${id}`);
};

/**
 *
 */

/**
 * endpoints para las tareas
 */
export const getTask = async () => {
  return makeRequest("get", "/task");
};

export const createTask = async (data) => {
  return makeRequest("post", "/task", data);
};

export const updateTask = async (id, data) => {
  return makeRequest("put", `/task/${id}`, data);
};

export const deleteTask = async (id) => {
  return makeRequest("delete", `/task/${id}`);
};

export const activeTask = async (id) => {
  return makeRequest("put", `/task/${id}/active`);
};

export const inactiveTask = async (id) => {
  return makeRequest("put", `/task/${id}/inactive`);
};

/**
 * end endpoint para las tareas
 */

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

/**
 *
 * endpoint del empleado
 */

export const getEmployees = async () => {
  return makeRequest("get", "/employee");
};

export const createEmployee = async (employee) => {
  return makeRequest("post", "/employee", employee);
};

/**
 *
 *
 *
 *
 *
 */

//crear usuario api

export const getUsersCampoAD = async () => {
  return makeRequest("get", "/usersCampo");
};

export const createUser = async (data) => {
  return makeRequest("post", "/users", data);
};

export const getUserById = async (id) => {
  return makeRequest("get", `/userById/${id}`);
};

export const activateUser = async (id) => {
  return makeRequest("put", `/users/${id}/active`);
};

export const inactivateUser = async (id) => {
  return makeRequest("put", `/users/${id}/inactive`);
};

export const deleteUser = async (id) => {
  return makeRequest("delete", `/users/${id}`);
};

export const updateUser = async (id, data) => {
  return makeRequest("put", `/users/${id}`, data);
};

export const getUsers = async () => {
  return makeRequest("get", "/users");
};

//end point para la funcionalidades de la tabla inventarios

export const createInventory = async (data) => {
  return makeRequest("post", "/inventory", data);
};

export const updateInventory = async (id, data) => {
  return makeRequest("put", `/inventory/${id}`, data);
};

export const getActiveInventory = async () => {
  return makeRequest("get", "/inventoryAct");
};

export const getInventory = async () => {
  return makeRequest("get", "/inventory");
};

export const deleteInventory = async (id) => {
  return makeRequest("delete", `/inventory/${id}`);
};

export const activeInventory = async (id) => {
  return makeRequest("put", `${baseUrl}/inventory/${id}/active`);
};

export const inactiveInventory = async (id) => {
  return makeRequest("put", `/inventory/${id}/inactive`);
};

/**
 *
 *
 *
 *
 *
 * estas son las funciones para los grupos de *trabajo
 *
 *
 */

export const getGroups = async () => {
  return makeRequest("get", "/groups");
};

export const createGroup = async (data) => {
  return makeRequest("post", "/groups", data);
};

export const updateGroup = async (id, data) => {
  return makeRequest("put", `/groups/${id}`, data);
};

export const deleteGroup = async (id) => {
  return makeRequest("delete", `/groups/${id}`);
};

export const activateGroup = async (id) => {
  return makeRequest("put", `/groups/${id}/active`);
};

export const inactivateGroup = async (id) => {
  return makeRequest("put", `/groups/${id}/inactive`);
};
export const getGroupNotProyect = async () => {
  return makeRequest("get", "/groupNotProyect");
};

/**aca termina las funciones de los grupos de trabajo */

/**
 *
 *
 * estas son las funcionalidades para los usuarios del grupo
 *
 *
 */

export const getUsersGroup = async (id) => {
  return makeRequest("get", `/userGroup/${id}`);
};

export const createUsersGroup = async (data) => {
  return makeRequest("post", "/userGroup", data);
};

export const deleteUsersGroup = async (id) => {
  return makeRequest("delete", `/userGroup/${id}`);
};

export const getUsersNotGroup = async () => {
  return makeRequest("get", "/userNotGroup");
};

/**
 *
 * aca termina las funcionalidades para los usuarios del grupo
 */

/**
 *
 *
 *
 * funcionalidades  para proyectos
 *
 *
 */

export const createProyect = async (data) => {
  return makeRequest("post", "/proyects", data);
};

export const getProyect = async () => {
  return makeRequest("get", "/proyects");
};

export const deleteProyect = async (id) => {
  return makeRequest("delete", `/proyects/${id}`);
};

export const updateProyect = async (id, data) => {
  return makeRequest("put", `/proyects/${id}`, data);
};

export const activeProyect = async (id) => {
  return makeRequest("put", `/proyects/${id}/active`);
};

export const inactiveProyect = async (id) => {
  return makeRequest("put", `/proyects/${id}/inactive`);
};

export const getGroupProyect = async (id) => {
  return makeRequest("get", `/groupProyect/${id}`);
};

export const deleteGroupProyect = async (id) => {
  return makeRequest("put", `/deleteGroupProyect/${id}`);
};

/**
 *
 *
 *
 */

/**
 *
 *
 *
 * funcionalidades para los permisos y el calendario
 *
 *
 */
export const getPermissions = async () => {
  return makeRequest("get", "/permissions");
};
export const deletePermission = async (id) => {
  return makeRequest("delete", `/permissions/${id}`);
};
export const createPermission = async (req) => {
  return makeRequest("post", "/permissions", req);
};

export const updatePermission = async (id, data) => {
  return makeRequest("put", `/permissions/${id}`, data);
};

export const activePermission = async (id) => {
  return makeRequest("put", `/permissions/${id}/active`);
};

export const inactivePermission = async (id) => {
  return makeRequest("put", `/permissions/${id}/inactive`);
};

/**
 *
 * aca termina la funcionalidad para los permisos y calendario
 *
 */

/*
endpoint  para el portafolio
*/

export const getPortfolio = async () => {
  return makeRequest("get", "/portfolio");
};

export const createPortfolio = async (data) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("No se encontró el token");
    }
    const response = await axios.post(`${baseUrl}/portfolio`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    throw error;
  }
};

export const updatePortfolio = async (id, data) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("No se encontró el token");
    }
    const response = await axios.put(`${baseUrl}/portfolio/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    throw error;
  }
};

export const deletePortfolio = async (id) => {
  return makeRequest("delete", `/portfolio/${id}`);
};

export const inactivePortfolio = async (id) => {
  return makeRequest("put", `/portfolio/${id}/inactive`);
};

export const activePortfolio = async (id) => {
  return makeRequest("put", `/portfolio/${id}/active`);
};

/**a
 * aca termina las funcionalidades para el portafolio
 */
