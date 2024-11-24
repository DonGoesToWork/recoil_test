import "./List_Config_Base.css";

import { useEffect, useState } from "react";

import { Schema } from "../../Data/Schema";
import { Update_Schema_Params } from "../Main";
import { get_snake_case } from "../../Utils/utils";

interface Member_List_Config_Props {
  selected_schema: Schema;
  update_schema: (field: string, value: Update_Schema_Params, selected_schema_id: string) => void;
}

const Member_List_Config: React.FC<Member_List_Config_Props> = ({ selected_schema, update_schema }): JSX.Element => {
  const [schema_member_list_input, set_schema_member_input_list] = useState<string[]>(() => [...selected_schema.member_object_names_list]);

  useEffect(() => {
    set_schema_member_input_list([...selected_schema.member_object_names_list]);
  }, [selected_schema.member_object_names_list]);

  const handle_edit_property = (index: number, value: string) => {
    let copy = [...schema_member_list_input];
    copy[index] = value;
    set_schema_member_input_list(copy);
    update_schema("member_object_names_list", copy, selected_schema.id);
  };

  const handle_delete_property = (index: number) => {
    const updated_member_list = schema_member_list_input.filter((_, i) => i !== index);
    set_schema_member_input_list(updated_member_list);
    update_schema("member_object_names_list", updated_member_list, selected_schema.id);
  };

  const handle_add_property = () => {
    const updated_member_list: string[] = [...schema_member_list_input, ""];
    set_schema_member_input_list(updated_member_list);
    update_schema("member_object_names_list", updated_member_list, selected_schema.id);
  };

  return (
    <>
      <label>Member Names</label>
      <h3>The members that can treat this object as a member and be a part of.</h3>
      <div>
        <button className="add-button" onClick={handle_add_property}>
          Add New Member
        </button>
      </div>
      <table className="property-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {schema_member_list_input.map((property, index) => (
            <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td>
                <input type="text" value={property} onChange={(e) => handle_edit_property(index, get_snake_case(e.target.value))} />
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
          Add New Member
        </button>
      </div>
    </>
  );
};

export default Member_List_Config;
