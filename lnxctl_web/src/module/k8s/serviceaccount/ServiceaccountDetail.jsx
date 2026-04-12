import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function ServiceaccountDetail() {
  const dispatch = useDispatch();
  const storeServiceaccount = useSelector(store.getServiceaccount);
  const storeServiceaccountDetailVisible = useSelector(store.getServiceaccountDetailVisible);

  return (
    <>
      <Modal
        title="ServiceAccount Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeServiceaccountDetailVisible}
        onCancel={() => dispatch(store.setServiceaccountDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setServiceaccountDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeServiceaccount.namespace}</Form.Item>
          <Form.Item label="Name">{storeServiceaccount.name}</Form.Item>
          <Form.Item label="Secrets">{storeServiceaccount.secrets}</Form.Item>
          <Form.Item label="Age">{storeServiceaccount.age}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ServiceaccountDetail;
