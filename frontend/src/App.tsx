"use client";

import React from "react";
import { useState } from "react";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Truck,
  BarChart2,
  Database,
  Settings,
} from "lucide-react";
import SidebarItem from "./components/sidebar-item.tsx";
import Orders from "./components/orders/orders.tsx";
import Customers from "./components/customers/customers.tsx";
import Suppliers from "./components/suppliers.tsx";
import Shipments from "./components/shipments.tsx";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <Orders />;
      case "customers":
        return <Customers />;
      case "suppliers":
        return <Suppliers />;
      case "shipments":
        return <Shipments />;
      default:
        return <div></div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="w-64 h-screen fixed bg-gray-800 text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Inventory System</h1>
        </div>
        <nav className="mt-5">
          <SidebarItem
            icon={<Home size={20} />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarItem
            icon={<Database size={20} />}
            label="Inventory"
            active={activeTab === "inventory"}
            onClick={() => setActiveTab("inventory")}
          />
          <SidebarItem
            icon={<Package size={20} />}
            label="Products"
            active={activeTab === "products"}
            onClick={() => setActiveTab("products")}
          />
          <SidebarItem
            icon={<ShoppingCart size={20} />}
            label="Orders"
            active={activeTab === "orders"}
            onClick={() => setActiveTab("orders")}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Customers"
            active={activeTab === "customers"}
            onClick={() => setActiveTab("customers")}
          />
          <SidebarItem
            icon={<Truck size={20} />}
            label="Suppliers"
            active={activeTab === "suppliers"}
            onClick={() => setActiveTab("suppliers")}
          />
          <SidebarItem
            icon={<Truck size={20} />}
            label="Shipments"
            active={activeTab === "shipments"}
            onClick={() => setActiveTab("shipments")}
          />
          <SidebarItem
            icon={<BarChart2 size={20} />}
            label="Analytics"
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
          />
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{renderContent()}</main>
      </div>
    </div>
  );
};

export default App;
