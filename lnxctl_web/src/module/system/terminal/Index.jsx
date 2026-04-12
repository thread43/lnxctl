import {Link} from 'react-router';
import {Breadcrumb} from 'antd';
import Terminal from './Terminal.jsx';

function Index() {
  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/system">System</Link>},
          {title: 'Terminal'},
        ]}
        className="MyBreadcrumb"
      />

      <Terminal />
    </>
  );
}

export default Index;
