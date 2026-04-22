import {useEffect} from 'react';
import {useState} from 'react';
import {Link} from 'react-router';
import {App} from 'antd';
import {Card} from 'antd';
import {Col} from 'antd';
import {Layout} from 'antd';
import {Row} from 'antd';
import {BlockOutlined} from '@ant-design/icons';
import {CaretRightOutlined} from '@ant-design/icons';
import {DockerOutlined} from '@ant-design/icons';
import {LinuxOutlined} from '@ant-design/icons';
import {MonitorOutlined} from '@ant-design/icons';
// import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import styles from './Index.module.css';

function Index() {
  const {message} = App.useApp();

  const [stateStatistics, setStateStatistics] = useState({linux: {}, dockers: [], k8ses: [], monitoring: {}});

  useEffect(() => {
    init();

    const intervalId = setInterval(async () => {
      console.log('setInterval: ' + new Date());

      await init();

      // message.success('Page auto refreshed', 3);
      message.success({
        content: 'Page auto refreshed',
        duration: 5,
        onClick: () => message.destroy(),
        style: {cursor: 'pointer'},
      });
    }, 60000);

    return () => {
      console.log('clearInterval: ' + new Date());
      clearInterval(intervalId);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    try {
      const response = await api.get_statistics();
      setStateStatistics(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      //
    }
  }

  function handleClick(url) {
    window.location.href = url;
    window.location.reload();
  }

  /*
  function refresh(event) {
    event.stopPropagation();
    init();
  }
  */

  return (
    <>
      <Layout.Content className="MyContent2" style={{padding: '5px'}}>
        {/*
        <div style={{textAlign: 'center'}}>
          Welcome
        </div>
        */}

        {/* <div style={{marginBottom: '22px'}}></div> */}

        {/*
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">Statistics</span>
        </div>
        */}

        <Row gutter={10}>
          {stateStatistics.linux.host_running !== undefined &&
            <Col span={6}>
              <Card
                title={<><LinuxOutlined />&nbsp;Linux</>}
                // extra={
                //   <Link to="/" style={{paddingLeft: '16px', color: 'rgba(0,0,0,0.88)'}}>
                //     <SyncOutlined />
                //   </Link>
                // }
                hoverable
                size="small"
                // onClick={() => window.location.href = '/#/linux/host'}
                onClick={() => handleClick('/#/linux/host')}
                className={styles.MyCard}
                styles={{header: {fontWeight: 'normal'}}}
                style={{marginBottom: '10px'}}
              >
                <div
                  // onClick={() => handleClick('/#/linux/host')}
                  style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}
                >
                  <p>
                    <CaretRightOutlined />&nbsp;Hosts:&nbsp;
                    {stateStatistics.linux.host_healthy === true ? (
                      <span style={{color: '#52c41a'}}>
                        {stateStatistics.linux.host_running}/{stateStatistics.linux.host_total}
                      </span>
                    ) : (
                      <span style={{color: '#ff4d4f'}}>
                        {stateStatistics.linux.host_running}/{stateStatistics.linux.host_total}
                      </span>
                    )}
                  </p>
                  <p>&nbsp;</p>
                </div>
              </Card>
            </Col>
          }
          {stateStatistics.dockers.map((item, index) => (
            <Col key={index} span={6}>
              <Card
                title={<><DockerOutlined />&nbsp;Docker - {item.server_name}</>}
                // extra={
                //   <Link to="/" style={{paddingLeft: '16px', color: 'rgba(0,0,0,0.88)'}}>
                //     <SyncOutlined />
                //   </Link>
                // }
                hoverable
                size="small"
                // onClick={() => window.location.href = '/#/docker/container'}
                onClick={() => handleClick('/#/docker/container')}
                className={styles.MyCard}
                styles={{header: {fontWeight: 'normal'}}}
                style={{marginBottom: '10px'}}
              >
                <div
                  // onClick={() => handleClick('/#/docker/container')}
                  style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}
                >
                  <p>
                    <CaretRightOutlined />&nbsp;Containers:&nbsp;
                    {item.container_healthy === true ? (
                      <span style={{color: '#52c41a'}}>
                        {item.container_running}/{item.container_total}
                      </span>
                    ) : (
                      <span style={{color: '#ff4d4f'}}>
                        {item.container_running}/{item.container_total}
                      </span>
                    )}
                  </p>
                  <p>&nbsp;</p>
                </div>
              </Card>
            </Col>
          ))}
          {stateStatistics.k8ses.map((item, index) => (
            <Col key={index} span={6}>
              <Card
                title={<><BlockOutlined />&nbsp;Kubernetes - {item.cluster_name}</>}
                // extra={
                //   <Link to="/" style={{paddingLeft: '16px', color: 'rgba(0,0,0,0.88)'}}>
                //     <SyncOutlined />
                //   </Link>
                // }
                hoverable
                size="small"
                // onClick={() => window.location.href = '/#/k8s/pod'}
                onClick={() => handleClick('/#/k8s/pod')}
                className={styles.MyCard}
                styles={{header: {fontWeight: 'normal'}}}
                style={{marginBottom: '10px'}}
              >
                <div
                  // onClick={() => handleClick('/#/k8s/pod')}
                  style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}
                >
                  <p>
                    <CaretRightOutlined />&nbsp;Nodes:&nbsp;
                    {item.node_healthy === true ? (
                      <span style={{color: '#52c41a'}}>
                        {item.node_running}/{item.node_total}
                      </span>
                    ) : (
                      <span style={{color: '#ff4d4f'}}>
                        {item.node_running}/{item.node_total}
                      </span>
                    )}
                  </p>
                  <p>
                    <CaretRightOutlined />&nbsp;Pods:&nbsp;
                    {item.pod_healthy === true ? (
                      <span style={{color: '#52c41a'}}>
                        {item.pod_running}/{item.pod_total}
                      </span>
                    ) : (
                      <span style={{color: '#ff4d4f'}}>
                        {item.pod_running}/{item.pod_total}
                      </span>
                    )}
                  </p>
                </div>
              </Card>
            </Col>
          ))}
          {stateStatistics.monitoring.target_running !== undefined &&
            <Col span={6}>
              <Card
                title={<><MonitorOutlined />&nbsp;Monitoring</>}
                // extra={
                //   <Link to="/" style={{paddingLeft: '16px', color: 'rgba(0,0,0,0.88)'}}>
                //     <SyncOutlined />
                //   </Link>
                // }
                hoverable
                size="small"
                // onClick={() => window.location.href = '/#/monitoring/target'}
                onClick={() => handleClick('/#/monitoring/target')}
                className={styles.MyCard}
                styles={{header: {fontWeight: 'normal'}}}
                style={{marginBottom: '10px'}}
              >
                <div
                  // onClick={() => handleClick('/#/monitoring/target')}
                  style={{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}
                >
                  <p>
                    <CaretRightOutlined />&nbsp;Targets:&nbsp;
                    {stateStatistics.monitoring.target_healthy === true ? (
                      <span style={{color: '#52c41a'}}>
                        {stateStatistics.monitoring.target_running}/{stateStatistics.monitoring.target_total}
                      </span>
                    ) : (
                      <span style={{color: '#ff4d4f'}}>
                        {stateStatistics.monitoring.target_running}/{stateStatistics.monitoring.target_total}
                      </span>
                    )}
                  </p>
                  <p>&nbsp;</p>
                </div>
              </Card>
            </Col>
          }
        </Row>
      </Layout.Content>
    </>
  );
}

export default Index;
