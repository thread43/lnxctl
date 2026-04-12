import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import ServiceDetail from './ServiceDetail.jsx';
import ServiceFormAdd from './ServiceFormAdd.jsx';
import ServiceFormUpdate from './ServiceFormUpdate.jsx';
import ServiceList from './ServiceList.jsx';
import ServiceTerminal from './ServiceTerminal.jsx';
import store from './store.js';

function Service() {
  const storeServiceDetailVisible = useSelector(store.getServiceDetailVisible);
  const storeServiceFormAddVisible = useSelector(store.getServiceFormAddVisible);
  const storeServiceFormUpdateVisible = useSelector(store.getServiceFormUpdateVisible);
  const storeServiceTerminalVisible = useSelector(store.getServiceTerminalVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/linux">Linux</Link>},
          {title: 'Service List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent">
        <ServiceList />
      </Layout.Content>

      {storeServiceDetailVisible === true && <ServiceDetail />}
      {storeServiceFormAddVisible === true && <ServiceFormAdd />}
      {storeServiceFormUpdateVisible === true && <ServiceFormUpdate />}
      {storeServiceTerminalVisible === true && <ServiceTerminal />}
    </>
  );
}

export default Service;
