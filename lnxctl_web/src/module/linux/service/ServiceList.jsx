import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Popconfirm} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Tag} from 'antd';
import {Tooltip} from 'antd';
import {Typography} from 'antd';
import {Upload} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import {PlusOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {UploadOutlined} from '@ant-design/icons';
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

  async function downloadService() {
    try {
      await api.download_service();
    } catch (error) {
      console.error(error);
      message.error(error.message);
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

  function uploadService(info) {
    if (info.file.status === 'uploading') {
      dispatch(store.setServiceTableLoading(true));
      return;
    }
    if (info.file.status === 'done') {
      message.success('Upload succeeded');
      // dispatch(store.setServiceTableLoading(false));
      getServices();
    }
    if (info.file.status === 'error') {
      dispatch(store.setServiceTableLoading(false));
      console.error(info.file.response);
      message.error('Upload failed');
    }
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
      key: 'host',
      title: 'Host',
      dataIndex: 'host',
    },
    {
      key: 'user',
      title: 'User',
      dataIndex: 'user',
    },
    {
      key: 'path',
      title: 'Path',
      dataIndex: 'path',
    },
    */
    {
      key: 'start_cmd',
      title: 'Service CMD',
      dataIndex: 'start_cmd',
      render: (text, record) => (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1px'}}>
          {record.start_cmd !== '' && (
            <div>
              Start:
              &nbsp;
              <Tooltip
                placement="topLeft"
                title={(<div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>{text}</div>)}
              >
                <Tag variant="outlined">
                  {text.length > 50 ? text.substring(0, 50) + '...' : text}
                </Tag>
              </Tooltip>
            </div>
          )}

          {record.stop_cmd !== '' && (
            <div>
              Stop:
              &nbsp;
              <Tooltip
                placement="topLeft"
                title={(<div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>{record.stop_cmd}</div>)}
              >
                <Tag variant="outlined">
                  {record.stop_cmd.length > 50 ? record.stop_cmd.substring(0, 50) + '...' : record.stop_cmd}
                </Tag>
              </Tooltip>
            </div>
          )}

          {record.restart_cmd !== '' && (
            <div>
              Restart:
              &nbsp;
              <Tooltip
                placement="topLeft"
                title={(<div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>{record.restart_cmd}</div>)}
              >
                <Tag variant="outlined">
                  {record.restart_cmd.length > 50 ? record.restart_cmd.substring(0, 50) + '...' : record.restart_cmd}
                </Tag>
              </Tooltip>
            </div>
          )}

          {record.reload_cmd !== '' && (
            <div>
              Reload:
              &nbsp;
              <Tooltip
                placement="topLeft"
                title={(<div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>{record.reload_cmd}</div>)}
              >
                <Tag variant="outlined">
                  {record.reload_cmd.length > 50 ? record.reload_cmd.substring(0, 50) + '...' : record.reload_cmd}
                </Tag>
              </Tooltip>
            </div>
          )}

          {record.status_cmd !== '' && (
            <div>
              Status:
              &nbsp;
              <Tooltip
                placement="topLeft"
                title={(<div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>{record.status_cmd}</div>)}
              >
                <Tag variant="outlined">
                  {record.status_cmd.length > 50 ? record.status_cmd.substring(0, 50) + '...' : record.status_cmd}
                </Tag>
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
    /*
    {
      key: 'stop_cmd',
      title: 'Stop CMD',
      dataIndex: 'stop_cmd',
      render: (text) => (
        <Tooltip
          placement="topLeft"
          title={(<div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>{text}</div>)}
        >
          {text.length > 30 ? text.substring(0, 30) + '...' : text}
        </Tooltip>
      ),
    },
    {
      key: 'restart_cmd',
      title: 'Restart CMD',
      dataIndex: 'restart_cmd',
      render: (text) => (
        <Tooltip
          placement="topLeft"
          title={(<div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>{text}</div>)}
        >
          {text.length > 30 ? text.substring(0, 30) + '...' : text}
        </Tooltip>
      ),
    },
    {
      key: 'reload_cmd',
      title: 'Reload CMD',
      dataIndex: 'reload_cmd',
      render: (text) => (
        <Tooltip
          placement="topLeft"
          title={(<div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>{text}</div>)}
        >
          {text.length > 30 ? text.substring(0, 30) + '...' : text}
        </Tooltip>
      ),
    },
    {
      key: 'status_cmd',
      title: 'Status CMD',
      dataIndex: 'status_cmd',
      render: (text) => (
        <Tooltip
          placement="topLeft"
          title={(<div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>{text}</div>)}
        >
          {text.length > 30 ? text.substring(0, 30) + '...' : text}
        </Tooltip>
      ),
    },
    */
    {
      key: 'term_cmd',
      title: 'Terminal CMD',
      dataIndex: 'term_cmd',
      render: (text) => (
        <Tooltip
          placement="topLeft"
          title={(<div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>{text}</div>)}
        >
          {text.length > 30 ? text.substring(0, 30) + '...' : text}
        </Tooltip>
      ),
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
          {record.start_cmd !== '' ? (
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => openServiceCmdExec(record, 'start')}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{color: 'red'}} />}
            >
              <Button type="link" className="ButtonLink">Start</Button>
            </Popconfirm>
          ) : (
            <Button type="link" className="ButtonLink" disabled>Start</Button>
          )}
          <Divider orientation="vertical" />
          {record.stop_cmd !== '' ? (
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => openServiceCmdExec(record, 'stop')}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{color: 'red'}} />}
            >
              <Button type="link" className="ButtonLink">Stop</Button>
            </Popconfirm>
          ) : (
            <Button type="link" className="ButtonLink" disabled>Stop</Button>
          )}
          <Divider orientation="vertical" />
          {record.restart_cmd !== '' ? (
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => openServiceCmdExec(record, 'restart')}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{color: 'red'}} />}
            >
              <Button type="link" className="ButtonLink">Restart</Button>
            </Popconfirm>
          ) : (
            <Button type="link" className="ButtonLink" disabled>Restart</Button>
          )}
          <Divider orientation="vertical" />
          {record.reload_cmd !== '' ? (
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => openServiceCmdExec(record, 'reload')}
              okText="Yes"
              cancelText="No"
              icon={<QuestionCircleOutlined style={{color: 'red'}} />}
            >
              <Button type="link" className="ButtonLink">Reload</Button>
            </Popconfirm>
          ) : (
            <Button type="link" className="ButtonLink" disabled>Reload</Button>
          )}
          <Divider orientation="vertical" />
          {record.status_cmd !== '' ? (
            <Button type="link" className="ButtonLink" onClick={() => openServiceCmdExec(record, 'status')}>Status</Button>
          ) : (
            <Button type="link" className="ButtonLink" disabled>Status</Button>
          )}
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
        <Space wrap>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addService()}>New Service</Button>
          <Upload
            name="file"
            showUploadList={false}
            action={"/api/linux/service/upload_service"}
            onChange={(info) => uploadService(info)}
          >
            <Button type="primary" icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => downloadService()}>Download</Button>
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
