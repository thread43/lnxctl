import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Popconfirm} from 'antd';
import {Space} from 'antd';
import {Switch} from 'antd';
import {Table} from 'antd';
import {Tag} from 'antd';
import {Tooltip} from 'antd';
import {CheckOutlined} from '@ant-design/icons';
import {CloseOutlined} from '@ant-design/icons';
import {ExportOutlined} from '@ant-design/icons';
import {PlusOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function TargetList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeTarget = useSelector(store.getTarget);
  const storeTargets = useSelector(store.getTargets);
  const storeTargetTableLoading = useSelector(store.getTargetTableLoading);

  useEffect(() => {
    getTargets();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addTarget() {
    dispatch(store.setTargetFormAddVisible(true));
  }

  async function deleteTarget(id) {
    try {
      await api.delete_target(id);
      message.success('Request succeeded', 1);

      dispatch(store.setTargetTableLoading(true));
      const response = await api.get_targets();
      dispatch(store.setTargets(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setTargetTableLoading(false));
    }
  }

  async function enableOrDisableTarget(id) {
    try {
      if (storeTarget.is_active === 0) {
        await api.enable_target(id);
      } else {
        await api.disable_target(id);
      }

      dispatch(store.setTargetTableLoading(true));
      const response = await api.get_targets();
      dispatch(store.setTargets(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setTargetTableLoading(false));
    }
  }


  function getTarget(id) {
    dispatch(store.setTarget({id}));
    dispatch(store.setTargetDetailVisible(true));
  }

  async function getTargets() {
    try {
      dispatch(store.setTargetTableLoading(true));
      const response = await api.get_targets();
      dispatch(store.setTargets(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setTargetTableLoading(false));
    }
  }

  function updateTarget(id) {
    dispatch(store.setTarget({id}));
    dispatch(store.setTargetFormUpdateVisible(true));
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getTarget(record.id)}>{text}</Button>
      ),
    },
    {
      key: 'crontab',
      title: 'Crontab',
      dataIndex: 'crontab',
      // sorter: (x, y) => x.crontab.localeCompare(y.crontab),
      // sortDirections: ['ascend', 'descend'],
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      sorter: (x, y) => x.type - y.type,
      sortDirections: ['ascend', 'descend'],
      render: (text) => {
        if (text === 1) {
          return 'Ping';
        } else if (text === 2) {
          return 'TCP';
        } else if (text === 3) {
          return 'HTTP';
        } else {
          return 'Unknown';
        }
      },
    },
    {
      key: 'ping_host',
      title: 'Ping Host',
      dataIndex: 'ping_host',
    },
    {
      key: 'tcp_host',
      title: 'TCP Host',
      dataIndex: 'tcp_host',
    },
    {
      key: 'tcp_port',
      title: 'TCP Port',
      dataIndex: 'tcp_port',
    },
    {
      key: 'http_url',
      title: 'HTTP URL',
      dataIndex: 'http_url',
      render: (text) => (
        <Tooltip
          placement="topLeft"
          title={(<div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>{text}</div>)}
        >
          <a href={text} target="_blank">
            {text.length > 30 ? text.substring(0, 30) + '...' : text}
            &nbsp;
            {text.length > 0 ? (<ExportOutlined />) : ''}
          </a>
        </Tooltip>
      ),
    },
    {
      key: 'check_status',
      title: 'Check Status',
      dataIndex: 'check_status',
      render: (text, record) => {
        if (text === 0) {
          return (<span><Tag>Unknown</Tag></span>);
        } else if (text === 1) {
          if (record.is_active === 1) {
            return (<span><Tag color="success">Succeeded</Tag></span>);
          } else {
            return (<span><Tag>Succeeded</Tag></span>);
          }
        } else if (text === -1) {
          if (record.is_active === 1) {
            return (<span><Tag color="error">Failed</Tag></span>);
          } else {
            return (<span><Tag>Failed</Tag></span>);
          }
        } else {
          return (<span><Tag>Unknown</Tag></span>);
        }
      },
    },
    {
      key: 'check_time',
      title: 'Checked At',
      dataIndex: 'check_time',
    },
    /*
    {
      key: 'is_active',
      title: 'Is Active',
      dataIndex: 'is_active',
      sorter: (x, y) => x.is_active - y.is_active,
      sortDirections: ['ascend', 'descend'],
      render: (text) => (text === 1 ? 'Yes' : 'No'),
    },
    */
    {
      key: 'is_active',
      title: 'Is Active',
      dataIndex: 'is_active',
      // sorter: (x, y) => x.is_active - y.is_active,
      // sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => enableOrDisableTarget(record.id)}
          okText="Yes"
          cancelText="No"
          icon={<QuestionCircleOutlined style={{color: 'red'}} />}
        >
          <span>
            <Switch
              size="small"
              checked={(text === 1)}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onClick={() => dispatch(store.setTarget(record))}
           />
         </span>
        </Popconfirm>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      fixed: 'right',
      render: (text, record) => (
        <span>
          <Button type="link" className="ButtonLink" onClick={() => updateTarget(record.id)}>Edit</Button>
          <Divider orientation="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteTarget(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Target List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addTarget()}>New Target</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getTargets()}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={storeTargets}
        loading={storeTargetTableLoading}
        pagination={false}
        showSorterTooltip={false}
        size="small"
        scroll={{x: 'max-content'}}
      />
    </>
  );
}

export default TargetList;
