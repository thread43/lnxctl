import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import CronjobDetail from './CronjobDetail.jsx';
import CronjobList from './CronjobList.jsx';
import CronjobYaml from './CronjobYaml.jsx';
import store from './store.js';

function Cronjob() {
  const storeCronjobDetailVisible = useSelector(store.getCronjobDetailVisible);
  const storeCronjobYamlVisible = useSelector(store.getCronjobYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'CronJob List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <CronjobList />
      </Layout.Content>

      {storeCronjobDetailVisible === true && <CronjobDetail />}
      {storeCronjobYamlVisible === true && <CronjobYaml />}
    </>
  );
}

export default Cronjob;
