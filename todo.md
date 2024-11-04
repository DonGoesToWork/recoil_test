To actually finish project:

High Priority TODO:

- Generate Sample Interactions Files in Interactions Folder.
- Confirmation buttons on import/export button clicks.
- Track changed notes and only export changes for changed notes.

* Major 1:

- Turn Properties Field back into Grid after all.
  - Add ability to toggle off generation of ia logic fields to not generate back-end calls.
    - Sometimes, there are fields that will not need methods to set them directly. They will always be set indirectly through iunteractions. So, we won't need to set with front/back-end interactions.
- Allow for objects to be numbers or strings.
  - Numbers get 'ia' methods to increment, decrement, increase, decrease, and set by default.
- Generate additional functions based on types aside from 'set'.
- Create non-ia 'get' methods for each object type to quickly get objects by id.
  - A more customized version of Backend States: 'const existing = this.data[payload.objectType]?.find((item) => item.id === payload.id);'

* Major 2:

Children properties need a revamp. We need controls on the id list.

- Need to specify whether child_id list can have gaps or not.
- Need to specify if there is a max_count on child_ids and then implement relevant controls/ields.
- Probably will need to mvoe the [child_ids] properties into the child_properties block after all to make life easy.
- Auto-generate 'ia' array operations: get, remove, push, pop for child id property lists.

* Major 3:

- Need to also have an 'Interactions' list that lists user interactions that will need to be mapped to the back-end.
  For Interactions, we will need to have some kind of means to ensure that we fill the required functions in, like abstract classes or something.
  - Idea is to auto-generate the 'ia' logic to map front-end to back-end and leave only fleshing out back-end logic to developer.

Future Consideration(s):

When doing operations on Backend_State, like 'find', etc., maybe we can cache them?

Done:

- Class Names ffile is redundant.
- Finish individual entries tab.
  x Make "Child Name List" and "Properties" fields on web page nice tables with add row/delete/edit functionality.
- Implement schema import and schema export functionality.
- Fixed ws issues.
