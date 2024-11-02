import "./Tabs.css";

import React from "react";

interface TabsProps {
  selectedTab: number;
  handleTabChange: (tabIndex: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ selectedTab, handleTabChange }) => {
  return (
    <div className="tabs">
      <button className={`tab ${selectedTab === 0 ? "active" : ""}`} onClick={() => handleTabChange(0)}>
        Shared Data Model
      </button>
      <button className={`tab ${selectedTab === 1 ? "active" : ""}`} onClick={() => handleTabChange(1)}>
        Front-End Data Model
      </button>
      <button className={`tab ${selectedTab === 2 ? "active" : ""}`} onClick={() => handleTabChange(2)}>
        Back-End Data Model
      </button>
      <button className={`tab ${selectedTab === 3 ? "active" : ""}`} onClick={() => handleTabChange(3)}>
        Object Registration
      </button>
      <button className={`tab ${selectedTab === 4 ? "active" : ""}`} onClick={() => handleTabChange(4)}>
        Global Class Map
      </button>
    </div>
  );
};

export default Tabs;
