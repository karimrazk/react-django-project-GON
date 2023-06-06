import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../scenes/global/Topbar";
import SidebarAdmin from "../scenes/global/SidebarAdmin";
import AdminHome from "../scenes/dashboard/AdminHome";
import ProgrammeADM from "../scenes/programme/AdminProgramme";
import FonctionnaireADM from "../scenes/fonctionnaire/AdminFonct";
import Calendar from "../scenes/calendar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from '../theme'
import Page404 from "./Page404";
import { AuthProvider } from "../context/AuthContext";
import Partenaire from "../scenes/partenaire/Partenaire";
import FormProgramme from "../scenes/form/ProgrammeForm";
import FormFonctionnaire from "../scenes/form/FonctionnaireForm";



const AdminDashboard = () => {
  const [theme, colorMode] = useMode();//hook
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <AuthProvider>
            <SidebarAdmin isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="home" element={<AdminHome />} />
                <Route path="fonctionnaire" element={<FonctionnaireADM />} />
                <Route path="programme" element={<ProgrammeADM />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="partenaire" element={<Partenaire />} />
                <Route path="programme/modifierProgramme/:id/:intitule_programme" element={<FormProgramme />} />
                <Route path="fonctionnaire/modifierFonctionnaire/:id" element={<FormFonctionnaire />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </main>
          </AuthProvider>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default AdminDashboard;