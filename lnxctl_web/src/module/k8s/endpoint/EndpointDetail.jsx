import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function EndpointDetail() {
  const dispatch = useDispatch();
  const storeEndpoint = useSelector(store.getEndpoint);
  const storeEndpointDetailVisible = useSelector(store.getEndpointDetailVisible);

  return (
    <>
      <Modal
        title="Endpoint Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeEndpointDetailVisible}
        onCancel={() => dispatch(store.setEndpointDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setEndpointDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeEndpoint.namespace}</Form.Item>
          <Form.Item label="Name">{storeEndpoint.name}</Form.Item>
          <Form.Item label="Endpoints">
            {storeEndpoint.address_ports.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </Form.Item>
          <Form.Item label="Age">{storeEndpoint.age}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default EndpointDetail;
