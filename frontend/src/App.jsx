import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserProvider } from "./context/user.context";
import Project from "./pages/Project";
function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/project" element={<Project />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
