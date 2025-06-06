import { IconButton } from "react-native-paper";
import { generateApique } from "@/services/employeeService";

const ExcelApique = ({ id }) => {
  return <IconButton icon="file-excel" onPress={ async () => await generateApique(id) } iconColor="green" />;
};

export default ExcelApique;