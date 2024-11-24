This is a list of todo items that have been complated.

\*----------------------------------------------------------\*
11/23/2024

Major 1: Multiple Parent Support

Description:

- Auto-generate parent data. Allow for objects to have multiple possible parents, but only one actual parent. Use this to allow objects to be slotted into different objects as a child without causing problems when specific item type isn't present in one object type or another.

Intended use case is to let objects go into multiple object types without problems. For instance, stat containers can be put onto players, items and monsters and be removed as necessary without causing issues.

\*----------------------------------------------------------\*
Old as of 11/22:

- Major 3:

* Need to also have an 'Interactions' list that lists user interactions that will need to be mapped to the back-end.
  For Interactions, we will need to have some kind of means to ensure that we fill the required functions in, like abstract classes or something.

  - Idea is to auto-generate the 'ia' logic to map front-end to back-end and leave only fleshing out back-end logic to developer.

* Add constrained logic to generating our child object data.

---

Children properties need a revamp. We need controls on the id list.

- Need to specify whether child_id list can have gaps or not.
- Need to specify if there is a max_count on child_ids and then implement relevant controls/fields.
  x Probably will need to move the [child_ids] properties into the child_properties block after all to make life easy. (NVM)

---

- Make it so that our interface functions pass an object to the functions, rather than a huge ass parameter list.
  - Create interface for the function objects that are going to get passed in.
  - Make it so that parameters are optional. If not set, then set them to 'no value'.
- Generate Sample Interactions Files in Interactions Folder.

  - Create field on front-end to let user ent

- ia_create and ia_set can just call non-ia versions. (WIP)
  er in interactions and their desired properties.

* Turn Properties Field back into Grid after all.
  - Add ability to toggle off generation of ia logic fields to not generate back-end calls.
    - Sometimes, there are fields that we do not want to exposed to the front-end for being set.
      - For instance, the 'create' functions are probably interactions that we don't always want on.
      - We also want 'create' functions to be made from high-priority TODO section.
  - Allow for setting default value of field.

- Class Names ffile is redundant.
- Finish individual entries tab.
  x Make "Child Name List" and "Properties" fields on web page nice tables with add row/delete/edit functionality.
- Implement schema import and schema export functionality.
- Fixed ws issues.
- Confirmation buttons on import/export button clicks.
- Put Object_Registration into z_generated, because it is, and .gitignore it.
