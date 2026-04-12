import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import PvDetail from './PvDetail.jsx';
import PvList from './PvList.jsx';
import PvYaml from './PvYaml.jsx';
import store from './store.js';

function Pv() {
  const storePvDetailVisible = useSelector(store.getPvDetailVisible);
  const storePvYamlVisible = useSelector(store.getPvYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'PV List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <PvList />
      </Layout.Content>

      {storePvDetailVisible === true && <PvDetail />}
      {storePvYamlVisible === true && <PvYaml />}
    </>
  );
}

export default Pv;
