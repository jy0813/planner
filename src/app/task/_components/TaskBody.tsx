import TaskPagination from "./TaskPagination";
import TaskReservation from "./TaskReservation";
import TestTaskReservation from "./TestTaskReservation";

type Props = {
  searchParams: { date: string };
};

const TaskBody = ({ searchParams }: Props) => {
  return (
    <>
      <TaskPagination searchParams={searchParams} />
      <TestTaskReservation />
      {/* <TaskReservation /> */}
    </>
  );
};

export default TaskBody;
