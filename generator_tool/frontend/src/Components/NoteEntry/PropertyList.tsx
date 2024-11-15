import { Note, Note_Property } from "../../Data/Note";

import { useState } from "react";

const PropertyList: React.FC<{ selectedNote: Note; updateNote: (field: string, value: string, selectedNoteId: string) => void }> = ({ selectedNote, updateNote }): JSX.Element => {
  let note_properties: Note_Property[] = selectedNote.property_list;
  const [properties, setProperties] = useState(note_properties);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newProperty, setNewProperty] = useState("");

  // Update the main list and sync changes to selectedNote
  const handleSave = (newProperties: any) => {
    setProperties(newProperties);
    updateNote(
      "property_list",
      newProperties.map((prop: any) => prop.text),
      selectedNote.id
    );
  };

  // Add a new property row
  const handleAddProperty = () => {
    if (newProperty.trim()) {
      const updatedProperties = [...properties, { text: newProperty.trim(), checked: false }];
      handleSave(updatedProperties);
      setNewProperty("");
    }
  };

  // Delete a property by index
  const handleDeleteProperty = (index: number) => {
    const updatedProperties = properties.filter((_, i) => i !== index);
    handleSave(updatedProperties);
  };

  // Save changes to an edited property
  const handleEditProperty = (index: number, editedValue: string) => {
    const updatedProperties = properties.map((prop, i) => (i === index ? { ...prop, text: editedValue } : prop));
    handleSave(updatedProperties);
    setEditingIndex(null);
  };

  // Toggle the radio button for the selected property
  const handleToggleChecked = (index: number) => {
    const updatedProperties = properties.map((prop, i) => ({
      ...prop,
      checked: i === index ? !prop.do_gen_ia_create_new : prop.do_gen_ia_create_new,
    }));
    handleSave(updatedProperties);
  };

  return (
    <div className="property-list-container">
      <label>Property List</label>
      <h3>Properties that Exist on Object and Sync Across Clients</h3>

      <table className="property-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Property</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property, index) => (
            <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td className="radio-column">
                <input type="radio" checked={property.do_gen_ia_create_new} onChange={() => handleToggleChecked(index)} />
              </td>
              <td>{editingIndex === index ? <input type="text" value={property.name} onChange={(e) => handleEditProperty(index, e.target.value)} onBlur={() => setEditingIndex(null)} autoFocus /> : <span onClick={() => setEditingIndex(index)}>{property.name}</span>}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDeleteProperty(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td>
              <input type="text" value={newProperty} onChange={(e) => setNewProperty(e.target.value)} placeholder="Add new property..." />
            </td>
            <td>
              <button onClick={handleAddProperty}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PropertyList;
