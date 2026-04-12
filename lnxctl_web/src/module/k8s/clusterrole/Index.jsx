import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import ClusterroleDetail from './ClusterroleDetail.jsx';
import ClusterroleList from './ClusterroleList.jsx';
import ClusterroleYaml from './ClusterroleYaml.jsx';
import store from './store.js';

function Clusterrole() {
  const storeClusterroleDetailVisible = useSelector(store.getClusterroleDetailVisible);
  const storeClusterroleYamlVisible = useSelector(store.getClusterroleYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'ClusterRole List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <ClusterroleList />
      </Layout.Content>

      {storeClusterroleDetailVisible === true && <ClusterroleDetail />}
      {storeClusterroleYamlVisible === true && <ClusterroleYaml />}
    </>
  );
}

export default Clusterrole;
