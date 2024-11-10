import "./Sidebar.css";

import React from "react";
import { JSX } from "react/jsx-runtime";

interface SidebarProps {
  thirdColumnView: number;
  setThirdColumnView: (id: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({thirdColumnView, setThirdColumnView}) => {
  let buttonArray = ["🎹 Input", "💾 Manage", "⚡ Snippets", "👌 Preview", "👑 Dev View", "❔ Help", "💭 About"];
  let buttonViewArray: JSX.Element[] = [];
  
  buttonArray.forEach((v,i) => {
    buttonViewArray.push(
      <button onClick={() => { setThirdColumnView(i);}} className={`${thirdColumnView === i ? "active" : ""}`}>{v}</button>
    );
  })

  return (
    <div className="notes-container-col-sidebar">
      {buttonViewArray.map(v => v)}
    </div>
  );
};

export default Sidebar;
