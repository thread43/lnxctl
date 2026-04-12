import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import ConfigmapDetail from './ConfigmapDetail.jsx';
import ConfigmapList from './ConfigmapList.jsx';
import ConfigmapYaml from './ConfigmapYaml.jsx';
import store from './store.js';

function Configmap() {
  const storeConfigmapDetailVisible = useSelector(store.getConfigmapDetailVisible);
  const storeConfigmapYamlVisible = useSelector(store.getConfigmapYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'ConfigMap List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <ConfigmapList />
      </Layout.Content>

      {storeConfigmapDetailVisible === true && <ConfigmapDetail />}
      {storeConfigmapYamlVisible === true && <ConfigmapYaml />}
    </>
  );
}

export default Configmap;
