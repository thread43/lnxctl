import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import ServiceaccountDetail from './ServiceaccountDetail.jsx';
import ServiceaccountList from './ServiceaccountList.jsx';
import ServiceaccountYaml from './ServiceaccountYaml.jsx';
import store from './store.js';

function Serviceaccount() {
  const storeServiceaccountDetailVisible = useSelector(store.getServiceaccountDetailVisible);
  const storeServiceaccountYamlVisible = useSelector(store.getServiceaccountYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'ServiceAccount List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <ServiceaccountList />
      </Layout.Content>

      {storeServiceaccountDetailVisible === true && <ServiceaccountDetail />}
      {storeServiceaccountYamlVisible === true && <ServiceaccountYaml />}
    </>
  );
}

export default Serviceaccount;
