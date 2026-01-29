import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <div className="layout">
      {showHeader && <Header />}
      <main className="layout-main">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};
