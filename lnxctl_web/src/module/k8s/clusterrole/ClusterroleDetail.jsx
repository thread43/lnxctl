import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function ClusterroleDetail() {
  const dispatch = useDispatch();
  const storeClusterrole = useSelector(store.getClusterrole);
  const storeClusterroleDetailVisible = useSelector(store.getClusterroleDetailVisible);

  return (
    <>
      <Modal
        title="ClusterRole Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeClusterroleDetailVisible}
        onCancel={() => dispatch(store.setClusterroleDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setClusterroleDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Name">{storeClusterrole.name}</Form.Item>
          <Form.Item label="Created At">{storeClusterrole.created_at}</Form.Item>
          <Form.Item label="Age">{storeClusterrole.age}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ClusterroleDetail;
