import './main.css';
import React, { useState, useEffect } from 'react';
import { generateUniqueId } from '../Utils/utils';
import Preview_Shared_DM_Lib from '../Data/Preview_Shared_DM_Lib';
import {
  getBeeFarmNote,
  getBeeHiveNote,
  getBeeNote,
  getFarmerNote,
  getPlayerNote,
  Note,
} from '../Data/Note';
import Preview_Front_DM_Lib from '../Data/Preview_Front_DM_Lib';
import Preview_Back_DM_Lib from '../Data/Preview_Back_DM_Lib';
import NoteList from './Notes/NoteList';
import NoteForm from './Notes/NoteForm';
import Tabs from './Tabs';
import { useToast } from './Toast/ToastContainer';
import Preview_Singles_DM_Lib from '../Data/Preview_Object_Registration_DM_Lib';

export interface selectNoteProps {
  setOutputText: Function;
  selectedTab: number;
  notes: Note[];
  selectedNote: Note;
}

const update_output = (select_note_data: selectNoteProps) => {
  const { setOutputText, selectedTab, notes, selectedNote } = select_note_data;

  switch (selectedTab) {
    case 0:
      setOutputText(new Preview_Shared_DM_Lib(selectedNote).finalContent);
      break;
    case 1:
      setOutputText(new Preview_Front_DM_Lib(selectedNote).finalContent);
      break;
    case 2:
      setOutputText(new Preview_Back_DM_Lib(selectedNote).finalContent);
      break;
    case 3:
      setOutputText(new Preview_Singles_DM_Lib(notes).finalContent);
      break;
    default:
      setOutputText('');
      break;
  }
};

const App: React.FC = () => {
  const firstId = generateUniqueId();

  const [notes, setNotes] = useState<Note[]>([
    getBeeNote(firstId),
    getBeeHiveNote(generateUniqueId()),
    getBeeFarmNote(generateUniqueId()),
    getFarmerNote(generateUniqueId()),
    getPlayerNote(generateUniqueId()),
  ]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(firstId);
  const [outputText, setOutputText] = useState<string>(
    new Preview_Shared_DM_Lib(notes[0]).finalContent
  );
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const { addToast } = useToast();

  // Track the selected note
  const selectedNote: Note = notes.find(
    (note) => note.id === selectedNoteId
  ) as Note;

  // Effect to update output text when notes, selectedTab, or selectedNote change
  useEffect(() => {
    if (selectedNote) {
      update_output({
        setOutputText,
        selectedTab,
        notes,
        selectedNote,
      });
    }
  }, [notes, selectedTab, selectedNote]);

  const updateNote = (
    field: string,
    value: string,
    selectedNoteId: string
  ): void => {
    if (selectedNoteId !== null) {
      value = value.replace(new RegExp(' ', 'g'), '_');

      const updatedNotes = notes.map((note) =>
        note.id === selectedNoteId ? { ...note, [field]: value } : note
      );
      setNotes(updatedNotes);
    }
  };

  const deleteNote = (): boolean => {
    if (notes.length === 1) {
      addToast('Error: Unable to delete final object.', 'error', 5000);
      console.log("Can't delete last object.");
      return false;
    }

    const filteredNotes = notes.filter((note) => note.id !== selectedNoteId);
    setSelectedNoteId(filteredNotes[0].id);
    setNotes(filteredNotes);
    return true;
  };

  const handleTabChange = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };

  return (
    <div className="app-container">
      <header>
        <h1>(Custom) Full Stack Object Code Generator</h1>
      </header>
      <div className="notes-container">
        <div className="notes-container-note-list">
          <NoteList
            notes={notes}
            selectedNoteId={selectedNoteId}
            setSelectedNoteId={setSelectedNoteId}
            setNotes={setNotes}
          />
        </div>
        <div className="notes-container-note-form">
          <NoteForm
            selectedNote={selectedNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
          />
        </div>
        <div className="output-container">
          <Tabs selectedTab={selectedTab} handleTabChange={handleTabChange} />
          <textarea
            className="output-text"
            value={outputText}
            readOnly
            wrap="off"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
