import { Routes, Route, Outlet } from "react-router";
import MyRegister from "./MyRegister";
import MyTable from "./MyTable";
import MySetting from "./MySetting";
import NoMatch from "./NoMatch";
import MyHeader from "./MyHeader";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<MyRegister />} />
          <Route path="MyTable" element={<MyTable />} />
          <Route path="MySetting" element={<MySetting />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </>
  );
}

const MainLayout = () => {
  return (
    <>
      <Box bg="gray.200" minH="100vh">
        <MyHeader />
        <Outlet />
      </Box>
    </>
  );
};

export default App;
