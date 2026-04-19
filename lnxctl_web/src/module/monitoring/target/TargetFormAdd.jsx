import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import {Radio} from 'antd';
import api from './api.js';
import store from './store.js';

function TargetFormAdd() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeTargetFormAddVisible = useSelector(store.getTargetFormAddVisible);

  const [form] = Form.useForm();

  async function add() {
    const target = form.getFieldsValue();

    const {name, crontab} = target;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return;
    }
    if (crontab === undefined || crontab.trim() === '') {
      message.info('Crontab is required');
      return;
    }

    const {type} = target;
    if (type === 1) {
      const {ping_host} = target;
      if (ping_host === undefined || ping_host.trim() === '') {
        message.info('Ping Host is required');
        return;
      }
    }
    if (type === 2) {
      const {tcp_host, tcp_port} = target;
      if (tcp_host === undefined || tcp_host.trim() === '') {
        message.info('TCP Host is required');
        return;
      }
      if (tcp_port === undefined || tcp_port.trim() === '') {
        message.info('TCP Port is required');
        return;
      }
    }
    if (type === 3) {
      const {http_url, http_status_code} = target;
      if (http_url === undefined || http_url.trim() === '') {
        message.info('HTTP URL is required');
        return;
      }
      if (http_status_code === undefined || http_status_code.trim() === '') {
        message.info('HTTP Status Code is required');
        return;
      }
    }

    try {
      await api.add_target(target);
      message.success('Request succeeded', 1);
      dispatch(store.setTargetFormAddVisible(false));

      dispatch(store.setTargetTableLoading(true));
      const response = await api.get_targets();
      dispatch(store.setTargets(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setTargetTableLoading(false));
    }
  }

  return (
    <>
      <Modal
        title="New Target"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeTargetFormAddVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setTargetFormAddVisible(false))}
        onOk={() => add()}
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{span: 9}}
          wrapperCol={{span: 12}}
          initialValues={{
            crontab: '* * * * *',
            type: 1,
            is_active: 1,
          }}
        >
          <Form.Item name="name" label="Name" required>
            <Input />
          </Form.Item>

          <Form.Item name="crontab" label="Crontab" required>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Type" required>
            <Radio.Group>
              <Radio value={1}>Ping</Radio>
              <Radio value={2}>TCP</Radio>
              <Radio value={3}>HTTP</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="ping_host" label="Ping Host">
            <Input />
          </Form.Item>

          <Form.Item name="tcp_host" label="TCP Host">
            <Input />
          </Form.Item>

          <Form.Item name="tcp_port" label="TCP Port">
            <Input />
          </Form.Item>

          <Form.Item name="http_url" label="HTTP URL">
            <Input />
          </Form.Item>

          <Form.Item name="http_status_code" label="HTTP Status Code">
            <Input />
          </Form.Item>

          <Form.Item name="is_active" label="Is Active" required>
            <Radio.Group>
              <Radio value={1}>Yes</Radio>
              <Radio value={0}>No</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="remark" label="Remark">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default TargetFormAdd;
