import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function IngressDetail() {
  const dispatch = useDispatch();
  const storeIngress = useSelector(store.getIngress);
  const storeIngressDetailVisible = useSelector(store.getIngressDetailVisible);

  return (
    <>
      <Modal
        title="Ingress Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeIngressDetailVisible}
        onCancel={() => dispatch(store.setIngressDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setIngressDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeIngress.namespace}</Form.Item>
          <Form.Item label="Name">{storeIngress.name}</Form.Item>
          <Form.Item label="Hosts">
            {storeIngress.hosts.map((item, index) => (<div key={index}>{item}</div>))}
          </Form.Item>
          <Form.Item label="Age">{storeIngress.age}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default IngressDetail;
