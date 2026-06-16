import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function TaskFormAdd() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeTaskFormAddVisible = useSelector(store.getTaskFormAddVisible);

  const [form] = Form.useForm();

  async function add() {
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
      await api.add_task(task);
      message.success('Request succeeded', 1);
      dispatch(store.setTaskFormAddVisible(false));

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
        title="New Task"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeTaskFormAddVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setTaskFormAddVisible(false))}
        onOk={() => add()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 9}}
          wrapperCol={{span: 9}}
        >
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

export default TaskFormAdd;
