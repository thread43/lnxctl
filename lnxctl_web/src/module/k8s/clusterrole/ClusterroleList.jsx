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

function ClusterroleList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const commonStoreContext = useSelector(commonStore.getContext);
  const commonStoreClusters = useSelector(commonStore.getClusters);
  const storeClusterroles = useSelector(store.getClusterroles);
  const storeClusterroleTableLoading = useSelector(store.getClusterroleTableLoading);

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
      dispatch(store.setClusterroleTableLoading(true));

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

      const response2 = await api.get_clusterroles(cluster_id);
      dispatch(store.setClusterroles(response2.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setClusterroleTableLoading(false));
    }
  }

  async function changeCluster(value) {
    const cluster_id = value;

    localStorage.setItem('k8s_cluster_id', cluster_id);
    localStorage.setItem('k8s_namespace', '');

    dispatch(commonStore.setContext({cluster_id}));
    dispatch(store.setClusterroles([]));

    try {
      dispatch(store.setClusterroleTableLoading(true));
      const response = await api.get_clusterroles(cluster_id);
      dispatch(store.setClusterroles(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setClusterroleTableLoading(false));
    }
  }

  function getClusterrole(clusterrole) {
    dispatch(store.setClusterrole(clusterrole));
    dispatch(store.setClusterroleDetailVisible(true));
  }

  function getClusterroleYaml(clusterrole) {
    dispatch(store.setClusterrole(clusterrole));
    dispatch(store.setClusterroleYamlVisible(true));
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
      dispatch(store.setClusterroleTableLoading(true));
      const response = await api.get_clusterroles(cluster_id);
      dispatch(store.setClusterroles(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setClusterroleTableLoading(false));
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
        <Button type="link" className="ButtonLink" onClick={() => getClusterrole(record)}>{text}</Button>
      ),
    },
    {
      key: 'created_at',
      title: 'Created At',
      dataIndex: 'created_at',
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
          <Button type="link" className="ButtonLink" onClick={() => getClusterroleYaml(record)}>YAML</Button>
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
          <span className="MyContentHeaderTitle">ClusterRole List</span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="name"
          columns={columns}
          dataSource={storeClusterroles}
          loading={storeClusterroleTableLoading}
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

export default ClusterroleList;
