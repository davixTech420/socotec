import { useState, useEffect } from "react";
import { IconButton } from "react-native-paper";
import { generateEnvironmental as adminGenerateEnvironmental } from "@/services/adminServices";
import { generateEnvironmental as employeeGenerateEnvironmental } from "@/services/employeeService";
import { useAuth } from "@/context/userContext";

const ExcelEnvironmental = ({ id, size = 20, style }) => {
  const [userRole, setUserRole] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await user(); // Obtiene los datos del usuario
        setUserRole(userData?.role); // Guarda el rol del usuario
      } catch (error) {
        throw error;
      }
    };
    fetchUserData();
  }, [user]);

  const handleGenerateApique = async () => {
    try {
      if (userRole === "admin") {
        await adminGenerateEnvironmental(id); // Usa la función de adminServices
      } else if (userRole === "employee") {
        await employeeGenerateEnvironmental(id); // Usa la función de employeeService
      } else {
        console.warn("Rol no válido o no definido");
      }
    } catch (error) {
      throw new Error("Error al generar el archivo Excel");
    }
  };

  return (
    <IconButton
      icon="file-excel"
      onPress={handleGenerateApique}
      iconColor="green"
      size={size}
      style={[{ margin: 0 }, style]}
    />
  );
};

export default ExcelEnvironmental;
