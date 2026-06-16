import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import {Tag} from 'antd';
import {CaretRightOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function TaskRun() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeTask = useSelector(store.getTask);
  const storeTaskRunVisible = useSelector(store.getTaskRunVisible);

  const [stateTask, setStateTask] = useState({
    cmd_exit_code: null,
    cmd_output: 'Executing...',
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    init();

    return () => {
      dispatch(store.setTask({}));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeTask;

    try {
      const response = await api.run_task(id);
      setStateTask(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      //
    }
  }

  return (
    <>
      <Modal
        title="Task CMD Execution"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={1000}
        // maskClosable={false}
        open={storeTaskRunVisible}
        onCancel={() => dispatch(store.setTaskRunVisible(false))}
        footer={[
          <Button
            key="close"
            onClick={() => dispatch(store.setTaskRunVisible(false))}
          >
            Close
          </Button>,
        ]}
      >
        <Form layout="vertical" className="MyForm">
          <Form.Item
            label={
              <span className="Underline">
                <CaretRightOutlined />&nbsp;Name
              </span>
            }
          >
            {storeTask.name}
          </Form.Item>
          <Form.Item
            label={
              <span className="Underline">
                <CaretRightOutlined />&nbsp;Command
              </span>
            }
          >
            <pre style={{margin: 0, padding: 0}}>
              {storeTask.command}
            </pre>
          </Form.Item>
          <Form.Item
            label={
              <span className="Underline">
                <CaretRightOutlined />&nbsp;Exit Status
              </span>
            }
          >
            {stateTask.cmd_exit_code === null && (
              <span><Tag>Executing...</Tag>&nbsp;<SyncOutlined spin /></span>
            )}
            {stateTask.cmd_exit_code === 0 && (
              <span><Tag color="success">Succeeded</Tag></span>
            )}
            {stateTask.cmd_exit_code === 1 && (
              <span><Tag color="error">Failed</Tag></span>
            )}
            &nbsp;
            {stateTask.cmd_error_msg}
          </Form.Item>
          <Form.Item
            label={
              <span className="Underline">
                <CaretRightOutlined />&nbsp;Output
              </span>
            }
          >
            <pre style={{background: '#000', color: '#fff', padding: '5px'}}>
              {stateTask.cmd_output}
            </pre>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default TaskRun;
