import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Form} from 'antd';
import {Select} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {UndoOutlined} from '@ant-design/icons';
import api from './api.js';
import commonStore from '../common/store.js';
import store from './store.js';

function NetworkList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const commonStoreContext = useSelector(commonStore.getContext);
  const commonStoreServers = useSelector(commonStore.getServers);
  const storeNetworks = useSelector(store.getNetworks);
  const storeNetworkTableLoading = useSelector(store.getNetworkTableLoading);

  const [form] = Form.useForm();

  useEffect(() => {
    init(commonStoreContext);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init(context) {
    let {server_id} = context;

    server_id = localStorage.getItem('docker_server_id');
    if (server_id !== null) {
      server_id = parseInt(server_id, 10);
    }

    form.resetFields();

    try {
      dispatch(store.setNetworkTableLoading(true));

      const response = await api.get_servers();
      dispatch(commonStore.setServers(response.data.data));

      const servers = response.data.data;
      if (servers.length === 0) {
        message.info('Server not found');
        return;
      }

      if (server_id === undefined || server_id === null) {
        server_id = servers[0].id;
        dispatch(commonStore.setContext({server_id}));
      }

      form.setFieldsValue({server_id});

      const response2 = await api.get_networks(server_id);
      if (response2.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setNetworks(response2.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setNetworkTableLoading(false));
    }
  }

  async function changeServer(value) {
    const server_id = value;

    localStorage.setItem('docker_server_id', server_id);

    dispatch(commonStore.setContext({server_id}));
    dispatch(store.setNetworks([]));

    try {
      dispatch(store.setNetworkTableLoading(true));
      const response = await api.get_networks(server_id);
      if (response.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setNetworks(response.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setNetworkTableLoading(false));
    }
  }

  function getNetwork(network) {
    dispatch(store.setNetwork(network));
    dispatch(store.setNetworkDetailVisible(true));
  }

  function inspectNetwork(network) {
    dispatch(store.setNetwork(network));
    dispatch(store.setNetworkJsonVisible(true));
  }

  function refresh() {
    search();
  }

  function reset() {
    localStorage.removeItem('docker_server_id');

    const context = {};
    dispatch(commonStore.setContext({}));
    init(context);
  }

  async function search() {
    const form_value = form.getFieldsValue();
    const server_id = form_value.server_id;

    try {
      dispatch(store.setNetworkTableLoading(true));
      const response = await api.get_networks(server_id);
      if (response.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setNetworks(response.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setNetworkTableLoading(false));
    }
  }

  const columns = [
    {
      key: 'network_id',
      title: 'Network ID',
      dataIndex: 'network_id',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getNetwork(record)}>{text}</Button>
      ),
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'driver',
      title: 'Driver',
      dataIndex: 'driver',
    },
    {
      key: 'scope',
      title: 'Scope',
      dataIndex: 'scope',
    },
    {
      key: 'created',
      title: 'Created At',
      dataIndex: 'created',
    },
    {
      key: 'actions',
      title: 'Actions',
      fixed: 'right',
      render: (record) => (
        <>
          <Button type="link" className="ButtonLink" onClick={() => inspectNetwork(record)}>Inspect</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentBlock">
        <Form form={form} name="horizontal_login" layout="inline">
          <Form.Item name="server_id" label="Server" style={{marginTop: '2px'}}>
            <Select
              allowClear={false}
              style={{width: 200}}
              onChange={(value) => changeServer(value)}
              options={commonStoreServers.map((item) => (
                {value: item.id, label: item.name}
              ))}
            />
          </Form.Item>
          <Form.Item style={{marginTop: '2px'}}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={() => search()}>Search</Button>
              <Button type="primary" icon={<UndoOutlined />} onClick={() => reset()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className="MyContentDivider"></div>

      <div className="MyContentBlock">
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">Network List</span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          // rowKey="id"
          rowKey={(record) => record.id+record.repo_tag}
          columns={columns}
          dataSource={storeNetworks}
          loading={storeNetworkTableLoading}
          pagination={false}
          showSorterTooltip={false}
          size="small"
          scroll={{x: 'max-content'}}
        />
      </div>
    </>
  );
}

export default NetworkList;
