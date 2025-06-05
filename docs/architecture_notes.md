**Architectural Notes: Data Hierarchy**

**Intro:**

This document outlines the data hierarchy and relationship model for a React-based full stack web project using Node.js and WebSockets (ws). The goal is to establish clear, manageable, and robust data structures for real-time state synchronization.

---

**Terms and Definitions:**

**State Architecture:**

This project generates code intended for flat, global state objects that synchronize all clients with the server in real time. Key considerations for the state include:

- **Unique Objects:** The architecture does not support duplicate objects (i.e., multiple objects with the same ID). If a logical "duplicate" is needed, create a `copy` of the object, which will assign it a unique ID. Both the original and the copy can then be added to parent objects or clubs as needed. Attempting to use multiple objects with the same ID will likely result in one being ignored and potentially causing memory leaks. A `copy_[object_type]()` method will be provided for this (TODO); a `duplicate()` method (implying shared ID) will not exist.

---

**Hierarchy Related Terms:**

Two primary types of relationships govern how objects interact and manage their lifecycles:

1.  **Parent (Object) -> Child (Object): Strong Ownership**

    - **Parent:** An object that "owns" one or more Child objects.
      - If a Parent is deleted, all of its Children are automatically deleted (cascading delete).
    - **Child:** An object that is "owned" by a Parent and is dependent on the Parent's existence for its own.
      - If a Child is deleted, its reference is removed from its Parent(s).

2.  **Club (Object) -> Member (Object): Loose Association**
    - **Club:** An object container that holds references to Member objects, typically in a one-to-many relationship. Clubs and Members are loosely related.
      - Deleting a Club **does not** delete its Members; it only removes the association (e.g., the Member's ID from the Club's list, and the Club's ID from the Member's list of affiliations).
    - **Member:** An object associated with one or more Clubs.
      - Removing a Member from a Club **does not** delete the Member object itself; it only removes the association.

---

**Hierarchy Examples:**

Consider a game with `Player`, `PlayerInventory`, `Guild`, and `GuildTreasury` objects:

1.  **Player and PlayerInventory (Parent/Child):**

    - You would model the `Player` as the `Parent` of the `PlayerInventory`. The `PlayerInventory` is a `Child`.
    - **Reasoning:** This ensures that if the `Player` object is deleted, their `PlayerInventory` is automatically cleaned up, maintaining data integrity without manual intervention.

2.  **Handling Temporary Data Preservation (e.g., "Death Screen"):**

    - If a `PlayerInventory` needs to persist temporarily after a `Player` is deleted (e.g., for a death screen loot recovery mechanic), you would:
      1.  Create a new object (e.g., `DeathLootContainer`).
      2.  Make a `copy` of the `PlayerInventory` (which gets a new unique ID).
      3.  Add this copied inventory as a `Child` to the `DeathLootContainer`.
      4.  The `DeathLootContainer` would then have its own lifecycle rules (e.g., deleted after a timer or player interaction).
    - This ensures the original `Player` can be cleanly deleted for any checks relying on its non-existence.

3.  **Guild and Player (Club/Member):**
    - We want `Player` objects to be associated with `Guild` objects.
    - Using a Parent/Child relationship here is unsuitable, as deleting a `Guild` (Parent) would undesirably delete all its `Player` (Child) objects.
    - Instead, a `Club/Member` relationship is ideal:
      - A `Guild` acts as a `Club`.
      - `Player` objects act as `Members` of the `Guild`.
      - Deleting the `Guild` (Club) only removes the association, leaving the `Player` (Member) objects intact. Similarly, a `Player` leaving a `Guild` doesn't delete the `Player`.

**Core Idea:** These data structures provide a means for objects to reference each other efficiently while also offering automatic lifecycle management and semantic clarity based on the chosen relationship type.

---

**Parent Object Specifications:**

These specifications apply specifically to the `Parent/Child` strong ownership relationship.

1.  **Multiple Parents Support:**

    - An object (`Child`) can have multiple `Parent` objects.
    - In such cases, the `Child` object will only be automatically deleted when **all** of its `Parent` objects have been deleted.
    - If the `Child` itself is deleted, its references will be removed from all its `Parent` objects.
    - **Use Case Example:** Consider a `Pet` object in a game.
      - Scenario A (Single Parent): `GameState -> Players -> Pet`. If the `Pet` is removed from `Players` (e.g., player releases pet), the `Pet` is deleted.
      - Scenario B (Multiple Parents): `GameState -> Players -> Pet` AND `GameState -> WorldSimulatedEntities -> Pet`.
        - Here, the `Pet` has two parents (e.g., a specific `PlayerLink` object under `Players`, and a `WorldLink` object under `WorldSimulatedEntities`).
        - If the player releases the `Pet`, it's removed from the `Players` parentage. However, it still exists because it's parented by `WorldSimulatedEntities`.
        - This allows the `Pet` to persist (e.g., become a wild creature) and potentially be re-encountered or re-parented later.

2.  **One Parent of Each Type Limitation:**
    - An object (`Child`) is limited to having **only one `Parent` of any given object type** (typically meaning one parent instance of a specific class/constructor).
    - **Example:** An `Inventory` object (Child) can only have one `Player` object (Parent) of type `Player`. It cannot be a direct child of two different `Player` instances. Similarly, a `House` object (Child) can only be a child of one `City` object (Parent) of type `City`.
    - **Rationale:** This rule is intentional. It enforces domain logic and prevents data states that are often illogical (e.g., a single physical inventory belonging to two separate players simultaneously). It ensures the data model directly reflects real-world or game-world constraints where an entity has a singular, specific type of owner.
    - **Addressing Scenarios that Seem to Need Multiple Parents of the Same Type:**
      - If a `Child` _conceptually_ needs to be "owned" by, or strongly linked to, multiple parent instances _of the same type_, the recommended pattern is to introduce an intermediary "container" object.
      - This intermediary container becomes the single `Parent` (of its own unique type) to the `Child`. The container object can then manage references or associations to the multiple instances it represents.
      - **Example:** If an `Artifact` (Child) _must_ be strongly owned by multiple `Vault` (Parent type) objects, you would not make `Artifact` a child of `Vault1` and `Vault2` directly. Instead, you might create `ArtifactSharedOwnership` (Parent, new type) which is a child of `Vault1` and `Vault2`, and then `Artifact` is a child of `ArtifactSharedOwnership`. Or, `Artifact` is child of an `ArtifactToVaultsLinker` (Parent, new type), and this linker then _references_ `Vault1` and `Vault2` (perhaps via IDs if the Vaults themselves are not parents of the linker). The exact structure of the container depends on the desired ownership flow.
      - While this may introduce an extra object, it maintains structural integrity and allows properties to be added to the relationship itself (via the container object) if needed in the future. It prioritizes a clear and unambiguous ownership model.
