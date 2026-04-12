import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function RoleDetail() {
  const dispatch = useDispatch();
  const storeRole = useSelector(store.getRole);
  const storeRoleDetailVisible = useSelector(store.getRoleDetailVisible);

  return (
    <>
      <Modal
        title="Role Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeRoleDetailVisible}
        onCancel={() => dispatch(store.setRoleDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setRoleDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeRole.namespace}</Form.Item>
          <Form.Item label="Name">{storeRole.name}</Form.Item>
          <Form.Item label="Created At">{storeRole.created_at}</Form.Item>
          <Form.Item label="Age">{storeRole.age}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default RoleDetail;
