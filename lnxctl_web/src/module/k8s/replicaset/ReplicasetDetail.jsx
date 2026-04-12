import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function ReplicasetDetail() {
  const dispatch = useDispatch();
  const storeReplicaset = useSelector(store.getReplicaset);
  const storeReplicasetDetailVisible = useSelector(store.getReplicasetDetailVisible);

  return (
    <>
      <Modal
        title="ReplicaSet Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeReplicasetDetailVisible}
        onCancel={() => dispatch(store.setReplicasetDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setReplicasetDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeReplicaset.namespace}</Form.Item>
          <Form.Item label="Name">{storeReplicaset.name}</Form.Item>
          <Form.Item label="Desired">{storeReplicaset.spec_replicas}</Form.Item>
          <Form.Item label="Current">{storeReplicaset.status_replicas}</Form.Item>
          <Form.Item label="Ready">{storeReplicaset.ready_replicas}</Form.Item>
          <Form.Item label="Age">{storeReplicaset.age}</Form.Item>
          <Form.Item label="Containers">
            {storeReplicaset.containers.map((item, index) => (
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

export default ReplicasetDetail;
