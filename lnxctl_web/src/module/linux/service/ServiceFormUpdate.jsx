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

function ServiceFormUpdate() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeService = useSelector(store.getService);
  const storeServiceFormUpdateVisible = useSelector(store.getServiceFormUpdateVisible);

  const [stateLoading, setStateLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeService;

    try {
      setStateLoading(true);
      const response = await api.get_service(id);
      form.setFieldsValue(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function update() {
    const service = form.getFieldsValue();

    const {name} = service;
    if (name === undefined || name.trim() === '') {
      message.info('Name is required');
      return;
    }

    try {
      await api.update_service(service);
      message.success('Request succeeded', 1);
      dispatch(store.setServiceFormUpdateVisible(false));

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
        title="Edit Service"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeServiceFormUpdateVisible}
        okText="Submit"
        onCancel={() => dispatch(store.setServiceFormUpdateVisible(false))}
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

export default ServiceFormUpdate;
