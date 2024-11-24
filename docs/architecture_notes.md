Terms and Definitions:

\*-----\* Hierarchy Related Terms: \*-----\*

- Parent: An object that owns children. If a parent is deleted, all of its children are deleted. If a child is deleted, it's reference is removed from the parent.
- Child: An object that is owned by a parent and dependent on its existance.

- Club: Clubs are object containers that can hold members in a 1:many relationship. Clubs and Members are only loosely related. This means that removing a member from a club does not delete a Member. Likewise, deleting a Club only removes the Club reference from the Member. They are only associated with each other via id references to illustrate affiliation.
- Member: An object that is associated with a Club.

\*-----\* State Architecture: \*-----\*

This project generates code that is intended for flat, global state objects that synchronize all clients with the server in real time. A few considerations about the state are that:

- The architecture does not support duplicate objects. If you need a 'duplicate' then make a copy so that they both have unique ids. You can then add them both to a parent object or club, depending on the use case, and change them both simultaneously like that. Multiple objects with the same id will cause one to be ignored in most cases and to also linger in memory forever. (copy\_[object] method exists for this purpose (TODO), duplicate method does not).
