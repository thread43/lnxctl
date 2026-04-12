import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function JobDetail() {
  const dispatch = useDispatch();
  const storeJob = useSelector(store.getJob);
  const storeJobDetailVisible = useSelector(store.getJobDetailVisible);

  return (
    <>
      <Modal
        title="Job Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeJobDetailVisible}
        onCancel={() => dispatch(store.setJobDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setJobDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeJob.namespace}</Form.Item>
          <Form.Item label="Name">{storeJob.name}</Form.Item>
          <Form.Item label="Status">{storeJob.status}</Form.Item>
          <Form.Item label="Completions">{storeJob.succeeded}/{storeJob.completions}</Form.Item>
          <Form.Item label="Duration">{storeJob.duration}</Form.Item>
          <Form.Item label="Age">{storeJob.age}</Form.Item>
          <Form.Item label="Containers">
            {storeJob.containers.map((item, index) => (
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

export default JobDetail;
