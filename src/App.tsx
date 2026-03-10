import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import BusCrud from "./pages/BusCrud";
import Rejser from "./pages/Rejser";
import logo from "./assets/busplanen-high-resolution-logo-transparent.png";

export default function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <img src={logo} alt="BusPlanen logo" className="logo" />
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
            Forside
          </NavLink>
          <NavLink to="/om" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
            Om os
          </NavLink>
          <NavLink to="/busser" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
            Busser
          </NavLink>
          <NavLink to="/rejser" className={({ isActive }) => (isActive ? "navLink active" : "navLink")}>
            Rejser
          </NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/om" element={<About />} />
          <Route path="/busser" element={<BusCrud />} />
          <Route path="/rejser" element={<Rejser />} />
        </Routes>
      </main>

      <footer className="footer">© {new Date().getFullYear()} BusPlanen</footer>
    </div>
  );
}