import React, { useEffect, useState } from 'react';
import PlumbContainer from './PlumbContainer';
import { v4 as uuid } from 'uuid';
import './App.css';
import { newInstance } from '@jsplumb/browser-ui';
import { Form, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@jsplumb/connector-flowchart';
function App() {
  const [instance, setInstance] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [nodeName, setNodeName] = useState('');
  const [options, setOptions] = useState({ maxConnections: 1 });
  const [connections, setConnections] = useState([]);
  useEffect(() => {
    const instance = newInstance({
      container: document.getElementById('container'),
      dragOptions: {
        cursor: 'pointer',
        zIndex: 2000,
        containment: 'parentEnclosed',
      },
    });

    instance.bind('connection', (connection) => {
      alert('New connection established');
      setConnections([...connections, connection]);
    });
    instance.bind('connection:click', (connector) => {
      instance.deleteConnection(connector);
    });

    ///delete node
    document.addEventListener('click', (event) => {
      if (event.srcElement)
        if (event.srcElement.id)
          if (event.srcElement.id.includes('delete')) {
            const id = event.srcElement.id.replace('delete', '');
            const node = document.getElementById(id);
            instance.removeAllEndpoints(node);
            instance._removeElement(node);
          }
    });

    setInstance(instance);

    //eslint-disable-next-line
  }, []);
  function createNewNode(name, options) {
    const container = document.getElementById('container');
    if (instance) {
      const id = uuid();
      const newNode = document.createElement('div');
      newNode.setAttribute('id', id);
      newNode.setAttribute('class', 'node');
      const nameNode = document.createTextNode(name);

      const button = document.createElement('pre');

      button.setAttribute('class', 'text-danger delete-pre');
      button.setAttribute('id', `${id}delete`);
      button.innerText = 'Delete';

      newNode.appendChild(button);
      newNode.appendChild(nameNode);
      container.appendChild(newNode);

      instance.addEndpoint(newNode, {
        endpoint: 'Dot',
        anchor: 'AutoDefault',
        source: true,
        target: true,
        maxConnections: options.maxConnections,
        connectorStyle: { stroke: 'green', strokeWidth: 5 },
        connectorHoverStyle: { stroke: 'red', strokeWidth: 7 },
        onMaxConnections: () => alert(`Node is at max connections!`),
      });

      setNodes([...nodes, id]);
    }
  }

  return (
    <div className='App'>
      <Row>
        <Col lg={2}>
          <div className='controls border'>
            <h2>JSPlumb</h2>
            <Form.Group>
              <Form.Label>Node Name</Form.Label>
              <Form.Control
                type='text'
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Node Max Connections</Form.Label>
              <Form.Control
                type='number'
                value={options.maxConnections}
                onChange={(e) =>
                  setOptions({ ...options, maxConnections: e.target.value })
                }
              />
            </Form.Group>
            <Button
              onClick={() => {
                createNewNode(nodeName, options);
                setNodeName('');
              }}
              variant='success'
              className='control-button'
            >
              Create Node
            </Button>
            <Button
              onClick={() => instance.deleteEveryConnection()}
              variant='danger'
              className='control-button'
            >
              Delete all connections
            </Button>
          </div>
        </Col>
        <Col>
          {' '}
          <PlumbContainer id='container' className='border container'>
            {' '}
            <h2>Nodes</h2>
          </PlumbContainer>
        </Col>
      </Row>
    </div>
  );
}

export default App;
