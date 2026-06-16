import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Popconfirm} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Tooltip} from 'antd';
import {Upload} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import {PlusOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {UploadOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function TaskList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeTasks = useSelector(store.getTasks);
  const storeTaskTableLoading = useSelector(store.getTaskTableLoading);

  useEffect(() => {
    getTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addTask() {
    dispatch(store.setTask({}));
    dispatch(store.setTaskFormAddVisible(true));
  }

  async function deleteTask(id) {
    try {
      await api.delete_task(id);
      message.success('Request succeeded', 1);

      dispatch(store.setTaskTableLoading(true));
      const response = await api.get_tasks();
      dispatch(store.setTasks(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setTaskTableLoading(false));
    }
  }

  async function downloadTask() {
    try {
      await api.download_task();
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  function getTask(task) {
    dispatch(store.setTask(task));
    dispatch(store.setTaskDetailVisible(true));
  }

  async function getTasks() {
    try {
      dispatch(store.setTaskTableLoading(true));
      const response = await api.get_tasks();
      dispatch(store.setTasks(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setTaskTableLoading(false));
    }
  }

  function updateTask(id) {
    dispatch(store.setTask({id}));
    dispatch(store.setTaskFormUpdateVisible(true));
  }

  function runTask(task) {
    dispatch(store.setTask(task));
    dispatch(store.setTaskRunVisible(true));
  }

  function uploadTask(info) {
    if (info.file.status === 'uploading') {
      dispatch(store.setTaskTableLoading(true));
      return;
    }
    if (info.file.status === 'done') {
      message.success('Upload succeeded');
      // dispatch(store.setTaskTableLoading(false));
      getTasks();
    }
    if (info.file.status === 'error') {
      dispatch(store.setTaskTableLoading(false));
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
        <Button
          type="link"
          className="ButtonLink"
          onClick={() => getTask(record)}
        >
          {text}
        </Button>
      ),
    },
    {
      key: 'command',
      title: 'Command',
      dataIndex: 'command',
      render: (text) => (
        <Tooltip
          placement="topLeft"
          title={(
            <div style={{whiteSpace: 'normal', wordBreak: 'break-all'}}>
              {text}
            </div>
          )}
        >
          {text.length > 50 ? text.substring(0, 50) + '...' : text}
        </Tooltip>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      fixed: 'right',
      render: (record) => (
        <span>
          <Button
            type="link"
            className="ButtonLink"
            onClick={() => updateTask(record.id)}
          >
            Edit
          </Button>
          <Divider orientation="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteTask(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Delete</Button>
          </Popconfirm>
          <Divider orientation="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => runTask(record)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Run</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Task List</span>
        <Space wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => addTask()}
          >
              New Task
          </Button>
          <Upload
            name="file"
            showUploadList={false}
            action={"/api/linux/task/upload_task"}
            onChange={(info) => uploadTask(info)}
          >
            <Button type="primary" icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => downloadTask()}
          >
            Download
          </Button>
          <Button
            type="primary"
            icon={<SyncOutlined />}
            onClick={() => getTasks()}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={storeTasks}
        loading={storeTaskTableLoading}
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

export default TaskList;
