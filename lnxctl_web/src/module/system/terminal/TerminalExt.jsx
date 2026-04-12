import {useEffect} from 'react';
import {useRef} from 'react';
import {FitAddon} from '@xterm/addon-fit';
import {Terminal} from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

function TerminalExt() {
  const termRef = useRef(null);
  const termInstance = useRef(null);
  const fitAddonInstance = useRef(null);
  const wsInstance = useRef(null);
  const resizeHandler = useRef(null);
  const beforeunloadHandler = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    init();

    const handleBeforeunload = (event) => {
      console.log(event);
      event.preventDefault();
      event.returnValue = 'Are you sure?';
    };
    beforeunloadHandler.current = handleBeforeunload;
    window.addEventListener('beforeunload', handleBeforeunload);

    return () => {
      if (resizeHandler.current !== null) {
        window.removeEventListener('resize', resizeHandler.current);
      }

      if (beforeunloadHandler.current !== null) {
        window.removeEventListener('beforeunload', beforeunloadHandler.current);
      }

      if (termInstance.current !== null) {
        const term = termInstance.current;
        if (term !== null) {
          term.dispose();
        }
      }

      if (wsInstance.current !== null) {
        const ws = wsInstance.current;
        if (ws !== null) {
          ws.close();
        }
      }
    };
  }, []);

  function init() {
    if (wsInstance.current !== null) {
      const ws = wsInstance.current;
      if (ws !== null) {
        ws.close();
      }
    }

    document.title = 'Terminal';

    let url = 'ws://' + window.location.host + '/api/system/terminal/ws_open_terminal';
    console.log(url);

    let term = termInstance.current;
    let fitAddon = fitAddonInstance.current;

    if (termInstance.current === null) {
      term = new Terminal({
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: 16,
        convertEol: true,
        cursorBlink: true,
      });
      termInstance.current = term;

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      fitAddonInstance.current = fitAddon;

      term.open(termRef.current);
      fitAddon.fit();

      term.write('Connecting...\n');

      const ws = new WebSocket(url);
      wsInstance.current = ws;

      ws.onopen = (event) => {
        console.log(event.type);
        console.log('ws.onopen', url)

        console.log({termCols: term.cols, termRows: term.rows, ...fitAddon.proposeDimensions()});
        const msg = JSON.stringify({action: 'resize', cols: term.cols, rows: term.rows});
        ws.send(msg);

        term.focus();
      };

      ws.onclose = (event) => {
        console.log(event.type);
        if (event.wasClean === true) {
          console.log('ws closed cleanly');
        } else {
          console.log('ws closed unexpectedly');
        }
      };

      ws.onerror = (error) => {
        console.log('ws.onerror', error)
      };

      ws.onmessage = (event) => {
        // console.log(event.type);
        term.write(event.data);
      };

      term.onData((data) => {
        const msg = JSON.stringify({action: 'stdin', data: data});
        console.log(msg)
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(msg);
        } else {
          console.log('ws is not open', ws.readyState);
        }
      });

      term.onResize(({cols, rows}) => {
        const msg = JSON.stringify({action: 'resize', cols: cols, rows: rows});
        console.log(msg)
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(msg);
        } else {
          console.log('ws is not open', ws.readyState);
        }
      });

      const handleResize = () => {
        console.log('resize');
        fitAddon.fit();
      };
      resizeHandler.current = handleResize;
      window.addEventListener('resize', handleResize);
    }
  }

  return (
    <>
      <div
        ref={termRef}
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: '#000'
        }}
      />
    </>
  );
}

export default TerminalExt;
