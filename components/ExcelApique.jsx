import { useState, useEffect } from "react";
import { IconButton } from "react-native-paper";
import { generateApique as adminGenerateApique } from "@/services/adminServices";
import { generateApique as employeeGenerateApique } from "@/services/employeeService";
import { useAuth } from "@/context/userContext";

const ExcelApique = ({ id }) => {
  const [userRole, setUserRole] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await user(); // Obtiene los datos del usuario
        setUserRole(userData?.role); // Guarda el rol del usuario
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [user]);

  const handleGenerateApique = async () => {
    try {
      if (userRole === "admin") {
        await adminGenerateApique(id); // Usa la función de adminServices
      } else if (userRole === "employee") {
        await employeeGenerateApique(id); // Usa la función de employeeService
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
    />
  );
};

export default ExcelApique;