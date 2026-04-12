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

function StorageclassList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const commonStoreContext = useSelector(commonStore.getContext);
  const commonStoreClusters = useSelector(commonStore.getClusters);
  const storeStorageclasses = useSelector(store.getStorageclasses);
  const storeStorageclassTableLoading = useSelector(store.getStorageclassTableLoading);

  const [form] = Form.useForm();

  useEffect(() => {
    init(commonStoreContext);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init(context) {
    let {cluster_id} = context;

    cluster_id = localStorage.getItem('k8s_cluster_id');
    if (cluster_id !== null) {
      cluster_id = parseInt(cluster_id, 10);
    }

    form.resetFields();

    try {
      dispatch(store.setStorageclassTableLoading(true));

      const response = await api.get_clusters();
      dispatch(commonStore.setClusters(response.data.data));

      const clusters = response.data.data;
      if (clusters.length === 0) {
        message.info('Cluster not found');
        return;
      }

      if (cluster_id === undefined || cluster_id === null) {
        cluster_id = clusters[0].id;
        dispatch(commonStore.setContext({cluster_id}));
      }

      form.setFieldsValue({cluster_id});

      const response2 = await api.get_storageclasses(cluster_id);
      dispatch(store.setStorageclasses(response2.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setStorageclassTableLoading(false));
    }
  }

  async function changeCluster(value) {
    const cluster_id = value;

    localStorage.setItem('k8s_cluster_id', cluster_id);
    localStorage.setItem('k8s_namespace', '');

    dispatch(commonStore.setContext({cluster_id}));
    dispatch(store.setStorageclasses([]));

    try {
      dispatch(store.setStorageclassTableLoading(true));

      const response = await api.get_storageclasses(cluster_id);
      dispatch(store.setStorageclasses(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setStorageclassTableLoading(false));
    }
  }

  function getStorageclass(storageclass) {
    dispatch(store.setStorageclass(storageclass));
    dispatch(store.setStorageclassDetailVisible(true));
  }

  function getStorageclassYaml(storageclass) {
    dispatch(store.setStorageclass(storageclass));
    dispatch(store.setStorageclassYamlVisible(true));
  }

  function refresh() {
    search();
  }

  function reset() {
    localStorage.removeItem('k8s_cluster_id');
    localStorage.removeItem('k8s_namespace');

    const context = {};
    dispatch(commonStore.setContext({}));
    init(context);
  }

  async function search() {
    const form_value = form.getFieldsValue();
    const cluster_id = form_value.cluster_id;

    try {
      dispatch(store.setStorageclassTableLoading(true));
      const response = await api.get_storageclasses(cluster_id);
      dispatch(store.setStorageclasses(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setStorageclassTableLoading(false));
    }
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sorter: (x, y) => x.name.localeCompare(y.name),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getStorageclass(record)}>{text}</Button>
      ),
    },
    {
      key: 'provisioner',
      title: 'Provisioner',
      dataIndex: 'provisioner',
    },
    {
      key: 'reclaim_policy',
      title: 'Reclaim Policy',
      dataIndex: 'reclaim_policy',
    },
    {
      key: 'volume_binding_mode',
      title: 'Volume Binding Mode',
      dataIndex: 'volume_binding_mode',
    },
    {
      key: 'allow_volume_expansion',
      title: 'Allow Volume Expansion',
      dataIndex: 'allow_volume_expansion',
      render: (text) => (
        <>
          {text === false ? 'false' : 'true'}
        </>
      ),
    },
    {
      key: 'age',
      title: 'Age',
      dataIndex: 'age',
    },
    {
      key: 'actions',
      title: 'Actions',
      fixed: 'right',
      render: (text, record) => (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Button type="link" className="ButtonLink" onClick={() => getStorageclassYaml(record)}>YAML</Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentBlock">
        <Form form={form} name="horizontal_login" layout="inline">
          <Form.Item name="cluster_id" label="Cluster" style={{marginTop: '2px'}}>
            <Select
              allowClear={false}
              style={{width: 200}}
              onChange={(value) => changeCluster(value)}
              options={commonStoreClusters.map((item) => (
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
          <span className="MyContentHeaderTitle">StorageClass List</span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="name"
          columns={columns}
          dataSource={storeStorageclasses}
          loading={storeStorageclassTableLoading}
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

export default StorageclassList;
