import "./SnippetPage.css";

import React from "react";
import { Schema } from "../../Data/Schema";

interface SnippetPageProps {
  schemas: Schema[];
  selected_schema_id: string;
}

// DAR - CHANGED PAGE

const SnippetPage: React.FC<SnippetPageProps> = ({ schemas, selected_schema_id }) => {
  return (
    <div className="snippet-page-container">
      <h1>Snippets</h1>
      <p>TODO: Add Snippets</p>
    </div>
  );
};

export default SnippetPage;
