To actually finish project:

High Priority TODO:

- Generate Sample Interactions Files in Interactions Folder.

OLn front-end, need to actually handle numbers?

Future Consideration: When doing operations on state maps, like 'find', etc., maybe we can cache them?

TODO:
o Implement schema import and schema export functionality.

- Confirmation buttons on import/export buttons.
- Track changed notes and only export changes for changed notes.
- Put types onto properties. Generate additional functions based on property types.
- Generate additional functions based on types aside from 'set'.
  - All properties get a 'get' method (to compliment 'set' method) to get an object value from an id alone. (Idea is to avoid needing to pass class name parameter, it will be baked into function name when called.)
  - Numbers get increment, decrement, increase, decrease, set by default.
  - Arrays can be either normal or condensed.
    - Normal arrays have fixed number of indexes and can have empty index positions.
    - Condensed arrays auto-shrink.
    - Arrays have methods to interact with indexes: get, remove, push, pop.

Need to also have an 'Interactions' list that lists user interactions that will need to be mapped to the back-end.
For Interactions, we will need to have some kind of means to ensure that we fill the required functions in, like abstract classes or something.

Dealt with already:

- Class Names ffile is redundant.
- Finish individual entries tab.
  x Make "Child Name List" and "Properties" fields on web page nice tables with add row/delete/edit functionality.
