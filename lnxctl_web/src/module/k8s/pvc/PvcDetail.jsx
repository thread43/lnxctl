import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function PvcDetail() {
  const dispatch = useDispatch();
  const storePvc = useSelector(store.getPvc);
  const storePvcDetailVisible = useSelector(store.getPvcDetailVisible);

  return (
    <>
      <Modal
        title="PVC Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storePvcDetailVisible}
        onCancel={() => dispatch(store.setPvcDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setPvcDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storePvc.namespace}</Form.Item>
          <Form.Item label="Name">{storePvc.name}</Form.Item>
          <Form.Item label="Status">{storePvc.status}</Form.Item>
          <Form.Item label="Volume">{storePvc.volume}</Form.Item>
          <Form.Item label="Capacity">{storePvc.capacity}</Form.Item>
          <Form.Item label="Access Modes">{storePvc.access_modes.join(',')}</Form.Item>
          <Form.Item label="Storage Class">{storePvc.storage_class}</Form.Item>
          {/*
          <Form.Item label="Volume Attributes Class">{storePvc.volume_attributes_class}</Form.Item>
          */}
          <Form.Item label="Age">{storePvc.age}</Form.Item>
          <Form.Item label="Volume Mode">{storePvc.volume_mode}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default PvcDetail;
