import "./App.css";
import Articles from "./pages/Articles";
import CreateAccountPage from "./pages/CreateAccountPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <div id="page-body">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
