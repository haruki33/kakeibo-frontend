import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyRegister from "./MyRegister.tsx";
import MyTable from "./MyTable";
import MySetting from "./MySetting";
import MyHeader from "./MyHeader.tsx";
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <>
      <Box bg="gray.200" minH="110vh">
        <Router>
          <MyHeader />
          <Routes>
            <Route path="/" element={<MyRegister />} />
            <Route path="/MyTable" element={<MyTable />} />
            <Route path="/MySetting" element={<MySetting />} />
          </Routes>
        </Router>
      </Box>
    </>
  );
}

export default App;
