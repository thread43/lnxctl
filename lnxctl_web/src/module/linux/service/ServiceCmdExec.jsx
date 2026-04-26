import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import {Space} from 'antd';
import {CaretRightOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function ServiceCmdExec() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeService = useSelector(store.getService);
  const storeServiceCmdExecVisible = useSelector(store.getServiceCmdExecVisible);

  const [stateService, setStateService] = useState({
    cmd_exit_code: 'Executing...',
    cmd_output: 'Executing...',
  });

  useEffect(() => {
    init();

    return () => {
      dispatch(store.setService({}));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const id = storeService.id;
    const action = storeService.action;

    let response = null;

    try {
      if (action === 'start') {
        response = await api.start_service(id);
      }
      if (action === 'stop') {
        response = await api.stop_service(id);
      }
      if (action === 'restart') {
        response = await api.restart_service(id);
      }
      if (action === 'reload') {
        response = await api.reload_service(id);
      }
      if (action === 'status') {
        response = await api.status_service(id);
      }
      setStateService(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      //
    }
  }

  return (
    <>
      <Modal
        title="Service CMD Execution"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={600}
        // maskClosable={false}
        open={storeServiceCmdExecVisible}
        onCancel={() => dispatch(store.setServiceCmdExecVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setServiceCmdExecVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="vertical" className="MyForm">
          <Form.Item label={<span className="Underline"><CaretRightOutlined />&nbsp;Name</span>}>
            {storeService.name}
          </Form.Item>
          {storeService.action === 'start' && (
            <Form.Item label={<span className="Underline"><CaretRightOutlined />&nbsp;Start CMD</span>}>
              {storeService.start_cmd}
            </Form.Item>
          )}
          {storeService.action === 'stop' && (
            <Form.Item label={<span className="Underline"><CaretRightOutlined />&nbsp;Stop CMD</span>}>
              {storeService.stop_cmd}
            </Form.Item>
          )}
          {storeService.action === 'restart' && (
            <Form.Item label={<span className="Underline"><CaretRightOutlined />&nbsp;Restart CMD</span>}>
              {storeService.restart_cmd}
            </Form.Item>
          )}
          {storeService.action === 'reload' && (
            <Form.Item label={<span className="Underline"><CaretRightOutlined />&nbsp;Reload CMD</span>}>
              {storeService.reload_cmd}
            </Form.Item>
          )}
          {storeService.action === 'status' && (
            <Form.Item label={<span className="Underline"><CaretRightOutlined />&nbsp;Status CMD</span>}>
              {storeService.status_cmd}
            </Form.Item>
          )}
          <Form.Item label={<span className="Underline"><CaretRightOutlined />&nbsp;Exit Code</span>}>
            {stateService.cmd_exit_code}
          </Form.Item>
          <Form.Item label={<span className="Underline"><CaretRightOutlined />&nbsp;Output</span>}>
            <pre style={{background: '#000', color: '#fff', padding: '5px'}}>
              {stateService.cmd_output}
            </pre>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ServiceCmdExec;
