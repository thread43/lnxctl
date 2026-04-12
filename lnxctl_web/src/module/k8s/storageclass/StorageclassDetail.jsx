import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function StorageclassDetail() {
  const dispatch = useDispatch();
  const storeStorageclass = useSelector(store.getStorageclass);
  const storeStorageclassDetailVisible = useSelector(store.getStorageclassDetailVisible);

  return (
    <>
      <Modal
        title="StorageClass Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeStorageclassDetailVisible}
        onCancel={() => dispatch(store.setStorageclassDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setStorageclassDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Name">{storeStorageclass.name}</Form.Item>
          <Form.Item label="Provisioner">{storeStorageclass.provisioner}</Form.Item>
          <Form.Item label="Reclaim Policy">{storeStorageclass.reclaim_policy}</Form.Item>
          <Form.Item label="Volume Binding Mode">{storeStorageclass.volume_binding_mode}</Form.Item>
          <Form.Item label="Allow Volume Expansion">
            {storeStorageclass.allow_volume_expansion === true ? 'true' : 'false'}
          </Form.Item>
          <Form.Item label="Age">{storeStorageclass.age}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default StorageclassDetail;
