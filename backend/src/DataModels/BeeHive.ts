export interface BeeHive {
  id: string;
  name: string;
  beeIds: string[]; // Array of IDs that refer to Bees
  farmId: string; // Reference to the farm it belongs to
}
