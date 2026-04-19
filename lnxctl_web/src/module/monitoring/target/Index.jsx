import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import TargetDetail from './TargetDetail.jsx';
import TargetFormAdd from './TargetFormAdd.jsx';
import TargetFormUpdate from './TargetFormUpdate.jsx';
import TargetList from './TargetList.jsx';
import store from './store.js';

function Target() {
  const storeTargetDetailVisible = useSelector(store.getTargetDetailVisible);
  const storeTargetFormAddVisible = useSelector(store.getTargetFormAddVisible);
  const storeTargetFormUpdateVisible = useSelector(store.getTargetFormUpdateVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/monitoring">Monitoring</Link>},
          {title: 'Target List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent">
        <TargetList />
      </Layout.Content>

      {storeTargetDetailVisible === true && <TargetDetail />}
      {storeTargetFormAddVisible === true && <TargetFormAdd />}
      {storeTargetFormUpdateVisible === true && <TargetFormUpdate />}
    </>
  );
}

export default Target;
