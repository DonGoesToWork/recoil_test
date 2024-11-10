import "./NoteList.css";

import { Note, getDefaultNote } from "../../Data/Note";
import React, { useMemo, useState } from "react";
import { exportNotes } from "../../Data/TransmitLib";

import NoteGrid from "./NoteGrid";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import { notesPerPage } from "./NotesPerPage";

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string) => void;
  setNotes: (notes: Note[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, selectedNoteId, setSelectedNoteId, setNotes, currentPage, setCurrentPage }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const addNote = () => {
    const newNote: Note = getDefaultNote();
    setNotes([...notes, newNote]);
    setSelectedNoteId(newNote.id);
    let finalPage = Math.floor((notes.length / 9)) + 1;

    // Always advance to final page when not on it.
    if (currentPage != finalPage) {
      setCurrentPage(finalPage);
    }
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
    <div className="notes-list-container-buttons">
      <button className="add-note-btn" onClick={addNote}>
        📝 Add New
      </button>
      <button
        className="add-note-btn"
        onClick={() => {
          // DAR TODO - Confirmation Modal before allowing export.
          exportNotes(notes);
        }}
      >
        📂 Export
      </button>
    </div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <NoteGrid notes={paginatedNotes} selectedNoteId={selectedNoteId} setSelectedNoteId={setSelectedNoteId} />

      <Pagination totalNotes={filteredNotes.length} notesPerPage={notesPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />

    </div>
  );
};

export default NoteList;
