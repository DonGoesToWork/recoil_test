import "./NoteForm.css";

import { Note } from "../../Data/Note";
import React from "react";

interface NoteFormProps {
  selectedNote: Note;
  updateNote: (field: string, value: string, selectedNoteId: string) => void;
  deleteNote: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ selectedNote, updateNote, deleteNote }) => {
  return (
    <div className="note-view">
      <label>Class Name</label>
      <h3>The name of this object's class. The object's name.</h3>
      <input className="note-title" value={selectedNote.object_name} onChange={(e) => updateNote("object_name", e.target.value, selectedNote.id)} placeholder="Note Title" />

      <label>Parent Name</label>
      <h3>Object that includes this object.</h3>
      <input className="note-title" value={selectedNote.parent} onChange={(e) => updateNote("parent", e.target.value, selectedNote.id)} placeholder="Parent Object" />

      <label>Child Name List</label>
      <h3>Objects that this object logically includes.</h3>
      <textarea className="note-content" value={selectedNote.child_list} onChange={(e) => updateNote("child_list", e.target.value, selectedNote.id)} placeholder="Write one (1) child object per line..." />

      <label>Property List</label>
      <h3>Properties that Exist On Object and Sync Across Clients.</h3>
      <textarea className="note-content" value={selectedNote.property_list} onChange={(e) => updateNote("property_list", e.target.value, selectedNote.id)} placeholder="Write one (1) property per line..." />

      <label>Date</label>
      <h3>Date object was added. (or edited, if you modify the field...)</h3>
      <input className="note-date" type="date" value={selectedNote?.date || ""} onChange={(e) => updateNote("date", e.target.value, selectedNote.id)} />

      <button className="delete-note-btn" onClick={deleteNote}>
        Delete Object
      </button>
    </div>
  );
};

export default NoteForm;
