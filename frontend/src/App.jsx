import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/HomePage/Home";
import Profile from "./Pages/ProfilePage/Profile";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Navigate } from "react-router-dom";
import Login from "./Pages/LoginPage/LoginPage.jsx";

function App() {
  const mode  = useSelector( (state) => state.mode)
  const theme = useMemo( () => createTheme(themeSettings(mode)), [mode])
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route
              path="/home"
              element={isAuth ? <Home/> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <Profile/> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
