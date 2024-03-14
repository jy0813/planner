import TaskPagination from "./TaskPagination";
import TaskReservation from "./TaskReservation";

type Props = {
  searchParams: { date: string };
};

const TaskBody = ({ searchParams }: Props) => {
  return (
    <div>
      <TaskPagination searchParams={searchParams} />
      <TaskReservation />
    </div>
  );
};

export default TaskBody;
