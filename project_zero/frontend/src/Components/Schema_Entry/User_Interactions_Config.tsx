import "./List_Config_Base.css";

import { Schema, User_Interaction } from "../../Data/Schema";
import { useEffect, useState } from "react";

import { Update_Schema_Params } from "../Main";

interface User_Interactions_Config_Props {
  selected_schema: Schema;
  update_schema: (field: string, value: Update_Schema_Params, selected_schema_id: string) => void;
}

const User_Interactions_Config: React.FC<User_Interactions_Config_Props> = ({ selected_schema, update_schema }): JSX.Element => {
  const [schema_user_interaction_input, set_schema_user_interaction_list] = useState<User_Interaction[]>(() => [...selected_schema.user_interaction_list]);

  useEffect(() => {
    set_schema_user_interaction_list([...selected_schema.user_interaction_list]);
  }, [selected_schema.property_list]);

  const handle_edit_property = (index: number, field: keyof User_Interaction, value: string | boolean) => {
    const updated_user_interaction = schema_user_interaction_input.map((prop, i) => (i === index ? { ...prop, [field]: value } : prop));
    set_schema_user_interaction_list(updated_user_interaction);
    update_schema("user_interaction", updated_user_interaction, selected_schema.id);
  };

  const handle_delete_property = (index: number) => {
    const updated_user_interaction = schema_user_interaction_input.filter((_, i) => i !== index);
    set_schema_user_interaction_list(updated_user_interaction);
    update_schema("user_interaction", updated_user_interaction, selected_schema.id);
  };

  const handle_add_property = () => {
    let user_interaction: User_Interaction = { function_name: "x", target_object: "x" };
    const updated_user_interaction = [...schema_user_interaction_input, user_interaction];
    set_schema_user_interaction_list(updated_user_interaction);
    update_schema("user_interaction", updated_user_interaction, selected_schema.id);
  };

  return (
    <>
      <label>User Interactions Config</label>
      <h3>Create Interaction Templates to be Filled In.</h3>
      <div>
        <button className="add-button" onClick={handle_add_property}>
          Add New Interaction
        </button>
      </div>
      <table className="property-table">
        <thead>
          <tr>
            <th>Function Name</th>
            <th>Target Object</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {schema_user_interaction_input.map((property, index) => (
            <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td>
                <input type="text" value={property.function_name} onChange={(e) => handle_edit_property(index, "function_name", e.target.value)} />
              </td>
              <td>
                <input type="text" value={property.target_object} onChange={(e) => handle_edit_property(index, "target_object", e.target.value)} />
              </td>
              <td>
                <button className="delete-btn" onClick={() => handle_delete_property(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button className="add-button" onClick={handle_add_property}>
          Add New Interaction
        </button>
      </div>
    </>
  );
};

export default User_Interactions_Config;
