import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Popconfirm} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Typography} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';
import externalLinkIcon from '/src/static/external-link.svg';
import terminalIcon from '/src/static/terminal-box-fill.svg';

function ServiceList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeServices = useSelector(store.getServices);
  const storeServiceTableLoading = useSelector(store.getServiceTableLoading);

  useEffect(() => {
    getServices();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addService() {
    dispatch(store.setService({}));
    dispatch(store.setServiceFormAddVisible(true));
  }

  async function deleteService(id) {
    try {
      await api.delete_service(id);
      message.success('Request succeeded', 1);

      dispatch(store.setServiceTableLoading(true));
      const response = await api.get_services();
      dispatch(store.setServices(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setServiceTableLoading(false));
    }
  }

  function getService(service) {
    dispatch(store.setService(service));
    dispatch(store.setServiceDetailVisible(true));
  }

  async function getServices() {
    try {
      dispatch(store.setServiceTableLoading(true));
      const response = await api.get_services();
      dispatch(store.setServices(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setServiceTableLoading(false));
    }
  }

  function updateService(id) {
    dispatch(store.setService({id}));
    dispatch(store.setServiceFormUpdateVisible(true));
  }

  function openServiceCmdExec(service, action) {
    dispatch(store.setService({...service, action}));
    dispatch(store.setServiceCmdExecVisible(true));
  }

  function openServiceTerminal(service) {
    dispatch(store.setService(service));
    dispatch(store.setServiceTerminalVisible(true));
  }

  function openServiceTerminalExt(service) {
    const service_id = service.id;
    const service_name = service.name;

    let url = '/#/linux/service/terminal_ext';
    url = url + '?service_id=' + service_id;
    url = url + '&service_name=' + service_name;
    console.log(url);

    window.open(url, '_blank');
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getService(record)}>{text}</Button>
      ),
    },
    /*
    {
      key: 'term_cmd',
      title: 'Host',
      dataIndex: 'term_cmd',
    },
    {
      key: 'term_cmd',
      title: 'User',
      dataIndex: 'term_cmd',
    },
    {
      key: 'term_cmd',
      title: 'Path',
      dataIndex: 'term_cmd',
    },
    */
    {
      key: 'start_cmd',
      title: 'Start CMD',
      dataIndex: 'start_cmd',
    },
    {
      key: 'stop_cmd',
      title: 'Stop CMD',
      dataIndex: 'stop_cmd',
    },
    {
      key: 'restart_cmd',
      title: 'Restart CMD',
      dataIndex: 'restart_cmd',
    },
    {
      key: 'reload_cmd',
      title: 'Reload CMD',
      dataIndex: 'reload_cmd',
    },
    {
      key: 'status_cmd',
      title: 'Status CMD',
      dataIndex: 'status_cmd',
    },
    {
      key: 'term_cmd',
      title: 'Terminal CMD',
      dataIndex: 'term_cmd',
    },
    {
      key: 'actions',
      title: 'Actions',
      fixed: 'right',
      render: (record) => (
        <span>
          <Button type="link" className="ButtonLink" onClick={() => updateService(record.id)}>Edit</Button>
          <Divider orientation="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteService(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Delete</Button>
          </Popconfirm>
          <Divider orientation="vertical" />
          <Button type="link" className="ButtonLink" onClick={() => openServiceCmdExec(record, 'start')}>Start</Button>
          <Divider orientation="vertical" />
          <Button type="link" className="ButtonLink" onClick={() => openServiceCmdExec(record, 'stop')}>Stop</Button>
          <Divider orientation="vertical" />
          <Button type="link" className="ButtonLink" onClick={() => openServiceCmdExec(record, 'restart')}>Restart</Button>
          <Divider orientation="vertical" />
          <Button type="link" className="ButtonLink" onClick={() => openServiceCmdExec(record, 'reload')}>Reload</Button>
          <Divider orientation="vertical" />
          <Button type="link" className="ButtonLink" onClick={() => openServiceCmdExec(record, 'status')}>Status</Button>
          <Divider orientation="vertical" />
          {record.term_cmd !== '' ? (
            <Typography.Link onClick={(event) => {event.preventDefault(); openServiceTerminal(record);}}>
              <img src={terminalIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
            </Typography.Link>
          ) : (
            <Typography.Link disabled>
              <img src={terminalIcon} alt="" style={{height: '22px', verticalAlign: 'top', opacity: 0.3}} />
            </Typography.Link>
          )}
          <Divider orientation="vertical" />
          {record.term_cmd !== '' ? (
            <Typography.Link onClick={(event) => {event.preventDefault(); openServiceTerminalExt(record);}}>
              <img src={externalLinkIcon} alt="" style={{height: '22px', verticalAlign: 'top'}} />
            </Typography.Link>
          ) : (
            <Typography.Link disabled>
              <img src={externalLinkIcon} alt="" style={{height: '22px', verticalAlign: 'top', opacity: 0.3}} />
            </Typography.Link>
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Service List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addService()}>New Service</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getServices()}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={storeServices}
        loading={storeServiceTableLoading}
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
    </>
  );
}

export default ServiceList;
