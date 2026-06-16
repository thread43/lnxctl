import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function TaskFormUpdate() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeTask = useSelector(store.getTask);
  const storeTaskFormUpdateVisible = useSelector(store.getTaskFormUpdateVisible);

  const [stateLoading, setStateLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeTask;

    try {
      setStateLoading(true);
      const response = await api.get_task(id);
      form.setFieldsValue(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function update() {
    const task = form.getFieldsValue();

    const {name} = task;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return;
    }

    const {command} = task;
    if (command === undefined || command.trim() === '') {
      message.info('Command is required');
      return;
    }

    try {
      await api.update_task(task);
      message.success('Request succeeded', 1);
      dispatch(store.setTaskFormUpdateVisible(false));

      dispatch(store.setTaskTableLoading(true));
      const response = await api.get_tasks();
      dispatch(store.setTasks(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setTaskTableLoading(false));
    }
  }

  return (
    <>
      <Modal
        title="Edit Task"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeTaskFormUpdateVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setTaskFormUpdateVisible(false))}
        onOk={() => update()}
        loading={stateLoading}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 9}}
          wrapperCol={{span: 9}}
        >
          <Form.Item name="id" label="ID" style={{display: 'none'}}>
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Name" required>
            <Input />
          </Form.Item>

          <Form.Item name="command" label="Command" required>
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="remark" label="Remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default TaskFormUpdate;
