import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function ClusterrolebindingDetail() {
  const dispatch = useDispatch();
  const storeClusterrolebinding = useSelector(store.getClusterrolebinding);
  const storeClusterrolebindingDetailVisible = useSelector(store.getClusterrolebindingDetailVisible);

  return (
    <>
      <Modal
        title="ClusterRoleBinding Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeClusterrolebindingDetailVisible}
        onCancel={() => dispatch(store.setClusterrolebindingDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setClusterrolebindingDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Name">{storeClusterrolebinding.name}</Form.Item>
          <Form.Item label="Role">{storeClusterrolebinding.role}</Form.Item>
          <Form.Item label="Age">{storeClusterrolebinding.age}</Form.Item>
          <Form.Item label="Users">
            {storeClusterrolebinding.users.map((item, index) => (<div key={index}>{item}</div>))}
          </Form.Item>
          <Form.Item label="Groups">
            {storeClusterrolebinding.groups.map((item, index) => (<div key={index}>{item}</div>))}
          </Form.Item>
          <Form.Item label="ServiceAccounts">
            {storeClusterrolebinding.serviceaccounts.map((item, index) => (<div key={index}>{item}</div>))}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ClusterrolebindingDetail;
