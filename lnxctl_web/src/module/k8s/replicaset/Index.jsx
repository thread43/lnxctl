import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import ReplicasetDetail from './ReplicasetDetail.jsx';
import ReplicasetList from './ReplicasetList.jsx';
import ReplicasetYaml from './ReplicasetYaml.jsx';
import store from './store.js';

function Replicaset() {
  const storeReplicasetDetailVisible = useSelector(store.getReplicasetDetailVisible);
  const storeReplicasetYamlVisible = useSelector(store.getReplicasetYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'ReplicaSet List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <ReplicasetList />
      </Layout.Content>

      {storeReplicasetDetailVisible === true && <ReplicasetDetail />}
      {storeReplicasetYamlVisible === true && <ReplicasetYaml />}
    </>
  );
}

export default Replicaset;
