import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Modal} from 'antd';
import {Space} from 'antd';
import {CopyOutlined} from '@ant-design/icons';
import {Light as SyntaxHighlighter} from 'react-syntax-highlighter';
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {json} from 'react-syntax-highlighter/dist/esm/languages/hljs';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import api from './api.js';
import store from './store.js';

SyntaxHighlighter.registerLanguage('json', json);

function NetworkJson() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeNetwork = useSelector(store.getNetwork);
  const storeNetworkJsonVisible = useSelector(store.getNetworkJsonVisible);

  const [stateLoading, setStateLoading] = useState(false);
  const [stateJson, setStateJson] = useState('');
  const [stateCopy, setStateCopy] = useState('Copy');

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    try {
      const network = storeNetwork;

      setStateLoading(true);

      const response = await api.inspect_network(network);
      const data_obj = JSON.parse(response.data.data);
      const data_str = JSON.stringify(data_obj, null, 4);
      setStateJson(data_str);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  function onCopy() {
    setStateCopy('Copied');
    setTimeout(() => {
      setStateCopy('Copy');
    }, 1000);
  }

  return (
    <>
      <Modal
        title="Network JSON"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={1000}
        open={storeNetworkJsonVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setNetworkJsonVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setNetworkJsonVisible(false))}>Close</Button>,
        ]}
      >
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">
            {storeNetwork.name}
          </span>
          <Space>
            <CopyToClipboard text={stateJson} onCopy={() => onCopy()}>
              <Button type="primary" icon={<CopyOutlined />}>{stateCopy}</Button>
            </CopyToClipboard>
          </Space>
        </div>

        <SyntaxHighlighter
          language="json"
          style={docco}
          showLineNumbers={true}
        >
          {stateJson}
        </SyntaxHighlighter>
      </Modal>
    </>
  );
}

export default NetworkJson;
