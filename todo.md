To actually finish project:

- General: Increase Scope of generated functions:

1. Property List Config - Set Values to number or string.

- Generate 'ia' methods to: increment, decrement, increase and decrease value.

2. Implement "Inventory.ts" methods for all ojecct types.
   See Template file "Inventory.ts" for sample implementation.
3. Create functions for managing child_id_lists based on control parameters.

- If max size is set, then we want to constrain the number of items added to the list.
- If not set or -1, then do not constrain.
- If allow empty indexes is set vs. not, we should change how the delete algorithm behaves on object deletion.

Major 2: Optional Groups

Optional groups are parent objects that do not delete children when children are removed from the gorup. All other rules apply.

1. Create UI for "Optional Groups"
2. Implement code generation to support "Optional Groups"
3. Implement generic optional group removal functiosn that are distinguisehed from those in Generic_Remove.ts

Major 3: Multiple Parent Support

Multiple parents means that an object only has one parent still, but that parent can be one of a group of parents.

This means that, as long as the object's parent isn't deleted, the object won't be deleted.

The idea behind this is that we can have, for instance, stat containers that are associated with items, players and monsters. With only one parent, then you can only have a stat container associated with one group. However, we want it shared among many. And, we also don't want to the stat container to be deleted if it's actually parent exists. like if it's on an item and an unrelated monster is deleted.

Thus, multiple parents have an 'or' relationship with each other for checks.

Will work out more logic upon implementation.

Major 4: Object Transfer

- If an object has a certain object type as a child, then it should be possible to transfer an object from one parent to another effortlessly.

Future Consideration(s):

- When doing operations on Backend_State, like 'find', etc., maybe we can cache them?
- Track changed notes and only export changes for changed notes.
