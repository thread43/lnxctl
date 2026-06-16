import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function TaskDetail() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeTask = useSelector(store.getTask);
  const storeTaskDetailVisible = useSelector(store.getTaskDetailVisible);

  const [stateTask, setStateTask] = useState({});
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeTask;

    try {
      setStateLoading(true);
      const response = await api.get_task(id);
      setStateTask(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  return (
    <>
      <Modal
        title="Task Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeTaskDetailVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setTaskDetailVisible(false))}
        footer={[
          <Button
            key="close"
            onClick={() => dispatch(store.setTaskDetailVisible(false))}
          >
            Close
          </Button>,
        ]}
      >
        <Form
          layout="horizontal"
          labelCol={{span: 12}}
          wrapperCol={{span: 12}}
          className="MyForm"
        >
          <Form.Item label="ID">{stateTask.id}</Form.Item>
          <Form.Item label="Name">{stateTask.name}</Form.Item>
          <Form.Item label="Command">{stateTask.command}</Form.Item>
          <Form.Item label="Remark">{stateTask.remark}</Form.Item>
          <Form.Item label="Created At">{stateTask.create_time}</Form.Item>
          <Form.Item label="Updated At">{stateTask.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default TaskDetail;
