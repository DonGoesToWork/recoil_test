Terms and Definitions:

\*-----\* State Architecture: \*-----\*

This project generates code that is intended for flat, global state objects that synchronize all clients with the server in real time. A few considerations about the state are that:

- The architecture does not support duplicate objects. If you need a 'duplicate' then make a copy so that they both have unique ids. You can then add them both to a parent object or club, depending on the use case, and change them both simultaneously like that. Multiple objects with the same id will cause one to be ignored in most cases and to also linger in memory forever. (copy\_[object] method exists for this purpose (TODO), duplicate method does not).

\*-----\* Hierarchy Related Terms: \*-----\*

- Parent: An object that owns children. If a parent is deleted, all of its children are deleted. If a child is deleted, it's reference is removed from the parent.
- Child: An object that is owned by a parent and dependent on its existance.

- Club: Clubs are object containers that can hold members in a 1:many relationship. Clubs and Members are only loosely related. This means that removing a member from a club does not delete a Member. Likewise, deleting a Club only removes the Club reference from the Member. They are only associated with each other via id references to illustrate affiliation.
- Member: An object that is associated with a Club.

\*-----\* Parent Object Specifications: \*-----\*

- Multiple PArents Note:

This application supports objects having multiple parents. However, do note that parent-logic still applies to children with multiple parents. This means that, if a child is removed from either parent, or either parent is destroyed, the child will be destroyed too.

In most cases, you will probably want a child with one parent and one or more clubs because, really, there aren't too many use cases for one child to many parent setups.

But, that doesn't mean that there are no use cases. For example, the perhaps most ideal use case would be to support a temporary transaction between two objects. In a game setting, this might look like a player trading with an NPC.

If either the player or the NPC chooses to end the transaction, then the whole transaction should be deleted. This object arrangement makes sense because the reverse case, two player children to one parent transaction, would entail that both player objects are deleted once the transaction is deleted, which isn't what we want.

This is also a time to note that we would also likely want to use a transaction object as a child in this case, as opposed to manual controls, to gain all of the benefits that Project Zero's automatic code generation system provides.
