import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {Link} from 'react-router';
import {useLocation} from 'react-router';
import {useNavigate} from 'react-router';
import {App} from 'antd';
import {Layout} from 'antd';
import {Menu} from 'antd';
import {Space} from 'antd';
import api from './api.js';
import store from './store.js';
import styles from './MySider.module.css';
import logo from '/src/static/react/logo_dark.svg';
import routes from '../../util/routes.jsx';

function MySider() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeSiderCollapsed = useSelector(store.getSiderCollapsed);
  const storeOpenKeys = useSelector(store.getOpenKeys);

  const reactRouterLocation = useLocation();
  const navigate = useNavigate();

  const [stateMenus, setStateMenus] = useState([]);
  const [stateSelectedKeys, setStateSelectedKeys] = useState([]);

  const menuLink = {};
  for (const route of routes) {
      menuLink[route.alias] = route.path;
  }
  const menuIcon = {};
  for (const route of routes) {
      menuIcon[route.alias] = route.icon;
  }

  useEffect(() => {
    const path = reactRouterLocation.pathname;
    const fields = path.split('/');
    const fields2 = fields.filter(item => item !== '');

    const selectedKey = fields2.join('_');
    setStateSelectedKeys([selectedKey]);

    if (storeSiderCollapsed === false) {
      if (fields2.length > 0) {
        const openKey = fields2[0];
        dispatch(store.setOpenKeys([openKey]));
      }
    }

    // eslint-disable-next-line react-hooks/immutability
    getMenus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function getMenus() {
    try {
      const response = await api.get_menus();
      setStateMenus(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  function onBreakpoint(broken) {
    console.log(broken);
    if (broken === true) {
      dispatch(store.setSiderCollapsed(true));
    } else {
      if (localStorage.getItem('siderCollapsed') !== 'true') {
        dispatch(store.setSiderCollapsed(false));
        localStorage.setItem('siderCollapsed', false);
        const path = reactRouterLocation.pathname;
        const fields = path.split('/')
        const fields2 = fields.filter(item => item !== '');
        if (fields2.length > 0) {
          const openKey = fields2[0];
          dispatch(store.setOpenKeys([openKey]));
        }
      }
    }
  }

  function onCollapse(collapsed, type) {
    console.log(collapsed, type);
  }

  function onOpenChange(keys) {
    // // initial version
    // dispatch(store.setOpenKeys(keys));
    // return;

    // console.log('keys', keys);
    // console.log('storeOpenKeys', storeOpenKeys);

    // all closed
    if (keys.length === 0) {
      dispatch(store.setOpenKeys(keys));
      return;
    }

    // diff
    const newOpenKey = keys.find((key) => storeOpenKeys.indexOf(key) === -1);
    // console.log('newOpenKey', newOpenKey);

    // all closed
    if (newOpenKey === undefined) {
      dispatch(store.setOpenKeys(keys));
      return;
    }

    // if (newOpenKey !== undefined) {

    dispatch(store.setOpenKeys([newOpenKey]));

    // when collapsed, and when hover, do nothing
    if (storeSiderCollapsed === true) {
      return;
    }

    // console.log('stateMenus', stateMenus);
    const menu = stateMenus.find(item => item.code === newOpenKey);
    if (menu !== undefined) {
      const subMenus = menu.children;
      // console.log('subMenus', subMenus);

      if (subMenus.length > 0) {
        const subMenuKeys = subMenus.map(item => item.code);

        // console.log('subMenuKeys', subMenuKeys);
        // console.log('stateSelectedKeys', stateSelectedKeys);

        if (stateSelectedKeys.length > 0) {
          // close then open the same menu, do nothing
          if (subMenuKeys.includes(stateSelectedKeys[0])) {
            return;
          }
        }

        // console.log('subMenus[0]', subMenus[0]);

        // select the first subMenu, and jump
        setStateSelectedKeys([subMenuKeys[0]]);
        navigate(menuLink[subMenuKeys[0]]);
      }
    }
  }

  // {xs: '480px', sm: '576px', md: '768px', lg: '992px', xl: '1200px', xxl: '1600px'}
  // https://ant.design/components/layout#layoutsider
  // https://ant.design/components/layout#breakpoint-width

  return (
    <>
      <Layout.Sider
        trigger={null}
        collapsible
        collapsed={storeSiderCollapsed}
        collapsedWidth="48px"
        width="208px"
        theme="dark"
        className={styles.MySider}
        breakpoint="md"
        // collapsedWidth="0"
        onBreakpoint={(broken) => onBreakpoint(broken)}
        onCollapse={(collapsed, type) => onCollapse(collapsed, type)}
      >
        {/* <Link to="/"></Link> */}
        <div onClick={() => {dispatch(store.setOpenKeys([])); navigate('/');}}>
          <div className={styles.SiteInfo}>
            <Space>
              <img src={logo} alt="" className={styles.SiteLogo} />
              {storeSiderCollapsed === false && <span className={styles.SiteTitle}>LNXCTL</span>}
            </Space>
          </div>
        </div>

        <Menu
          mode="inline"
          theme="dark"
          openKeys={storeOpenKeys}
          selectedKeys={stateSelectedKeys}
          items={stateMenus.map((menu) => ({
            key: menu.code,
            label: menu.name,
            icon: menuIcon[menu.code],
            children: menu.children.map((menu2) => (
              {key: menu2.code, label: <Link to={menuLink[menu2.code]}>{menu2.name}</Link>})
            ),
          }))}
          // onOpenChange={(keys) => dispatch(store.setOpenKeys(keys))}
          onOpenChange={(keys) => onOpenChange(keys)}
          onClick={(event) => setStateSelectedKeys([event.key])}
        >
        </Menu>
      </Layout.Sider>
    </>
  );
}

export default MySider;
