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

function ImageJson() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeImage = useSelector(store.getImage);
  const storeImageJsonVisible = useSelector(store.getImageJsonVisible);

  const [stateLoading, setStateLoading] = useState(false);
  const [stateJson, setStateJson] = useState('');
  const [stateCopy, setStateCopy] = useState('Copy');

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    try {
      const image = storeImage;

      setStateLoading(true);

      const response = await api.inspect_image(image);
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
        title="Image JSON"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={1000}
        open={storeImageJsonVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setImageJsonVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setImageJsonVisible(false))}>Close</Button>,
        ]}
      >
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">
            {storeImage.name}
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

export default ImageJson;
