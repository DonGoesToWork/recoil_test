import "./NoteList.css";

import { Note, getDefaultNote } from "../../Data/Note";
import React, { useMemo, useState } from "react";
import { exportNotes, importNotes } from "../../Data/TransmitLib";

import NoteGrid from "./NoteGrid";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string) => void;
  setNotes: (notes: Note[]) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, selectedNoteId, setSelectedNoteId, setNotes }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // TODO, auto decrement page when deleting the last note on a page (the 'notesPerPage' increment of a page)
  const notesPerPage = 9;

  // Add new note
  const addNote = () => {
    const newNote: Note = getDefaultNote();
    setNotes([...notes, newNote]);
    setSelectedNoteId(newNote.id);
  };

  const addNote1000 = () => {
    let note_list: any = [];

    for (var i = 0; i < 1000; i++) {
      note_list.push(getDefaultNote());
    }
    setNotes([...notes, ...note_list]);
    setSelectedNoteId(note_list[0].id);
  };

  // Filter notes based on the search query
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => note.object_name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [notes, searchQuery]);

  // Pagination: Calculate the notes for the current page
  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * notesPerPage;
    return filteredNotes.slice(start, start + notesPerPage);
  }, [filteredNotes, currentPage]);

  return (
    <div className="notes-list-container">
      <div>
        <button
          className="add-note-btn"
          onClick={() => {
            // DAR TODO - Confirmation Modal before allowing import.
            let notes: Note[] | null = importNotes();

            if (notes != null) {
              setNotes(notes);
            }
          }}
        >
          Import
        </button>
        <button className="add-note-btn" onClick={addNote}>
          Add Class
        </button>
        <button className="add-note-btn" onClick={addNote1000}>
          Add Class x1000
        </button>
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

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <NoteGrid notes={paginatedNotes} selectedNoteId={selectedNoteId} setSelectedNoteId={setSelectedNoteId} />

      <Pagination totalNotes={filteredNotes.length} notesPerPage={notesPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default NoteList;
