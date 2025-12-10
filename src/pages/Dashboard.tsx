import { useState } from "react";
// import Sidebar from "../components/Project/Sidebar";
import DashboardContent from "../components/Dashboard/DashboardContent";
import { useAuth } from "../hooks/useAuth";
import { LogOut, Menu } from "lucide-react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import SidebarDesktop from "../components/Project/Sidebar";
import SidebarMobile from "../components/Project/SidebarMobile";

export default function DashboardPage() {
  const { logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-40 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 mt-1 mb-1 cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold">TaskFlow</h3>
              <p className="text-xs text-gray-500">Mini Project Manager</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      <div className="max-w-[1200px] pt-24 md:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6  px-4 md:px-0">
          <div className="hidden md:block ">
            <SidebarDesktop />
          </div>

          <div className="md:hidden"></div>

          <main className="col-span-1 md:pt-3 md:col-span-2">
            <DashboardContent />
          </main>
        </div>
      </div>

      <button
        onClick={logout}
        className="hidden md:flex fixed bottom-6 right-6 items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors z-50"
      >
        <LogOut size={18} />
        Logout
      </button>

      {!isDesktop && (
        <SidebarMobile
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
}
// import Sidebar from "../components/Project/Sidebar";
// import DashboardContent from "../components/Dashboard/DashboardContent";
// import { useAuth } from "../hooks/useAuth";
// import { LogOut } from "lucide-react";

// export default function DashboardPage() {
//   const { logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-gray-50 relative">
//       <div className="max-w-[1200px] grid grid-cols-3 gap-6">
//         <Sidebar />
//         <main className="col-span-2 py-6">
//           <DashboardContent />
//         </main>
//       </div>

//       <button
//         onClick={logout}
//         className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors z-50"
//       >
//         <LogOut size={18} />
//         Logout
//       </button>
//     </div>
//   );
// }
