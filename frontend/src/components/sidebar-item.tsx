import React from "react"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <div onClick={onClick} className={`sidebar-item ${active ? "sidebar-item.active" : "sidebar-item"}`}>
      {icon}
      <span className="ml-3">{label}</span>
    </div>
  )
}

export default SidebarItem

