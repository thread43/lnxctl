import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function SecretDetail() {
  const dispatch = useDispatch();
  const storeSecret = useSelector(store.getSecret);
  const storeSecretDetailVisible = useSelector(store.getSecretDetailVisible);

  return (
    <>
      <Modal
        title="Secret Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeSecretDetailVisible}
        onCancel={() => dispatch(store.setSecretDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setSecretDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeSecret.namespace}</Form.Item>
          <Form.Item label="Name">{storeSecret.name}</Form.Item>
          <Form.Item label="Type">{storeSecret.type}</Form.Item>
          <Form.Item label="Data">{storeSecret.data}</Form.Item>
          <Form.Item label="Age">{storeSecret.age}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default SecretDetail;
