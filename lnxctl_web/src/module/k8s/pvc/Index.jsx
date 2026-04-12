import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import PvcDetail from './PvcDetail.jsx';
import PvcList from './PvcList.jsx';
import PvcYaml from './PvcYaml.jsx';
import store from './store.js';

function Pvc() {
  const storePvcDetailVisible = useSelector(store.getPvcDetailVisible);
  const storePvcYamlVisible = useSelector(store.getPvcYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'PVC List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <PvcList />
      </Layout.Content>

      {storePvcDetailVisible === true && <PvcDetail />}
      {storePvcYamlVisible === true && <PvcYaml />}
    </>
  );
}

export default Pvc;
