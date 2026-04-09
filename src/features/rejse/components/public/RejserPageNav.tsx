import { NavLink } from "react-router-dom";

const links = [
  { to: "/rejser", label: "Alle rejser" },
  { to: "/rejser/kalender", label: "Kalender" },
  { to: "/rejser/lavpris", label: "Lavpris" },
];

export default function RejserPageNav() {
  return (
    <nav className="rejserPageNav" aria-label="Visninger for rejser">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/rejser"}
          className={({ isActive }) =>
            ["rejserPageNav__link", isActive ? "rejserPageNav__link--active" : ""]
              .filter(Boolean)
              .join(" ")
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
