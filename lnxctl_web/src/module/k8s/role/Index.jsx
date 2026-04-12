import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import RoleDetail from './RoleDetail.jsx';
import RoleList from './RoleList.jsx';
import RoleYaml from './RoleYaml.jsx';
import store from './store.js';

function Role() {
  const storeRoleDetailVisible = useSelector(store.getRoleDetailVisible);
  const storeRoleYamlVisible = useSelector(store.getRoleYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'Role List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <RoleList />
      </Layout.Content>

      {storeRoleDetailVisible === true && <RoleDetail />}
      {storeRoleYamlVisible === true && <RoleYaml />}
    </>
  );
}

export default Role;
