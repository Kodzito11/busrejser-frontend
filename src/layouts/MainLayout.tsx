import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function MainLayout() {
  return (
    <div className="shell">
      <Header />

      <main className="content">
        <Outlet />
      </main>

      <footer className="footer">© {new Date().getFullYear()} BusPlanen</footer>
    </div>
  );
}