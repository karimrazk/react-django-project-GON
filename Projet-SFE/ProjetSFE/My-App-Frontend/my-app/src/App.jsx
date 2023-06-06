import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import PrivateRoutes from "./utils/PrivateRoutes";
import Page404 from "./pages/Page404";
import Login from "../src/pages/Login";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeDashboard from "./pages/EmployeDashboard";  
import SuperviseurDashboard from "./pages/SuperviseurDashboard";
import { SnackbarProvider } from 'notistack';

function App() {
  const [theme, colorMode] = useMode();//hook

  return (
    <ColorModeContext.Provider value={colorMode}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <CssBaseline />
        <div className="app">
          <AuthProvider>
            <main className="content">
              <Routes>
                <Route path="/" element={<Login />} />
                
                <Route element={<PrivateRoutes allowedRoles={["EMPLOYE"]} />}>
                  <Route path="/EmployeDashboard/*" element={<EmployeDashboard />} />
                </Route>

                <Route element={<PrivateRoutes allowedRoles={["ADMIN"]} />}>
                  <Route path="/AdminDashboard/*" element={<AdminDashboard />} />
                </Route>

                <Route element={<PrivateRoutes allowedRoles={["SUPERVISEUR"]} />}>
                  <Route path="/SuperviseurDashboard/*" element={<SuperviseurDashboard />} />
                </Route>
                <Route path="*" element={<Page404 />} />
              </Routes>
            </main>
          </AuthProvider>
        </div>
        </SnackbarProvider>
    </ColorModeContext.Provider>
  );
}

export default App;