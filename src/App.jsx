import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import Details from "./pages/Details";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/:id" element={<Details />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;