import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function ServiceFormAdd() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeServiceFormAddVisible = useSelector(store.getServiceFormAddVisible);

  const [form] = Form.useForm();

  async function add() {
    const service = form.getFieldsValue();

    const {name} = service;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return;
    }

    try {
      await api.add_service(service);
      message.success('Request succeeded', 1);
      dispatch(store.setServiceFormAddVisible(false));

      dispatch(store.setServiceTableLoading(true));
      const response = await api.get_services();
      dispatch(store.setServices(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setServiceTableLoading(false));
    }
  }

  return (
    <>
      <Modal
        title="New Service"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeServiceFormAddVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setServiceFormAddVisible(false))}
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

          <Form.Item name="term_cmd" label="Terminal Command">
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

export default ServiceFormAdd;
