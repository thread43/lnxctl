import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function DaemonsetDetail() {
  const dispatch = useDispatch();
  const storeDaemonset = useSelector(store.getDaemonset);
  const storeDaemonsetDetailVisible = useSelector(store.getDaemonsetDetailVisible);

  return (
    <>
      <Modal
        title="DaemonSet Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeDaemonsetDetailVisible}
        onCancel={() => dispatch(store.setDaemonsetDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setDaemonsetDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeDaemonset.namespace}</Form.Item>
          <Form.Item label="Name">{storeDaemonset.name}</Form.Item>
          <Form.Item label="Desired">{storeDaemonset.desired_number_scheduled}</Form.Item>
          <Form.Item label="Current">{storeDaemonset.current_number_scheduled}</Form.Item>
          <Form.Item label="Ready">{storeDaemonset.number_ready}</Form.Item>
          <Form.Item label="Up To Date">{storeDaemonset.updated_number_scheduled}</Form.Item>
          <Form.Item label="Available">{storeDaemonset.number_available}</Form.Item>
          <Form.Item label="Node Selector">
            {Object.entries(storeDaemonset.node_selector).map(([key, value]) => (
              <span key={key}>
                <div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                  {key}={value}
                </div>
              </span>
            ))}
          </Form.Item>
          <Form.Item label="Age">{storeDaemonset.age}</Form.Item>
          <Form.Item label="Containers">
            {storeDaemonset.containers !== null && storeDaemonset.containers.map((item, index) => (
              <span key={index}>
                <div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                  {item.name} ({item.image})
                </div>
              </span>
            ))}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default DaemonsetDetail;
