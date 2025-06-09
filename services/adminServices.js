import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

//esta es el puerto al que se comunica con el back y la url
const port = 3000;
/* const baseUrl = `http://192.168.0.14:${port}/api/admin`; */
const baseUrl = `https://socotecback.onrender.com/api/admin`;



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

export const getDashboard = async () => {
  return makeRequest("get", "/dashboard");
};

//routes for files apique

export const generateApique = async (id) => {
  try {

const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("No se encontró el token");
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
    console.error("Error al descargar el archivo:", error.message || error);
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

export const updateTicket = async (id) => {
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

export const createUser = async (user) => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null
    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }
    const response = await axios.post(`${baseUrl}/users`, user, {
      headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de usar "Bearer" si es un JWT
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.log("Error al crear usuario:", error);
    throw error;
  }
};

export const activateUser = async (id) => {
  return makeRequest("put", `/users/${id}/active`);
}


export const inactivateUser = async (id) => {
  return makeRequest("put", `/users/${id}/inactive`);
}

export const deleteUser = async (id) => {
  return makeRequest("delete", `/users/${id}`);
}


export const updateUser = async (id, user) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.put(`${baseUrl}/users/${id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al actualizar usuario:", error);
    throw error;
  }
};

//end point para enviar el email recien se registra un usuario
export const getUsers = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null

    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }

    const response = await axios.get(`${baseUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de usar "Bearer" si es un JWT
        "Content-Type": "application/json",
      },
    });

    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
};

//end point para la funcionalidades de la tabla inventarios
export const createInventory = async (data) => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null

    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }

    const response = await axios.post(`${baseUrl}/inventory`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.log("Error al enviar inventario:", error);
    throw error;
  }
};

export const updateInventory = async (id, data) => {
  try {
    const token = AsyncStorage.getItem("userToken");

    if (!token) {
      console.error("No se encontró el token");
      return;
    }
    const response = await axios.put(`${baseUrl}/inventory/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al actualizar el inventario:", error);
    throw error;
  }
};

export const getInventory = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null

    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }

    const response = await axios.get(`${baseUrl}/inventory`, {
      headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de usar "Bearer" si es un JWT
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener inventario:", error);
  }
};

export const deleteInventory = async (id) => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null

    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }

    const response = await axios.delete(`${baseUrl}/inventory/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de usar "Bearer" si es un JWT
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.log("Error al eliminar inventario:", error);
    throw error;
  }
};

export const activeInventory = async (id) => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null

    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }

    const response = await axios.put(`${baseUrl}/inventory/${id}/active`, {
      headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de usar "Bearer" si es un JWT
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.error("Error al activar inventario:", error);
  }
};

export const inactiveInventory = async (id) => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null

    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }

    const response = await axios.put(`${baseUrl}/inventory/${id}/inactive`, {
      headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de usar "Bearer" si es un JWT
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.error("Error al desactivar inventario:", error);
  }
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
  try {
    const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null
    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }
    const response = await axios.get(`${baseUrl}/groups`, {
      headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de usar "Bearer" si es un JWT
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener los grupos:", error);
  }
};

export const createGroup = async (group) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }
    const response = await axios.post(`${baseUrl}/groups`, group, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.log("Error al crear el grupo:", error);
    throw error;
  }
};

export const updateGroup = async (id, group) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }
    const response = await axios.put(`${baseUrl}/groups/${id}`, group, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.log("Error al actualizar el grupo:", error);
    throw error;
  }
};

export const deleteGroup = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.delete(`${baseUrl}/groups/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.log("Error al eliminar el grupo:", error);
    throw error;
  }
};

export const activateGroup = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.put(`${baseUrl}/groups/${id}/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.error("Error al activar el grupo:", error);
  }
};

export const inactivateGroup = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.put(`${baseUrl}/groups/${id}/inactive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.log("Error al desactivar el grupo:", error);
    throw error;
  }
};

export const getGroupNotProyect = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null
    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }
    const response = await axios.get(`${baseUrl}/groupNotProyect`, {
      headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de usar "Bearer" si es un JWT
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    return console.error("Error al obtener los grupos sin proyectos", error);
  }
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
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.get(`${baseUrl}/userGroup/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios del grupo:", error);
  }
};

export const createUsersGroup = async (req, res) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.post(`${baseUrl}/userGroup`, req, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el usuario del grupo:", error);
  }
};

export const deleteUsersGroup = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.delete(`${baseUrl}/userGroup/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al eliminar el usuario del grupo:", error);
  }
};

export const getUsersNotGroup = async () => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.get(`${baseUrl}/userNotGroup`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios no en grupo", error);
  }
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

export const createProyect = async (req, res) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.post(`${baseUrl}/proyects`, req, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al crear el proyecto:", error);
    throw error;
  }
};

export const getProyect = async (req, res) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.get(`${baseUrl}/proyects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
  }
};

export const deleteProyect = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.delete(`${baseUrl}/proyects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error al eliminar el proyecto: ", error);
    throw error;
  }
};

export const updateProyect = async (id, data) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.put(`${baseUrl}/proyects/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error al actualizar el proyecto: ", error);
    throw error;
  }
};

export const activeProyect = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.put(`${baseUrl}/proyects/${id}/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al activar el proyecto : ", error);
  }
};

export const inactiveProyect = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.put(`${baseUrl}/proyects/${id}/inactive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al inactivar el proyecto ", error);
  }
};

export const getGroupProyect = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.get(`${baseUrl}/groupProyect/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al obtener el grupo del proyecto", error);
  }
};

export const deleteGroupProyect = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`deleteGroupProyect/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al obtener el grupo del proyecto", error);
  }
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
}
export const deletePermission = async (id) => {
  return makeRequest("delete", `/permissions/${id}`);
}
export const createPermission = async (req) => {
  return makeRequest("post", "/permissions", req);
}

export const updatePermission = async (id, data) => {
  return makeRequest("put", `/permissions/${id}`, data);
};




export const activePermission = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.put(`${baseUrl}/permissions/${id}/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al activar el permiso", error);
  }
};

export const inactivePermission = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    const response = await axios.put(`${baseUrl}/permissions/${id}/inactive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al desactivar el permiso", error);
  }
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
  try {
    const token = await AsyncStorage.getItem("userToken"); // Asegúrate de que el token no sea null
    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }
    const response = await axios.get(`${baseUrl}/portfolio`, {
      headers: {
        Authorization: `Bearer ${token}`, // Asegúrate de usar "Bearer" si es un JWT
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.error("Error al obtener el portafolio:", error);
  }
};

export const createPortfolio = async (data) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
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
    const token = AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }
    const response = await axios.put(`${baseUrl}/portfolio/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.error("Error al actualizar el portafolio:", error);
    throw error;
  }
};

export const deletePortfolio = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }
    const response = await axios.delete(`${baseUrl}/portfolio/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.log("Error al eliminar el portafolio:", error);
    throw error;
  }
};

export const inactivePortfolio = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }
    const response = await axios.put(`${baseUrl}/portfolio/${id}/inactive`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.error("Error al desactivar el portafolio:", error);
  }
};

export const activePortfolio = async (id) => {
  try {
    const token = AsyncStorage.getItem("userToken");
    if (!token) {
      console.error("No se encontró el token");
      return; // O maneja el error como desees
    }
    const response = await axios.put(`${baseUrl}/portfolio/${id}/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    console.error("Error al activar el portafolio:", error);
  }
};
/**a
 * aca termina las funcionalidades para el portafolio
 */
