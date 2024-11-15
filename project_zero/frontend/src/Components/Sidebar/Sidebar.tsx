import "./Sidebar.css";

import { JSX } from "react/jsx-runtime";
import React from "react";

interface SidebarProps {
  third_column_view: number;
  set_third_column_view: (id: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ third_column_view, set_third_column_view }) => {
  let button_array = ["🎹 Input", "💾 Manage", "⚡ Snippets", "👌 Preview", "👑 Dev View", "❔ Help", "💭 About"];
  let button_view_array: JSX.Element[] = [];

  button_array.forEach((v, i) => {
    button_view_array.push(
      <button
        key={i}
        onClick={() => {
          set_third_column_view(i);
        }}
        className={`${third_column_view === i ? "active" : ""}`}
      >
        {v}
      </button>
    );
  });

  return <div className="schemas-container-col-sidebar">{button_view_array.map((v) => v)}</div>;
};

export default Sidebar;
