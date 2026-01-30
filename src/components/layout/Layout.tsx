import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  flag?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  flag = false,
}) => {
  return (
    <div className="layout">
      {showHeader && <Header flag={flag} />}
      <main className="layout-main">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};
