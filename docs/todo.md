To actually finish project:

---

Major 1: Optional Groups

Optional groups are parent objects that do not delete children when children are removed from the gorup. All other rules apply.

1. Create UI for "Optional Groups"
2. Implement code generation to support "Optional Groups"
3. Implement generic optional group removal functiosn that are distinguisehed from those in Generic_Remove.ts

---

Major 2: Object Transfer

- If an object has a certain object type as a child, then it should be possible to transfer an object from one parent to another effortlessly.

---

Major 3: Increase Scope of generated functions:

1. Property List Config - Set Values to number or string.

- Generate 'ia' methods to: increment, decrement, increase and decrease value.

2. Implement "Inventory.ts" methods for all ojecct types.
   See Template file "Inventory.ts" for sample implementation.
3. Create functions for managing child_id_lists based on control parameters.

- If max size is set, then we want to constrain the number of items added to the list.
- If not set or -1, then do not constrain.
- If allow empty indexes is set vs. not, we should change how the delete algorithm behaves on object deletion.

---

Major 4:

Better Reconnection support:

We currently resync with the server automatically on reconnect by 'adding' all state object records to the client.
A more sophisticated implementation would be to playback only changes that occured on disconnect.
To do that, we could probably track a few variables while a client is disconnected and replay changes based on an optimal strategy.

- Strat A: Track all changes since disconnect and resend those.
- Strat B: Track only objects that were changed since disconnect and resend those.

Based on total number of changes and number of uniquely touched objects, we can decide what playback strategy to use.
In general, the less evenly our changes are spread across different classes, the better strat A is and the reverse. Thus:

- 1 change over 1 object (or 10 over 10) = Strat A
- 100 changes over 10 objects = Strat B

Because of Project Zero, we could even exactly calculate the optimal strategy with a minimal performance hit. Project Zero can write out an estimated (or exact, if needed) object class size (in it's MO\_[object]) and use that to determine which message would be smaller: strat A or B.

---

Future Consideration(s):

- When doing operations on Backend_State, like 'find', etc., maybe we can cache them?
- Track changed notes and only export changes for changed notes.
