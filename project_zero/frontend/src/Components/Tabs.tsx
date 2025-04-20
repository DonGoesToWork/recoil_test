import "./Tabs.css";

import React from "react";

interface TabsProps {
  selected_tab: number;
  handle_tab_change: (tabIndex: number) => void;
}

function get_button(selected_tab: number, index: number, text: string, handle_tab_change: (tabIndex: number) => void) {
  return (
    <button className={`tab ${selected_tab === index ? "active" : ""}`} onClick={() => handle_tab_change(index)}>
      {text}
    </button>
  );
}

const Tabs: React.FC<TabsProps> = ({ selected_tab, handle_tab_change }) => {
  let tab_text = [
    "Shared Data Model",
    "Shared Object State",
    "Front-End Data Model",
    "Back-End Data Model",
    "Object Registration",
    "Global Class Map",
    "All State",
  ];

  // Loop over tabs and create buttons
  return <div className="tabs">{tab_text.map((text, index) => get_button(selected_tab, index, text, handle_tab_change))}</div>;
};

export default Tabs;
