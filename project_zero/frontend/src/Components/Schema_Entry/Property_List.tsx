import { Schema, Schema_Property } from "../../Data/Schema";

import { useState } from "react";

interface Property_List_Props {
  selected_schema: Schema;
  update_schema: (field: string, value: string, selected_schema_id: string) => void;
}

const Property_List: React.FC<Property_List_Props> = ({ selected_schema, update_schema }): JSX.Element => {
  let schema_properties: Schema_Property[] = selected_schema.property_list;
  const [properties, set_properties] = useState(schema_properties);
  const [editing_index, set_editing_index] = useState<number | null>(null);
  const [new_property, set_new_property] = useState("");

  // Update the main list and sync changes to selectedSchema
  const handle_save = (newProperties: any) => {
    set_properties(newProperties);
    update_schema(
      "property_list",
      newProperties.map((prop: any) => prop.text),
      selected_schema.id
    );
  };

  // Add a new property row
  const handle_add_property = () => {
    if (new_property.trim()) {
      const updatedProperties = [...properties, { text: new_property.trim(), checked: false }];
      handle_save(updatedProperties);
      set_new_property("");
    }
  };

  // Delete a property by index
  const handle_delete_property = (index: number) => {
    const updatedProperties = properties.filter((_, i) => i !== index);
    handle_save(updatedProperties);
  };

  // Save changes to an edited property
  const handle_edit_property = (index: number, editedValue: string) => {
    const updatedProperties = properties.map((prop, i) => (i === index ? { ...prop, text: editedValue } : prop));
    handle_save(updatedProperties);
    set_editing_index(null);
  };

  // Toggle the radio button for the selected property
  const handle_toggle_checked = (index: number) => {
    const updatedProperties = properties.map((prop, i) => ({
      ...prop,
      checked: i === index ? !prop.do_gen_ia_create_new : prop.do_gen_ia_create_new,
    }));
    handle_save(updatedProperties);
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
                <input type="radio" checked={property.do_gen_ia_create_new} onChange={() => handle_toggle_checked(index)} />
              </td>
              <td>{editing_index === index ? <input type="text" value={property.name} onChange={(e) => handle_edit_property(index, e.target.value)} onBlur={() => set_editing_index(null)} autoFocus /> : <span onClick={() => set_editing_index(index)}>{property.name}</span>}</td>
              <td>
                <button className="delete-btn" onClick={() => handle_delete_property(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td>
              <input type="text" value={new_property} onChange={(e) => set_new_property(e.target.value)} placeholder="Add new property..." />
            </td>
            <td>
              <button onClick={handle_add_property}>Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Property_List;
