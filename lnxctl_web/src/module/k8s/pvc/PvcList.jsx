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

function PvcList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const commonStoreContext = useSelector(commonStore.getContext);
  const commonStoreClusters = useSelector(commonStore.getClusters);
  const commonStoreNamespaces = useSelector(commonStore.getNamespaces);
  const storePvcs = useSelector(store.getPvcs);
  const storePvcTableLoading = useSelector(store.getPvcTableLoading);

  const [form] = Form.useForm();

  useEffect(() => {
    init(commonStoreContext);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init(context) {
    let {cluster_id, namespace} = context;

    cluster_id = localStorage.getItem('k8s_cluster_id');
    namespace = localStorage.getItem('k8s_namespace');
    if (cluster_id !== null) {
      cluster_id = parseInt(cluster_id, 10);
    }

    form.resetFields();

    try {
      dispatch(store.setPvcTableLoading(true));

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
      if (namespace === undefined || namespace === null) {
        namespace = '';
      }

      form.setFieldsValue({cluster_id, namespace});

      const response2 = await api.get_pvcs(cluster_id, namespace);
      dispatch(store.setPvcs(response2.data.data));

      const response3 = await api.get_namespaces(cluster_id);
      dispatch(commonStore.setNamespaces(response3.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPvcTableLoading(false));
    }
  }

  async function changeCluster(value) {
    const cluster_id = value;
    const namespace = '';

    localStorage.setItem('k8s_cluster_id', cluster_id);
    localStorage.setItem('k8s_namespace', namespace);

    form.setFieldsValue({namespace: namespace});

    dispatch(commonStore.setContext({cluster_id}));
    dispatch(commonStore.setNamespaces([]));
    dispatch(store.setPvcs([]));

    try {
      dispatch(store.setPvcTableLoading(true));

      const response = await api.get_pvcs(cluster_id, namespace);
      dispatch(store.setPvcs(response.data.data));

      const response2 = await api.get_namespaces(cluster_id);
      dispatch(commonStore.setNamespaces(response2.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPvcTableLoading(false));
    }
  }

  async function changeNamespace(namespace) {
    const form_value = form.getFieldsValue();
    const cluster_id = form_value.cluster_id;

    namespace = (namespace === undefined) ? '' : namespace;

    localStorage.setItem('k8s_cluster_id', cluster_id);
    localStorage.setItem('k8s_namespace', namespace);

    dispatch(commonStore.setContext({...commonStoreContext, namespace}));
    dispatch(store.setPvcs([]));

    try {
      dispatch(store.setPvcTableLoading(true));
      const response = await api.get_pvcs(cluster_id, namespace);
      dispatch(store.setPvcs(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPvcTableLoading(false));
    }
  }

  function getPvc(pvc) {
    dispatch(store.setPvc(pvc));
    dispatch(store.setPvcDetailVisible(true));
  }

  function getPvcYaml(pvc) {
    dispatch(store.setPvc(pvc));
    dispatch(store.setPvcYamlVisible(true));
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

    let namespace = form_value.namespace;
    namespace = (namespace === undefined) ? '' : namespace;

    try {
      dispatch(store.setPvcTableLoading(true));
      const response = await api.get_pvcs(cluster_id, namespace);
      dispatch(store.setPvcs(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPvcTableLoading(false));
    }
  }

  const columns = [
    {
      key: 'namespace',
      title: 'Namespace',
      dataIndex: 'namespace',
      sorter: (x, y) => x.namespace.localeCompare(y.namespace),
      sortDirections: ['ascend', 'descend'],
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sorter: (x, y) => x.name.localeCompare(y.name),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getPvc(record)}>{text}</Button>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
    },
    {
      key: 'volume',
      title: 'Volume',
      dataIndex: 'volume',
    },
    {
      key: 'capacity',
      title: 'Capacity',
      dataIndex: 'capacity',
    },
    {
      key: 'access_modes',
      title: 'Access Modes',
      dataIndex: 'access_modes',
      render: (text) => (
        <>{text.join(',')}</>
      ),
    },
    {
      key: 'storage_class',
      title: 'Storage Class',
      dataIndex: 'storage_class',
    },
    /*
    {
      key: 'volume_attributes_class',
      title: 'Volume Attributes Class',
      dataIndex: 'volume_attributes_class',
    },
    */
    {
      key: 'age',
      title: 'Age',
      dataIndex: 'age',
    },
    {
      key: 'volume_mode',
      title: 'Volume Mode',
      dataIndex: 'volume_mode',
    },
    {
      key: 'actions',
      title: 'Actions',
      fixed: 'right',
      render: (text, record) => (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Button type="link" className="ButtonLink" onClick={() => getPvcYaml(record)}>YAML</Button>
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
          <Form.Item name="namespace" label="Namespace" style={{marginTop: '2px'}}>
            <Select
              allowClear={true}
              style={{width: 200}}
              onChange={(value) => changeNamespace(value)}
              options={commonStoreNamespaces.map((item) => (
                {value: item.name, label: item.name}
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
          <span className="MyContentHeaderTitle">Pvc List</span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          // rowKey="name"
          rowKey={(record) => record.namespace+record.name}
          columns={columns}
          dataSource={storePvcs}
          loading={storePvcTableLoading}
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

export default PvcList;
