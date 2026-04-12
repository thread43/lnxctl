import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function NetworkDetail() {
  const dispatch = useDispatch();
  const storeNetwork = useSelector(store.getNetwork);
  const storeNetworkDetailVisible = useSelector(store.getNetworkDetailVisible);

  return (
    <>
      <Modal
        title="Network Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeNetworkDetailVisible}
        onCancel={() => dispatch(store.setNetworkDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setNetworkDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Network ID">{storeNetwork.network_id_raw}</Form.Item>
          <Form.Item label="Name">{storeNetwork.name}</Form.Item>
          <Form.Item label="Driver">{storeNetwork.driver}</Form.Item>
          <Form.Item label="Scope">{storeNetwork.scope}</Form.Item>
          <Form.Item label="Created At">{storeNetwork.created}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default NetworkDetail;
