import "./ManagePage.css";

import { Note, getDefaultNote } from "../../Data/Note";
import React from "react";
import { exportNotes, importNotes } from "../../Data/TransmitLib";

import ConfirmButton from "../Buttons/ConfirmButton";

interface ManagePageProps {
  notes: Note[];
  setSelectedNoteId: (id: string) => void;
  setNotes: (notes: Note[]) => void;
}

// DAR - CHANGED PAGE

const ManagePage: React.FC<ManagePageProps> = ({ notes, setSelectedNoteId, setNotes }) => {
  // Add new note
  const addNote = () => {
    const newNote: Note = getDefaultNote();
    setNotes([...notes, newNote]);
    setSelectedNoteId(newNote.id);
  };

  const addNote5 = () => {
    let note_list: any = [];

    for (var i = 0; i < 5; i++) {
      note_list.push(getDefaultNote());
    }
    setNotes([...notes, ...note_list]);
    setSelectedNoteId(note_list[0].id);
  };

  const addNote1000 = () => {
    let note_list: any = [];

    for (var i = 0; i < 1000; i++) {
      note_list.push(getDefaultNote());
    }
    setNotes([...notes, ...note_list]);
    setSelectedNoteId(note_list[0].id);
  };

  return (
    <div className="manage-page-container">
      <h1>Import & Export</h1>
      <div className="manage-page-buttons">
        <ConfirmButton onConfirm={() => {
              let notes: Note[] | null = importNotes();

              if (notes != null) {
                setNotes(notes);
              }
            }}>
          <button
            className="add-note-btn"
          >
            Import
          </button>
        </ConfirmButton>
        <button
          className="add-note-btn"
          onClick={() => {
            // DAR TODO - Confirmation Modal before allowing export.
            exportNotes(notes);
          }}
        >
          Export
        </button>
      </div>

      <h1>Mass Add Blank New Classes</h1>
      <div className="manage-page-buttons">
        <button className="add-note-btn" onClick={addNote}>
          Add Class
        </button>
        <button className="add-note-btn" onClick={addNote5}>
          Add Class x5
        </button>
        <button className="add-note-btn" onClick={addNote1000}>
          Add Class x1000
        </button>
      </div>

      <h1>Delete All Classes</h1>
      <button className="add-note-btn">
        Delete All Classes (TODO) (make red)
      </button>
    </div>
  );
};

export default ManagePage;
