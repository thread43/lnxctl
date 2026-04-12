import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function ConfigmapDetail() {
  const dispatch = useDispatch();
  const storeConfigmap = useSelector(store.getConfigmap);
  const storeConfigmapDetailVisible = useSelector(store.getConfigmapDetailVisible);

  return (
    <>
      <Modal
        title="ConfigMap Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeConfigmapDetailVisible}
        onCancel={() => dispatch(store.setConfigmapDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setConfigmapDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeConfigmap.namespace}</Form.Item>
          <Form.Item label="Name">{storeConfigmap.name}</Form.Item>
          <Form.Item label="Data">{storeConfigmap.data}</Form.Item>
          <Form.Item label="Age">{storeConfigmap.age}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ConfigmapDetail;
