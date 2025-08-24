import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyAppBar from "./MyAppBar.tsx";
import MyRegister from "./MyRegister.tsx";
import MyTable from "./MyTable";
import Setting from "./Setting";

function App() {
  return (
    <>
      <Router>
        <MyAppBar />
        <Routes>
          <Route path="/" element={<MyRegister />} />
          <Route path="/MyTable" element={<MyTable />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
