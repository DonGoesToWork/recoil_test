Terms and Definitions:

\*-----\* State Architecture: \*-----\*

This project generates code that is intended for flat, global state objects that synchronize all clients with the server in real time. A few considerations about the state are that:

- The architecture does not support duplicate objects. If you need a 'duplicate' then make a copy so that they both have unique ids. You can then add them both to a parent object or club, depending on the use case, and change them both simultaneously like that. Multiple objects with the same id will cause one to be ignored in most cases and to also linger in memory forever. (copy\_[object] method exists for this purpose (TODO), duplicate method does not).

\*-----\* Hierarchy Related Terms: \*-----\*

- Parent: An object that owns children. If a parent is deleted, all of its children are deleted. If a child is deleted, it's reference is removed from its parent.
- Child: An object that is owned by a parent and dependent on its existance.

- Club: Clubs are object containers that can hold members in a 1:many relationship. Clubs and Members are only loosely related. This means that removing a member from a club does not delete a Member. Likewise, deleting a Club only removes the Club reference from the Member. They are only associated with each other via id references to illustrate affiliation.
- Member: An object that is associated with a Club.

\*-----\* Parent Object Specifications: \*-----\*

- Multiple Parents Note:

This application supports objects having multiple parents. In cases with multiple parents, a child will only be automatically deleted once all of its parents are deleted. Though, if the child is deleted, all of its references inside of parents will be deleted.

In most cases, you will probably want a child with one parent and one or more clubs because, really, there aren't too many use cases for 'one child to many parents' setups.

But, that doesn't mean that there are no use cases. For example, you might want to put a child among several parents so that it isn't immediately deleted when removed from one.

For instance, let's say we have an architecture of 'root game state -> players -> pets'. In this case, if the player let's go of a pet, it would be removed from 'players' and deleted. However, if we have this architecture 'root -> players -> pets & root -> pets', then we can remove the pet from the player and it won't be deleted. And then we can evne add the pet to something else, like a 'Wilderness Monsters' club, to have it be simulated as roaming the world to get stronger and perhaps even lead to the player encountering the pet again someday as a wild beast. Fun right?

- One Parent of Each Type Limitation:

The application limits the number of parents that you can have of each type to 1. This is very intentional. And, the reason why is because, if you intend to have a child go to more than one object of the same type, you should almost definitely create a parent object type container instead and link the child object to this.

Yes, there may be cases where this adds another object type with only one member in a potentially very trivial case. For instance, if you have a game with players that can be in multiple guilds, you now need a 'Multiple Guilds'-type object to capture that.

However, it's the best architectural decision because, If you ever decide that you need to add properties to the parent container (like 'Multiple Guilds'), your data is already setup to add properties at will. (which is a huge goal of this architecture -> never refactor!)

- Makes immediately and directly available all children of the parent container in more complex cases. (Imagine a large chat program with tags users can grab to 'subscribe' to multiple rooms. In this case, the tag could be a parent of the rooms chat groups and chat channels and you want to get everybody within the chat groups ) (efficiency is too a huge)

you visualize the architecutre, then you actually

potentially very trivial cases. For instance, if you have a player that should be a part of multiple guilds, then you'd suddenly need a "Guild Container" object to encapsulate that.

But, in general, most situations will call for some kind of
Yes, this can be to a given architecture. However, in truth, you
