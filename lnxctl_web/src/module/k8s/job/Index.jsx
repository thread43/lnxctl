import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import JobDetail from './JobDetail.jsx';
import JobList from './JobList.jsx';
import JobYaml from './JobYaml.jsx';
import store from './store.js';

function Job() {
  const storeJobDetailVisible = useSelector(store.getJobDetailVisible);
  const storeJobYamlVisible = useSelector(store.getJobYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'Job List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <JobList />
      </Layout.Content>

      {storeJobDetailVisible === true && <JobDetail />}
      {storeJobYamlVisible === true && <JobYaml />}
    </>
  );
}

export default Job;
