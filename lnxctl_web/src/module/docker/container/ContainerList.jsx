import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Dropdown} from 'antd';
import {Form} from 'antd';
import {Select} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Tag} from 'antd';
import {MoreOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SearchOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {UndoOutlined} from '@ant-design/icons';
import api from './api.js';
import commonStore from '../common/store.js';
import store from './store.js';
import externalLinkIcon from '/src/static/external-link.svg';
import folderIcon from '/src/static/folder-open.svg';
import terminalIcon from '/src/static/terminal-box-fill.svg';

function ContainerList() {
  const {message} = App.useApp();
  const {modal} = App.useApp();

  const dispatch = useDispatch();
  const commonStoreContext = useSelector(commonStore.getContext);
  const commonStoreServers = useSelector(commonStore.getServers);
  const storeContainers = useSelector(store.getContainers);
  const storeContainerTableLoading = useSelector(store.getContainerTableLoading);

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
      dispatch(store.setContainerTableLoading(true));

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

      const response2 = await api.get_containers(server_id);
      if (response2.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setContainers(response2.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setContainerTableLoading(false));
    }
  }

  async function changeServer(value) {
    const server_id = value;

    localStorage.setItem('docker_server_id', server_id);

    dispatch(commonStore.setContext({server_id}));
    dispatch(store.setContainers([]));

    try {
      dispatch(store.setContainerTableLoading(true));
      const response = await api.get_containers(server_id);
      if (response.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setContainers(response.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setContainerTableLoading(false));
    }
  }

  function getContainer(container) {
    dispatch(store.setContainer(container));
    dispatch(store.setContainerDetailVisible(true));
  }

  function getContainerLog(container) {
    dispatch(store.setContainer(container));
    dispatch(store.setContainerLogVisible(true));
  }

  function inspectContainer(container) {
    dispatch(store.setContainer(container));
    dispatch(store.setContainerJsonVisible(true));
  }

  function openContainerTerminal(container) {
    dispatch(store.setContainer(container));
    dispatch(store.setContainerTerminalVisible(true));
  }

  function openContainerFileBrowser(container) {
    dispatch(store.setContainer(container));
    dispatch(store.setContainerFileBrowserVisible(true));
  }

  function openContainerTerminalExt(container) {
    const server_id = commonStoreContext.server_id;
    const container_id = container.container_id;
    const container_name = container.name;

    let url = '/#/docker/container/terminal_ext';
    url = url + '?server_id=' + server_id;
    url = url + '&container_id=' + container_id;
    url = url + '&container_name=' + container_name;
    console.log(url);

    window.open(url, '_blank');
  }

  function restartContainer(container) {
    modal.confirm({
      title: (<span style={{fontWeight: 'normal'}}>Are you sure you want to restart?</span>),
      content: container.name,
      okText: 'Yes',
      cancelText: 'No',
      icon: (<QuestionCircleOutlined style={{color: 'red'}} />),
      styles: {mask: {opacity: '0.1', animation: 'none'}},
      maskClosable: true,
      onOk() {
        restartContainer2(container);
      },
      onCancel() {
      },
    });
  }

  async function restartContainer2(container) {
    const {server_id, container_id} = container;

    try {
      dispatch(store.setContainerTableLoading(true));
      await api.restart_container(server_id, container_id);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setContainerTableLoading(false));
    }

    refresh();
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
      dispatch(store.setContainerTableLoading(true));
      const response = await api.get_containers(server_id);
      if (response.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setContainers(response.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setContainerTableLoading(false));
    }
  }

  const columns = [
    {
      key: 'container_id',
      title: 'Container ID',
      dataIndex: 'container_id',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getContainer(record)}>{text}</Button>
      ),
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'image',
      title: 'Image',
      dataIndex: 'image',
    },
    {
      key: 'created',
      title: 'Created At',
      dataIndex: 'created',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
    },
    {
      key: 'state',
      title: 'State',
      dataIndex: 'state',
      render: (text) => {
        if (text === 'running') {
          return (<span><Tag color="success">{text}</Tag></span>);
        } else {
          return (<span><Tag>{text}</Tag></span>);
        }
      }
    },
    {
      key: 'command',
      title: 'Command',
      dataIndex: 'command',
    },
    {
      key: 'network_mode',
      title: 'Network',
      dataIndex: 'network_mode',
    },
    {
      key: 'ip_address',
      title: 'IP',
      dataIndex: 'ip_address',
    },
    /*
    {
      key: 'ports2',
      title: 'Ports',
      dataIndex: 'ports2',
      render: (text) => (
        <>
          {text.map((item, index) => (
            <div key={index}>
              <span>{item}</span>
            </div>
          ))}
        </>
      ),
    }
    */
    {
      key: 'ports',
      title: 'Ports',
      dataIndex: 'ports',
      render: (text) => (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1px'}}>
          {text.map((item, index) => {
            if (item.ip !== '') {
              return (
                <div key={index}>
                  <Tag variant="outlined">{item.ip_public_port}</Tag>
                  &nbsp;-&gt;&nbsp;
                  <Tag variant="outlined">{item.private_port_type}</Tag>
                </div>
              );
            } else {
              return (
                <div key={index}>
                  <Tag variant="outlined">{item.private_port_type}</Tag>
                </div>
              );
            }
          })}
        </div>
      ),
    },
    /*
    {
      key: 'mounts2',
      title: 'Mounts (bind)',
      dataIndex: 'mounts2',
      render: (text) => (
        <>
          {text.map((item, index) => (
            <div key={index}>
              <span>{item}</span>
            </div>
          ))}
        </>
      ),
    },
    */
    {
      key: 'mounts',
      title: 'Mounts (bind)',
      dataIndex: 'mounts',
      render: (text) => (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1px'}}>
          {text.map((item, index) => (
            <div key={index}>
              <Tag variant="outlined">{item.source}</Tag>
              &nbsp;:&nbsp;
              <Tag variant="outlined">{item.destination}</Tag>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'containers',
      fixed: 'right',
      render: (text, record) => (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div>
            <Button type="link" className="ButtonLink" onClick={() => inspectContainer(record)}>Inspect</Button>
            <Divider orientation="vertical" />
            <Button type="link" className="ButtonLink" onClick={() => getContainerLog(record)}>Log</Button>
            <Divider orientation="vertical" />
            <a onClick={(event) => {event.preventDefault(); openContainerTerminal(record);}}>
              <img src={terminalIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
            </a>
            <Divider orientation="vertical" />
            <a onClick={(event) => {event.preventDefault(); openContainerFileBrowser(record);}}>
              <img src={folderIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
            </a>
            <Divider orientation="vertical" />
            <a onClick={(event) => {event.preventDefault(); openContainerTerminalExt(record);}}>
              <img src={externalLinkIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
            </a>
            <Divider orientation="vertical" />
            <Dropdown
              menu={{
                items: [{
                  key: '0',
                  label: 'Restart',
                  className: 'MenuItemLink',
                  onClick: () => restartContainer(record),
                }],
              }}
            >
              <a onClick={(event) => {event.preventDefault();}}><MoreOutlined /></a>
            </Dropdown>
          </div>
        </div>
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
          <span className="MyContentHeaderTitle">Container List</span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="name"
          columns={columns}
          dataSource={storeContainers}
          loading={storeContainerTableLoading}
          showSorterTooltip={false}
          size="small"
          scroll={{x: 'max-content'}}
          pagination={{
            showSizeChanger: true,
            defaultPageSize: 50,
            placement: ['bottomRight'],
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </div>
    </>
  );
}

export default ContainerList;
