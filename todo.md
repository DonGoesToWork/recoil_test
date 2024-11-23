To actually finish project:

Major 1: Multiple Parent Support

Description:

- Auto-generate parent data. Allow for objects to have multiple possible parents, but only one actual parent. Use this to allow objects to be slotted into different objects as a child without causing problems when specific item type isn't present in one object type or another.

Intended use case is to let objects go into multiple object types without problesm. For instance, stat containers can be put onto players, items and monsters and be removed as necessary without causing issues.

Status:

- Started! Fix create_new methods tomorrow. (Remove worked fine though.)

---

Major 2: Increase Scope of generated functions:

1. Property List Config - Set Values to number or string.

- Generate 'ia' methods to: increment, decrement, increase and decrease value.

2. Implement "Inventory.ts" methods for all ojecct types.
   See Template file "Inventory.ts" for sample implementation.
3. Create functions for managing child_id_lists based on control parameters.

- If max size is set, then we want to constrain the number of items added to the list.
- If not set or -1, then do not constrain.
- If allow empty indexes is set vs. not, we should change how the delete algorithm behaves on object deletion.

---

Major 3: Optional Groups

Optional groups are parent objects that do not delete children when children are removed from the gorup. All other rules apply.

1. Create UI for "Optional Groups"
2. Implement code generation to support "Optional Groups"
3. Implement generic optional group removal functiosn that are distinguisehed from those in Generic_Remove.ts

---

Major 4: Object Transfer

- If an object has a certain object type as a child, then it should be possible to transfer an object from one parent to another effortlessly.

---

Future Consideration(s):

- When doing operations on Backend_State, like 'find', etc., maybe we can cache them?
- Track changed notes and only export changes for changed notes.
