import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import StorageclassDetail from './StorageclassDetail.jsx';
import StorageclassList from './StorageclassList.jsx';
import StorageclassYaml from './StorageclassYaml.jsx';
import store from './store.js';

function Storageclass() {
  const storeStorageclassDetailVisible = useSelector(store.getStorageclassDetailVisible);
  const storeStorageclassYamlVisible = useSelector(store.getStorageclassYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'StorageClass List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <StorageclassList />
      </Layout.Content>

      {storeStorageclassDetailVisible === true && <StorageclassDetail />}
      {storeStorageclassYamlVisible === true && <StorageclassYaml />}
    </>
  );
}

export default Storageclass;
