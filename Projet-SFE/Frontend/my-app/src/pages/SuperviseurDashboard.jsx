import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../scenes/global/Topbar";
import SuperviseurHome from "../scenes/dashboard/SuperviseurHome";
import SidebarSuperviseur from "../scenes/global/SidebarSuperviseur";
import Calendar from "../scenes/calendar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from '../theme'
import Page404 from "./Page404";
import { AuthProvider } from "../context/AuthContext";
import SuperviseurStatistique from "../scenes/statistique/SuperviseurStatistique";



const SuperviseurDashboard = () => {
  const [theme, colorMode] = useMode();//hook
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <AuthProvider>
            <SidebarSuperviseur isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="home" element={<SuperviseurHome />} />
                <Route path="statistiques" element={<SuperviseurStatistique />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </main>
          </AuthProvider>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default SuperviseurDashboard;