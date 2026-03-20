import type { ReactNode } from "react";

type DashboardPanelProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

export default function DashboardPanel({
  title,
  subtitle,
  action,
  children,
}: DashboardPanelProps) {
  return (
    <div className="card dashboardPanel">
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        {action}
      </div>

      {children}
    </div>
  );
}