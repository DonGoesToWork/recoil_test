import { Note } from "../../Data/Note";
import "./SnippetPage.css";

import React from "react";

interface SnippetPageProps {
  notes: Note[];
  selectedNoteId: string;
}

// DAR - CHANGED PAGE

const SnippetPage: React.FC<SnippetPageProps> = ({ notes, selectedNoteId }) => {
  return (
    <div className="snippet-page-container">
      <h1>Snippets</h1>
      <p>TODO: Add Snippets</p>
    </div>
  );
};

export default SnippetPage;
