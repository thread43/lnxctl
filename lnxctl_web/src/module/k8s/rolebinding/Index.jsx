import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import RolebindingDetail from './RolebindingDetail.jsx';
import RolebindingList from './RolebindingList.jsx';
import RolebindingYaml from './RolebindingYaml.jsx';
import store from './store.js';

function Rolebinding() {
  const storeRolebindingDetailVisible = useSelector(store.getRolebindingDetailVisible);
  const storeRolebindingYamlVisible = useSelector(store.getRolebindingYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'RoleBinding List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <RolebindingList />
      </Layout.Content>

      {storeRolebindingDetailVisible === true && <RolebindingDetail />}
      {storeRolebindingYamlVisible === true && <RolebindingYaml />}
    </>
  );
}

export default Rolebinding;
