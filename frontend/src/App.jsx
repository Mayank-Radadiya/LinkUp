import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/HomePage/Home";
import Register from "./Pages/LoginPage/Register";
import Profile from "./Pages/ProfilePage/Profile";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Navbar from "./Pages/Navbar/Navbar.jsx";
import LoginPage from "./Pages/LoginPage/LoginPage.jsx";


function App() {
  const mode  = useSelector( (state) => state.mode)
  const theme = useMemo( () => createTheme(themeSettings(mode)), [mode])
  
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:userId" element={<Profile />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
