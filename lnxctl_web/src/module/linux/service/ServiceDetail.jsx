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

function ServiceDetail() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeService = useSelector(store.getService);
  const storeServiceDetailVisible = useSelector(store.getServiceDetailVisible);

  const [stateService, setStateService] = useState({});
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeService;

    try {
      setStateLoading(true);
      const response = await api.get_service(id);
      setStateService(response.data.data);
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
        title="Service Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeServiceDetailVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setServiceDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setServiceDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 12}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="ID">{stateService.id}</Form.Item>
          <Form.Item label="IP">{stateService.ip}</Form.Item>
          <Form.Item label="SSH Service">{stateService.ssh_service}</Form.Item>
          <Form.Item label="SSH Port">{stateService.ssh_port}</Form.Item>
          <Form.Item label="SSH User">{stateService.ssh_user}</Form.Item>
          <Form.Item label="SSH Password">{stateService.ssh_password}</Form.Item>
          <Form.Item label="SSH Private Key">{stateService.ssh_private_key}</Form.Item>
          <Form.Item label="Remark">{stateService.remark}</Form.Item>
          <Form.Item label="Created At">{stateService.create_time}</Form.Item>
          <Form.Item label="Updated At">{stateService.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ServiceDetail;
