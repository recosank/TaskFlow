import Sidebar from "../components/Project/Sidebar";
import DashboardContent from "../components/Dashboard/DashboardContent";
import { useAuth } from "../hooks/useAuth"; // Import your auth hook
import { LogOut } from "lucide-react"; // Import logout icon (or use text)

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-[1200px] grid grid-cols-3 gap-6">
        <Sidebar />
        <main className="col-span-2 py-6">
          <DashboardContent />
        </main>
      </div>

      <button
        onClick={logout}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors z-50"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
