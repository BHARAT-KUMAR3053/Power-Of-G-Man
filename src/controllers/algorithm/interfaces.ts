export interface PriorityQueueItem {
  val: string;
  priority: number;
}

export interface AdjacencyQueueItem {
  node: string;
  weight: number;
}

export interface IAdjacencyList {
  [key: string]: AdjacencyQueueItem[];
}

export type Direction = 'n' | 'e' | 'w' | 's';
