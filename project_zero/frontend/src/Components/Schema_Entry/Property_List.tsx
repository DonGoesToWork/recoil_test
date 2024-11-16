import "./Property_List.css";

import { Schema, Schema_Property, get_default_string_property } from "../../Data/Schema";
import { useEffect, useState } from "react";

interface Property_List_Props {
  selected_schema: Schema;
  update_schema: (field: string, value: Schema_Property[], selected_schema_id: string) => void;
}

const Property_List: React.FC<Property_List_Props> = ({ selected_schema, update_schema }): JSX.Element => {
  const [new_property, setNewProperty] = useState("");
  const [schema_properties_input, setSchemaPropertiesInput] = useState<Schema_Property[]>(() => [...selected_schema.property_list]);

  useEffect(() => {
    setSchemaPropertiesInput([...selected_schema.property_list]);
  }, [selected_schema.property_list]);

  const handle_edit_property = (index: number, field: keyof Schema_Property, value: string | boolean) => {
    const updated_properties = schema_properties_input.map((prop, i) => (i === index ? { ...prop, [field]: value } : prop));
    setSchemaPropertiesInput(updated_properties);
    update_schema("property_list", updated_properties, selected_schema.id);
  };

  const handle_delete_property = (index: number) => {
    const updated_properties = schema_properties_input.filter((_, i) => i !== index);
    setSchemaPropertiesInput(updated_properties);
    update_schema("property_list", updated_properties, selected_schema.id);
  };

  const handle_add_property = () => {
    if (!new_property) return;
    const updated_properties = [...schema_properties_input, get_default_string_property(new_property)];
    setSchemaPropertiesInput(updated_properties);
    update_schema("property_list", updated_properties, selected_schema.id);
    setNewProperty("");
  };

  return (
    <div className="property-list-container">
      <label>Property List Config</label>
      <h3>Properties that Exist on Object and Sync Across Clients</h3>
      <h3>(Note: Click outside of a text input box to save changes!)</h3>
      <table className="property-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Default Value</th>
            <th>Gen IA Create</th>
            <th>Gen IA Set</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {schema_properties_input.map((property, index) => (
            <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td>
                <input type="text" value={property.name} onBlur={(e) => handle_edit_property(index, "name", e.target.value)} autoFocus onChange={() => {}} />
              </td>
              <td>
                <input type="text" value={property.default_value} onBlur={(e) => handle_edit_property(index, "default_value", e.target.value)} onChange={() => {}} />
              </td>
              <td className="radio-column">
                <input type="radio" checked={property.do_gen_ia_create_new} onClick={() => handle_edit_property(index, "do_gen_ia_create_new", !property.do_gen_ia_create_new)} onChange={() => {}} />
              </td>
              <td className="radio-column">
                <input type="radio" checked={property.do_gen_ia_set} onClick={() => handle_edit_property(index, "do_gen_ia_set", !property.do_gen_ia_set)} onChange={() => {}} />
              </td>
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
              <input type="text" value={new_property} onChange={(e) => setNewProperty(e.target.value)} placeholder="Add new property..." />
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
