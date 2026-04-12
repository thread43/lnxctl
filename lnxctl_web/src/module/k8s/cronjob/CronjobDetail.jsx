import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import store from './store.js';

function CronjobDetail() {
  const dispatch = useDispatch();
  const storeCronjob = useSelector(store.getCronjob);
  const storeCronjobDetailVisible = useSelector(store.getCronjobDetailVisible);

  return (
    <>
      <Modal
        title="CronJob Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeCronjobDetailVisible}
        onCancel={() => dispatch(store.setCronjobDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setCronjobDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Namespace">{storeCronjob.namespace}</Form.Item>
          <Form.Item label="Name">{storeCronjob.name}</Form.Item>
          <Form.Item label="Schedule">{storeCronjob.schedule}</Form.Item>
          <Form.Item label="Timezone">{storeCronjob.timezone}</Form.Item>
          <Form.Item label="Suspend">{storeCronjob.suspend === false ? 'False' : 'True'}</Form.Item>
          <Form.Item label="Active">{storeCronjob.active}</Form.Item>
          <Form.Item label="Last Schedule">{storeCronjob.last_schedule}</Form.Item>
          <Form.Item label="Age">{storeCronjob.age}</Form.Item>
          <Form.Item label="Containers">
            {storeCronjob.containers.map((item, index) => (
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

export default CronjobDetail;
