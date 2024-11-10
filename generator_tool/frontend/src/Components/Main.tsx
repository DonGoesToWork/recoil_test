import "./main.css";

import { Note, getBeeFarmNote, getBeeHiveNote, getBeeNote, getFarmerNote, getPlayerNote } from "../Data/Note";
import React, { useEffect, useState } from "react";

import NoteList from "./Notes/NoteList";
import Preview_Back_DM_Lib from "../Data/Preview_Back_DM_Lib";
import Preview_Front_DM_Lib from "../Data/Preview_Front_DM_Lib";
import Preview_Global_Class_Map_Lib from "../Data/Preview_Global_Class_Map";
import Preview_Shared_DM_Lib from "../Data/Preview_Shared_DM_Lib";
import Preview_Singles_DM_Lib from "../Data/Preview_Object_Registration_DM_Lib";
import Tabs from "./Tabs";
import { generateUniqueId } from "../Utils/utils";
import { useToast } from "./Toast/ToastContainer";
import { notesPerPage } from "./Notes/NotesPerPage";
import ManagePage from "./Manage/ManagePage";
import NoteForm from "./NoteEntry/NoteForm";
import SnippetPage from "./Snippets/SnippetPage";
import Sidebar from "./Sidebar/Sidebar";

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
    case 4:
      setOutputText(new Preview_Global_Class_Map_Lib(notes).finalContent);
      break;
    default:
      setOutputText("");
      break;
  }
};

const App: React.FC = () => {
  const firstId = generateUniqueId();

  const [notes, setNotes] = useState<Note[]>([getBeeNote(firstId), getBeeHiveNote(generateUniqueId()), getBeeFarmNote(generateUniqueId()), getFarmerNote(generateUniqueId()), getPlayerNote(generateUniqueId())]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>(firstId);
  const [outputText, setOutputText] = useState<string>(new Preview_Shared_DM_Lib(notes[0]).finalContent);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [thirdColumnView, setThirdColumnView] = useState(4); // in prod, we use 5

  const { addToast } = useToast();

  // Track the selected note
  const selectedNote: Note = notes.find((note) => note.id === selectedNoteId) as Note;

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

  const updateNote = (field: string, value: string, selectedNoteId: string): void => {
    if (selectedNoteId !== null) {
      value = value.replace(new RegExp(" ", "g"), "_");

      const updatedNotes = notes.map((note) => (note.id === selectedNoteId ? { ...note, [field]: value } : note));
      setNotes(updatedNotes);
    }
  };

  const deleteNote = (): boolean => {
    if (notes.length === 1) {
      addToast("Error: Unable to delete final object.", "error", 5000);
      console.log("Can't delete last object.");
      return false;
    }

    // get index of selectedNote to select the note before it on delete...
    const filteredNotes = notes.filter((note) => note.id !== selectedNoteId);
    let removeNoteIndex = notes.findIndex((note) => note.id === selectedNoteId);
    let setSelectedNoteIdIndex = removeNoteIndex-1;

    if (setSelectedNoteIdIndex < 0) { // cap at 0.
      setSelectedNoteIdIndex = 0;
    }

    setSelectedNoteId(filteredNotes[setSelectedNoteIdIndex].id);
    setNotes(filteredNotes);

    // Decrement page whenever we delete the last note of a page (excluding the first page).
    if (currentPage == Math.ceil(notes.length / notesPerPage) && notes.length % notesPerPage == 1) {
      setCurrentPage(currentPage - 1);
    }

    return true;
  };

  const handleTabChange = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };

  let item1;
  let item2;
  let noteList = <div>
    <NoteList notes={notes} selectedNoteId={selectedNoteId} setSelectedNoteId={setSelectedNoteId} setNotes={setNotes} currentPage={currentPage} setCurrentPage={setCurrentPage} />
  </div>;
  let noteForm = <div>
    <NoteForm selectedNote={selectedNote} updateNote={updateNote} deleteNote={deleteNote} />
  </div>;

  let thirdColumnCounter = 0;

  switch (thirdColumnView) {
    case thirdColumnCounter++:
      item1 = <div className="notes-container-col-view2 my-card">
        {noteList}
      </div>;
      item2 = <div className="notes-container-col-view3 my-card">
        {noteForm}
      </div>;
      break;
    case thirdColumnCounter++:
      item1 = <div className="notes-container-col-view my-card">
        <ManagePage notes={notes} setSelectedNoteId={setSelectedNoteId} setNotes={setNotes} />;
      </div>
      break;
    case thirdColumnCounter++:
      item1 = <div className="notes-container-col-view my-card">
        <SnippetPage notes={notes} selectedNoteId={selectedNoteId} />
        </div>;
      break;
    case thirdColumnCounter++:
      item1 = <div className="notes-container-col-view my-card">
      <h1>Preview</h1>
      <p>Show Data Preview Only</p>
      <Tabs selectedTab={selectedTab} handleTabChange={handleTabChange} />
      <textarea className="output-text" value={outputText} readOnly wrap="off" />
    </div>;
    break;
    case thirdColumnCounter++:
      item1 = <div className="notes-container-col-view my-card">
          <h1>Dev View 🧙🏼‍♂️🔥👏🏼⚡✨</h1>
          <div className="dev-view-grid">
            <div className="my-card">
            {noteList}
            </div>
            <div className="my-card">
            {noteForm}
            </div>
            <div className="my-card">
              <div className="output-container">
                <Tabs selectedTab={selectedTab} handleTabChange={handleTabChange} />
                <textarea className="output-text" value={outputText} readOnly wrap="off" />
              </div>
            </div>
            <div className="my-card">
              <SnippetPage notes={notes} selectedNoteId={selectedNoteId} />
            </div>
          </div>
        </div>;
      break;
    case thirdColumnCounter++:
      item1 = <div className="notes-container-col-view2 my-card">
        <h1>Help</h1>
      </div>
      break;
    case thirdColumnCounter++:
      item1 = <div className="notes-container-col-view my-card">
        <h1>About</h1>
        <p>Project Zero made by Donald Abdullah-Robinson for the purposes of evolving the web development ecosystem.</p>
        <p>Github: TODO</p>
      </div>;
      break;
    default:
      item1 = noteForm;
      break;
  }

  return (
    <div>
      <header>
        <h1>ZER0</h1>
      </header>
        <span className="notes-container">
          <Sidebar thirdColumnView={thirdColumnView} setThirdColumnView={setThirdColumnView}/>
          {item1 !== undefined && item1}
          {item2 !== undefined && item2}
        </span>
      {/* End of Notes Container */}
  </div>
  );
};

export default App;
