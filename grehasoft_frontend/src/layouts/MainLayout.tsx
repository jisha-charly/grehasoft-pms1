import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';

const MainLayout: React.FC = () => {
  // Sidebar toggle state for mobile responsiveness
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="main-layout d-flex vh-100 overflow-hidden bg-light">
      {/* Sidebar - Fixed width, scrolls internally */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Container - Flex grow to fill remaining space */}
      <div className="d-flex flex-column flex-grow-1 min-w-0">
        
        {/* Topbar - Fixed at top */}
        <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Scrollable Content Area */}
        <main className="flex-grow-1 overflow-auto p-3 p-md-4 custom-scrollbar">
          <div className="container-fluid p-0 animate-fade-in">
            {/* Dynamic Page content injected here */}
            <Outlet />
          </div>
          
          <Footer />
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {!isSidebarOpen && (
        <div 
          className="d-md-none position-fixed vh-100 vw-100 bg-dark opacity-50 z-index-dropdown"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default MainLayout;