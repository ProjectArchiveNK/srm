import { Flex } from "antd";
import CoffeeControls from "./components/coffeeControls/CoffeeControls";
import CoffeeTable from "./components/coffeeTable";
// import CoffeeDashboard from "./components/coffeeDashboard";

const CoffeePage = () => {
  return (
    <Flex vertical gap={10} style={{ padding: "10px" }}>
      <CoffeeControls />
      <CoffeeTable />
      {/* <CoffeeDashboard /> */}
      {/* x */}
    </Flex>
  );
};

export default CoffeePage;
