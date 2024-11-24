Terms and Definitions:

\*-----\* Hierarchy Related Terms: \*-----\*

- Parent: An object that owns children. If a parent is deleted, all of its children are deleted. If a child is deleted, it's reference is removed from the parent.
- Child: An object that is owned by a parent and dependent on its existance.

- Club: Clubs are object containers that can hold members in a 1:many relationship. Clubs and Members are only loosely related. This means that removing a member from a club does not delete a Member. Likewise, deleting a Club only removes the Club reference from the Member. They are only associated with each other via id references to illustrate affiliation.
- Member: An object that is associated with a Club.
