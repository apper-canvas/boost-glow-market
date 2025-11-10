import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";

function Layout() {
  // App-level state and methods that were previously in App.jsx
  // These can be passed to child components via outlet context if needed
  const contextValue = {
    // Add any app-level state or methods here that need to be shared
    // Example: user state, theme, global settings, etc.
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet context={contextValue} />
      </main>
      <Footer />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Layout;