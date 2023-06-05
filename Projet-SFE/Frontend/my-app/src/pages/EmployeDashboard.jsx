import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../scenes/global/Topbar";
import SidebarEmploye from "../scenes/global/SidebarEmploye";
import EmployeHome from "../scenes/dashboard/EmployeHome";
import ProgrammeEMP from "../scenes/programme/EmployeProgramme";
import ProgramDetails from "../scenes/Details/programmeDetails";
import Calendar from "../scenes/calendar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode }  from '../theme'
import Page404 from "./Page404";
import { AuthProvider } from "../context/AuthContext"; 
import ProjetDetails from "../scenes/Details/projetDetails";
import FormProjet from "../scenes/form/ProjetForm";
import EmployeStatistique from "../scenes/statistique/EmployeStatistique";


const EmployeDashboard=() =>{
  const [theme, colorMode] = useMode();//hook
  const [isSidebar, setIsSidebar] = useState(true);


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <AuthProvider>
          <SidebarEmploye isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
                <Route path="home" element={<EmployeHome />} />
                <Route path="programme" element={<ProgrammeEMP />} />
                <Route path="programme/programmeDetails/:id/:intitule_programme" element={<ProgramDetails />} />
                <Route path="programme/programmeDetails/:id_programme/:intitule_programme/projetDetails/:id_projet/:intitule_projet" element={<ProjetDetails />} />
                <Route path="programme/programmeDetails/:id_programme/:intitule_programme/modifierProjet/:id_projet/:intitule_projet" element={<FormProjet />} />
                <Route path="statistique" element={<EmployeStatistique />} />
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

export default EmployeDashboard;