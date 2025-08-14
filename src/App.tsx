import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyAppBar from "./MyAppBar.tsx";
import MyRegister from "./Register.tsx";
import MyTable from "./MyTable";

function App() {
  return (
    <>
      <Router>
        <MyAppBar />
        <Routes>
          <Route path="/" element={<MyRegister />} />
          <Route path="/MyTable" element={<MyTable />} />
          {/* <Route path="/confirm" element={<ConfirmPage />} />
          <Route path="/settings" element={<SettingsPage />} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
