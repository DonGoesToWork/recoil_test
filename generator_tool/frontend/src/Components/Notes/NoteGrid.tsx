import "./NoteGrid.css";

import { Note } from "../../Data/Note";
import React from "react";

interface NoteGridProps {
  notes: Note[];
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string) => void;
}

const line_length_max = 15;

const truncated = (content: string): string => (content.length > line_length_max ? content.substring(0, line_length_max).split("\n").join(", ") + "..." : content);

const NoteGrid: React.FC<NoteGridProps> = ({ notes, selectedNoteId, setSelectedNoteId }) => {
  return (
    <div className="note-grid">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`note-item ${note.id === selectedNoteId ? "selected" : ""}`}
          onClick={() => {
            setSelectedNoteId(note.id);
          }}
        >
          <div className="note-title-preview">{note.object_name}</div>
          <div className="note-preview">{truncated("- " + note.parent)}</div>
          <div className="note-preview">{truncated("- " + note.child_list)}</div>
          <div className="note-preview">{truncated("- " + note.property_list)}</div>
          <div className="note-date-preview">{note.date}</div>
        </div>
      ))}
    </div>
  );
};

export default NoteGrid;
