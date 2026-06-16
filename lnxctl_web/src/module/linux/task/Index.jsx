import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import TaskRun from './TaskRun.jsx';
import TaskDetail from './TaskDetail.jsx';
import TaskFormAdd from './TaskFormAdd.jsx';
import TaskFormUpdate from './TaskFormUpdate.jsx';
import TaskList from './TaskList.jsx';
import store from './store.js';

function Task() {
  const storeTaskDetailVisible = useSelector(store.getTaskDetailVisible);
  const storeTaskFormAddVisible = useSelector(store.getTaskFormAddVisible);
  const storeTaskFormUpdateVisible = useSelector(store.getTaskFormUpdateVisible);
  const storeTaskRunVisible = useSelector(store.getTaskRunVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/linux">Linux</Link>},
          {title: 'Task List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent">
        <TaskList />
      </Layout.Content>

      {storeTaskDetailVisible === true && <TaskDetail />}
      {storeTaskFormAddVisible === true && <TaskFormAdd />}
      {storeTaskFormUpdateVisible === true && <TaskFormUpdate />}
      {storeTaskRunVisible === true && <TaskRun/>}
    </>
  );
}

export default Task;
