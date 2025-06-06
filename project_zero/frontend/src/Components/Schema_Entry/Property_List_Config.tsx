import "./List_Config_Base.css";

import { SCHEMA_PROPERTY_PROPERTY_LIST, Schema, Schema_Property, get_default_string_property_blank } from "../../Data/Schema";
import { useEffect, useState } from "react";

import { Update_Schema_Params } from "../Main";
import { get_snake_case_lowercase_input } from "../../Utils/utils";

interface Property_List_Config_Props {
  selected_schema: Schema;
  update_schema: (field: string, value: Update_Schema_Params, selected_schema_id: string) => void;
}

const Property_List_Config: React.FC<Property_List_Config_Props> = ({ selected_schema, update_schema }): JSX.Element => {
  const [schema_properties_input, set_schema_properties_input] = useState<Schema_Property[]>(() => [...selected_schema.property_list]);

  useEffect(() => {
    set_schema_properties_input([...selected_schema.property_list]);
  }, [selected_schema.property_list]);

  const handle_edit_property = (index: number, field: keyof Schema_Property, value: string | boolean) => {
    const updated_properties = schema_properties_input.map((prop, i) => (i === index ? { ...prop, [field]: value } : prop));
    set_schema_properties_input(updated_properties);
    update_schema(SCHEMA_PROPERTY_PROPERTY_LIST, updated_properties, selected_schema.id);
  };

  const handle_delete_property = (index: number) => {
    const updated_properties = schema_properties_input.filter((_, i) => i !== index);
    set_schema_properties_input(updated_properties);
    update_schema(SCHEMA_PROPERTY_PROPERTY_LIST, updated_properties, selected_schema.id);
  };

  const handle_add_property = () => {
    const updated_properties = [...schema_properties_input, get_default_string_property_blank()];
    set_schema_properties_input(updated_properties);
    update_schema(SCHEMA_PROPERTY_PROPERTY_LIST, updated_properties, selected_schema.id);
  };

  return (
    <>
      <label>Property List Config</label>
      <h3>Properties that Exist on Object and Sync Across Clients</h3>
      <div>
        <button onClick={handle_add_property}>Add New Property</button>
      </div>
      <table className="property-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Default Value</th>
            <th>Gen IA Set</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {schema_properties_input.map((property, index) => (
            <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td>
                <input type="text" value={property.name} onChange={(e) => handle_edit_property(index, "name", get_snake_case_lowercase_input(e.target.value))} />
              </td>
              <td>
                <input
                  type="text"
                  value={property.default_value}
                  onChange={(e) => handle_edit_property(index, "default_value", get_snake_case_lowercase_input(e.target.value))}
                />
              </td>
              <td className="radio-column">
                <input
                  type="checkbox"
                  checked={property.do_gen_ia_set}
                  onClick={() => {}}
                  onChange={() => handle_edit_property(index, "do_gen_ia_set", !property.do_gen_ia_set)}
                />
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
        <button onClick={handle_add_property}>Add New Property</button>
      </div>
    </>
  );
};

export default Property_List_Config;
