import TaskPagination from "./TaskPagination";
import TaskReservation from "./TaskReservation";

type Props = {
  searchParams: { date: string };
};

const TaskBody = ({ searchParams }: Props) => {
  return (
    <>
      <TaskPagination searchParams={searchParams} />
      <TaskReservation />
    </>
  );
};

export default TaskBody;
