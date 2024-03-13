import TaskHeader from "./_components/TaskHeader";
import styles from "./Page.module.scss";

type Props = {
  searchParams: { date: string };
};

const TaskPage = ({ searchParams }: Props) => {
  return (
    <div className={styles.pageWrap}>
      <TaskHeader searchParams={searchParams} />
    </div>
  );
};

export default TaskPage;
