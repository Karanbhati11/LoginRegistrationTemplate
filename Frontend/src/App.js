import "./App.css";
import DashboardPage from "./pages/Dashboard/dashboard";
import LoginRegistrationPage from "./pages/Login/login";
import { Routes, Route } from "react-router";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginRegistrationPage />} />
        <Route path="/login" element={<LoginRegistrationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
