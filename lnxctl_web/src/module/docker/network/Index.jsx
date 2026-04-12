import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import NetworkDetail from './NetworkDetail.jsx';
import NetworkJson from './NetworkJson.jsx';
import NetworkList from './NetworkList.jsx';
import store from './store.js';

function Network() {
  const storeNetworkDetailVisible = useSelector(store.getNetworkDetailVisible);
  const storeNetworkJsonVisible = useSelector(store.getNetworkJsonVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/docker">Docker</Link>},
          {title: 'Network List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <NetworkList />
      </Layout.Content>

      {storeNetworkDetailVisible === true && <NetworkDetail />}
      {storeNetworkJsonVisible === true && <NetworkJson />}
    </>
  );
}

export default Network;
