export type RemovedLoadVisual = {
  id: string;
  title: string;
  description: string;
  kg: number;
  icon: string;
};

export type RemovedLoadResult = {
  removedKg: number;
  title: string;
  description: string;
  visuals: RemovedLoadVisual[];
  nearestVisual: RemovedLoadVisual | null;
};
