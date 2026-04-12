import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import EndpointDetail from './EndpointDetail.jsx';
import EndpointList from './EndpointList.jsx';
import EndpointYaml from './EndpointYaml.jsx';
import store from './store.js';

function Endpoint() {
  const storeEndpointDetailVisible = useSelector(store.getEndpointDetailVisible);
  const storeEndpointYamlVisible = useSelector(store.getEndpointYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'Endpoint List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <EndpointList />
      </Layout.Content>

      {storeEndpointDetailVisible === true && <EndpointDetail />}
      {storeEndpointYamlVisible === true && <EndpointYaml />}
    </>
  );
}

export default Endpoint;
