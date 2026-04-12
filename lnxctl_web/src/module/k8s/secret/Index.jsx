import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import SecretDetail from './SecretDetail.jsx';
import SecretList from './SecretList.jsx';
import SecretYaml from './SecretYaml.jsx';
import store from './store.js';

function Secret() {
  const storeSecretDetailVisible = useSelector(store.getSecretDetailVisible);
  const storeSecretYamlVisible = useSelector(store.getSecretYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'Secret List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <SecretList />
      </Layout.Content>

      {storeSecretDetailVisible === true && <SecretDetail />}
      {storeSecretYamlVisible === true && <SecretYaml />}
    </>
  );
}

export default Secret;
