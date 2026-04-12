import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function RolebindingDetail() {
  const dispatch = useDispatch();
  const storeRolebinding = useSelector(store.getRolebinding);
  const storeRolebindingDetailVisible = useSelector(store.getRolebindingDetailVisible);

  return (
    <>
      <Modal
        title="RoleBinding Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeRolebindingDetailVisible}
        onCancel={() => dispatch(store.setRolebindingDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setRolebindingDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeRolebinding.namespace}</Form.Item>
          <Form.Item label="Name">{storeRolebinding.name}</Form.Item>
          <Form.Item label="Role">{storeRolebinding.role}</Form.Item>
          <Form.Item label="Age">{storeRolebinding.age}</Form.Item>
          <Form.Item label="Users">
            {storeRolebinding.users.map((item, index) => (<div key={index}>{item}</div>))}
          </Form.Item>
          <Form.Item label="Groups">
            {storeRolebinding.groups.map((item, index) => (<div key={index}>{item}</div>))}
          </Form.Item>
          <Form.Item label="ServiceAccounts">
            {storeRolebinding.serviceaccounts.map((item, index) => (<div key={index}>{item}</div>))}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default RolebindingDetail;
