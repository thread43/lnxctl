import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import IngressDetail from './IngressDetail.jsx';
import IngressList from './IngressList.jsx';
import IngressYaml from './IngressYaml.jsx';
import store from './store.js';

function Ingress() {
  const storeIngressDetailVisible = useSelector(store.getIngressDetailVisible);
  const storeIngressYamlVisible = useSelector(store.getIngressYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'Ingress List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <IngressList />
      </Layout.Content>

      {storeIngressDetailVisible === true && <IngressDetail />}
      {storeIngressYamlVisible === true && <IngressYaml />}
    </>
  );
}

export default Ingress;
