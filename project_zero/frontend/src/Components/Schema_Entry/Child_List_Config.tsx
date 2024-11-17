import "./List_Config_Base.css";

import { Child_Schema, Schema, get_default_child_schema } from "../../Data/Schema";
import { useEffect, useState } from "react";

import { Update_Schema_Params } from "../Main";

interface Child_List_Config_Props {
  selected_schema: Schema;
  update_schema: (field: string, value: Update_Schema_Params, selected_schema_id: string) => void;
}

const Child_List_Config: React.FC<Child_List_Config_Props> = ({ selected_schema, update_schema }): JSX.Element => {
  const [new_property, setNewProperty] = useState("");
  const [schema_child_list_input, set_schema_child_input_list] = useState<Child_Schema[]>(() => [...selected_schema.child_list]);

  useEffect(() => {
    set_schema_child_input_list([...selected_schema.child_list]);
  }, [selected_schema.property_list]);

  const handle_edit_property = (index: number, field: keyof Child_Schema, value: string | boolean) => {
    const updated_child_list = schema_child_list_input.map((prop, i) => (i === index ? { ...prop, [field]: value } : prop));
    set_schema_child_input_list(updated_child_list);
    update_schema("child_list", updated_child_list, selected_schema.id);
  };

  const handle_delete_property = (index: number) => {
    const updated_child_list = schema_child_list_input.filter((_, i) => i !== index);
    set_schema_child_input_list(updated_child_list);
    update_schema("child_list", updated_child_list, selected_schema.id);
  };

  const handle_add_property = () => {
    if (!new_property) return;
    const updated_child_list = [...schema_child_list_input, get_default_child_schema(new_property)];
    set_schema_child_input_list(updated_child_list);
    setNewProperty("");
    update_schema("child_list", updated_child_list, selected_schema.id);
  };

  return (
    <div className="property-list-container">
      <label>Child List Config</label>
      <h3>Set Objects that this object includes and set their id_list configuration.</h3>
      <table className="property-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Size</th>
            <th>Max Size</th>
            <th>Allow Empty Indexes</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {schema_child_list_input.map((property, index) => (
            <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td>
                <p>{property.name}</p>
              </td>
              <td>
                <input type="text" value={property.id_list_start_size} onChange={(e) => handle_edit_property(index, "id_list_start_size", e.target.value)} />
              </td>
              <td>
                <input type="text" value={property.id_list_max_size} onChange={(e) => handle_edit_property(index, "id_list_max_size", e.target.value)} />
              </td>
              <td className="radio-column">
                <input type="checkbox" checked={property.id_list_allow_empty_indexes} onClick={() => {}} onChange={() => handle_edit_property(index, "id_list_allow_empty_indexes", !property.id_list_allow_empty_indexes)} />
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
              <input type="text" value={new_property} onChange={(e) => setNewProperty(e.target.value)} placeholder="Add new child dependent..." />
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

export default Child_List_Config;
