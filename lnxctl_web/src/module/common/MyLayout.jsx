import {useSelector} from 'react-redux';
import {Routes} from 'react-router';
import {Route} from 'react-router';
import {useLocation} from 'react-router';
import {Layout} from 'antd';
import MyFooter from './MyFooter.jsx';
import MyHeader from './MyHeader.jsx';
import MySider from './MySider.jsx';
import routes from '../../util/routes.jsx';
import store from './store.js';
import styles from './MyLayout.module.css';

function MyLayout() {
  const location = useLocation();

  const storeSiderCollapsed = useSelector(store.getSiderCollapsed);

  return (
    <>
      <Layout className={styles.MyLayout}>
        <MySider />

        <Layout style={{marginLeft: storeSiderCollapsed === false ? '208px' : '48px'}}>
          <MyHeader />

          {/* <Routes> */}
          <Routes key={location.key}>
            {routes.map((route, key) => (
              <Route key={key} path={route.path} element={<route.component />} />
            ))}
          </Routes>

          <MyFooter />
        </Layout>
      </Layout>
    </>
  );
}

export default MyLayout;
