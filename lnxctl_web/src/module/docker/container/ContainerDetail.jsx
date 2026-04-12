import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
// import {Tag} from 'antd';
import store from './store.js';

function ContainerDetail() {
  const dispatch = useDispatch();
  const storeContainer = useSelector(store.getContainer);
  const storeContainerDetailVisible = useSelector(store.getContainerDetailVisible);

  return (
    <>
      <Modal
        title="Container Detail"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeContainerDetailVisible}
        onCancel={() => dispatch(store.setContainerDetailVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setContainerDetailVisible(false))}>Close</Button>,
        ]}
      >
        <Form layout="horizontal" labelCol={{span: 9}} wrapperCol={{span: 12}} className="MyForm">
          <Form.Item label="Container ID">{storeContainer.container_id_raw}</Form.Item>
          <Form.Item label="Name">{storeContainer.name_raw}</Form.Item>
          <Form.Item label="Image">{storeContainer.image}</Form.Item>
          <Form.Item label="Created At">{storeContainer.created}</Form.Item>
          <Form.Item label="Status">{storeContainer.status}</Form.Item>
          <Form.Item label="State">{storeContainer.state}</Form.Item>
          <Form.Item label="Command">{storeContainer.command}</Form.Item>
          <Form.Item label="Network">{storeContainer.network_mode}</Form.Item>
          <Form.Item label="IP">{storeContainer.ip_address}</Form.Item>
          <Form.Item label="Ports">
            {storeContainer.ports2.map((item, index) => (<div key={index}>{item}</div>))}
            {/*
            {storeContainer.ports.map((item, index) => (
              <>
                {item.ip !== '' ? (
                  <div key={index}>
                    <Tag variant="outlined">{item.ip_public_port}</Tag>
                    &nbsp;-&gt;&nbsp;
                    <Tag variant="outlined">{item.private_port_type}</Tag>
                  </div>
                ) : (
                  <div key={index}>
                    <Tag variant="outlined">{item.private_port_type}</Tag>
                  </div>
                )}
              </>
            ))}
            */}
          </Form.Item>
          <Form.Item label="Mounts (bind)">
            {storeContainer.mounts2.map((item, index) => (<div key={index}>{item}</div>))}
            {/*
            {storeContainer.mounts.map((item, index) => (
              <div key={index}>
                <Tag variant="outlined">{item.source}</Tag>
                &nbsp;:&nbsp;
                <Tag variant="outlined">{item.destination}</Tag>
              </div>
            ))}
            */}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ContainerDetail;
