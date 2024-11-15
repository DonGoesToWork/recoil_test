import "./Tabs.css";

import React from "react";

interface TabsProps {
  selected_tab: number;
  handle_tab_change: (tabIndex: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ selected_tab, handle_tab_change }) => {
  return (
    <div className="tabs">
      <button className={`tab ${selected_tab === 0 ? "active" : ""}`} onClick={() => handle_tab_change(0)}>
        Shared Data Model
      </button>
      <button className={`tab ${selected_tab === 1 ? "active" : ""}`} onClick={() => handle_tab_change(1)}>
        Front-End Data Model
      </button>
      <button className={`tab ${selected_tab === 2 ? "active" : ""}`} onClick={() => handle_tab_change(2)}>
        Back-End Data Model
      </button>
      <button className={`tab ${selected_tab === 3 ? "active" : ""}`} onClick={() => handle_tab_change(3)}>
        Object Registration
      </button>
      <button className={`tab ${selected_tab === 4 ? "active" : ""}`} onClick={() => handle_tab_change(4)}>
        Global Class Map
      </button>
    </div>
  );
};

export default Tabs;
