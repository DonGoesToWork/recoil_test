import "./Sidebar.css";

import React, { useState } from "react";

interface SidebarProps {
  third_column_view: number;
  set_third_column_view: (id: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ third_column_view, set_third_column_view }) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonLabels = ["🎹 Input", "💾 Manage", "⚡ Snippets", "👌 Preview", "👁️ Validate", "👑 Dev View", "❔ Help", "💭 About"];
  const buttonIcons = ["🎹", "💾", "⚡", "👌", "👁️", "👑", "❔", "💭"];

  return (
    <div
      className={`schemas-container-col-sidebar ${isHovered ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {buttonLabels.map((label, index) => (
        <button key={index} onClick={() => set_third_column_view(index)} className={third_column_view === index ? "active" : ""}>
          {isHovered ? label : buttonIcons[index]}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
