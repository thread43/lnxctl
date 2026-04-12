import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import DaemonsetDetail from './DaemonsetDetail.jsx';
import DaemonsetList from './DaemonsetList.jsx';
import DaemonsetYaml from './DaemonsetYaml.jsx';
import store from './store.js';

function Daemonset() {
  const storeDaemonsetDetailVisible = useSelector(store.getDaemonsetDetailVisible);
  const storeDaemonsetYamlVisible = useSelector(store.getDaemonsetYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'DaemonSet List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <DaemonsetList />
      </Layout.Content>

      {storeDaemonsetDetailVisible === true && <DaemonsetDetail />}
      {storeDaemonsetYamlVisible === true && <DaemonsetYaml />}
    </>
  );
}

export default Daemonset;
