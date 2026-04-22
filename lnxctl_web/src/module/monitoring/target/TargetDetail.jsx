import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function TargetDetail() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeTarget = useSelector(store.getTarget);
  const storeTargetDetailVisible = useSelector(store.getTargetDetailVisible);

  const [stateTarget, setStateTarget] = useState({});
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const {id} = storeTarget;

    try {
      setStateLoading(true);
      const response = await api.get_target(id);
      setStateTarget(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  return (
    <>
      <Modal
        title="Target Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeTargetDetailVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setTargetDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setTargetDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="ID">{stateTarget.id}</Form.Item>
          <Form.Item label="Name">{stateTarget.name}</Form.Item>
          <Form.Item label="Crontab">{stateTarget.crontab}</Form.Item>

          <Divider />

          <Form.Item label="Type">
            {(() => {
              if (stateTarget.type === 1) {
                return 'Ping';
              } else if (stateTarget.type === 2) {
                return 'TCP';
              } else if (stateTarget.type === 3) {
                return 'HTTP';
              } else {
                return 'Unknown';
              }
            })()}
          </Form.Item>

          {stateTarget.type === 1 && (
            <Form.Item label="Ping Host">{stateTarget.ping_host}</Form.Item>
          )}

          {stateTarget.type === 2 && (
            <Form.Item label="TCP Host">{stateTarget.tcp_host}</Form.Item>
          )}
          {stateTarget.type === 2 && (
            <Form.Item label="TCP Port">{stateTarget.tcp_port}</Form.Item>
          )}

          {stateTarget.type === 3 && (
            <Form.Item label="HTTP URL">
              <div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
                {stateTarget.http_url}
              </div>
            </Form.Item>
          )}
          {/*
          {stateTarget.type === 3 && (
            <Form.Item label="HTTP Status Code">{stateTarget.http_status_code}</Form.Item>
          )}
          */}

          <Divider />

          <Form.Item label="Check Status">
            {(() => {
              if (stateTarget.check_status === 0) {
                return 'Unknown';
              } else if (stateTarget.check_status === 1) {
                return 'Succeeded';
              } else if (stateTarget.check_status === -1) {
                return 'Failed';
              } else {
                return 'Unknown';
              }
            })()}
          </Form.Item>
          <Form.Item label="Check Result">
            <div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
              {stateTarget.check_result}
            </div>
          </Form.Item>
          <Form.Item label="Check Time">{stateTarget.check_time}</Form.Item>
          <Divider />
          <Form.Item label="Is Active">{stateTarget.is_active === 1 ? 'Yes' : 'No'}</Form.Item>
          <Form.Item label="Remark">{stateTarget.remark}</Form.Item>
          <Form.Item label="Created At">{stateTarget.create_time}</Form.Item>
          <Form.Item label="Updated At">{stateTarget.update_time}</Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default TargetDetail;
