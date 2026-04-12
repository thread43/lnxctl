import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function PvDetail() {
  const dispatch = useDispatch();
  const storePv = useSelector(store.getPv);
  const storePvDetailVisible = useSelector(store.getPvDetailVisible);

  return (
    <>
      <Modal
        title="PV Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storePvDetailVisible}
        onCancel={() => dispatch(store.setPvDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setPvDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Name">{storePv.name}</Form.Item>
          <Form.Item label="Capacity">{storePv.capacity}</Form.Item>
          <Form.Item label="Access Modes">{storePv.access_modes.join(',')}</Form.Item>
          <Form.Item label="Reclaim Policy">{storePv.reclaim_policy}</Form.Item>
          <Form.Item label="Status">{storePv.status}</Form.Item>
          <Form.Item label="Claim">{storePv.claim}</Form.Item>
          <Form.Item label="Storage Class">{storePv.storage_class}</Form.Item>
          {/*
          <Form.Item label="Volume Attributes Class">{storePv.volume_attributes_class}</Form.Item>
          <Form.Item label="Reason">{storePv.reason}</Form.Item>
          */}
          <Form.Item label="Age">{storePv.age}</Form.Item>
          <Form.Item label="Volume Mode">{storePv.volume_mode}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default PvDetail;
