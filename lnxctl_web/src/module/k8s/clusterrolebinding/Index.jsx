import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import ClusterrolebindingDetail from './ClusterrolebindingDetail.jsx';
import ClusterrolebindingList from './ClusterrolebindingList.jsx';
import ClusterrolebindingYaml from './ClusterrolebindingYaml.jsx';
import store from './store.js';

function Clusterrolebinding() {
  const storeClusterrolebindingDetailVisible = useSelector(store.getClusterrolebindingDetailVisible);
  const storeClusterrolebindingYamlVisible = useSelector(store.getClusterrolebindingYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'ClusterRoleBinding List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <ClusterrolebindingList />
      </Layout.Content>

      {storeClusterrolebindingDetailVisible === true && <ClusterrolebindingDetail />}
      {storeClusterrolebindingYamlVisible === true && <ClusterrolebindingYaml />}
    </>
  );
}

export default Clusterrolebinding;
