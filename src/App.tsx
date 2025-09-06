import { Routes, Route } from "react-router";
import MyRegister from "./MyRegister";
import MyTable from "./MyTable";
import MySetting from "./MySetting";
import NoMatch from "./NoMatch";
import MainLayout from "./MainLayout";

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

export default App;
