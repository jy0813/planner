export interface TaskData {
  id: number;
  name: string;
  subTask: SubTaskData[];
}

interface SubTaskData {
  id: number;
  name: string;
}
