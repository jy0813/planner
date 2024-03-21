export interface TaskData {
  id: number;
  name: string;
  order: number;
  subTask: SubTaskData[];
}

interface SubTaskData {
  id: number;
  name: string;
}

export interface OrderChange {
  oldOrder: number;
  newOrder: number;
}
