// components/Project/Sidebar.tsx
import { useMediaQuery } from "../../hooks/useMediaQuery";
import SidebarDesktop from "./Sidebar";
import SidebarMobile from "./SidebarMobile";
import { useState } from "react";

export default function SidebarConnector() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);

  if (isDesktop) {
    return <SidebarDesktop />;
  }

  return (
    <SidebarMobile
      isOpen={mobileSidebarOpen}
      onClose={() => setMobileSidebarOpen(false)}
    />
  );
}
