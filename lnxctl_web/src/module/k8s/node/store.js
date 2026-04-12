import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  node: {},
  nodes: [],
  nodeDetailVisible: false,
  nodeYamlVisible: false,
  nodeTableLoading: false,
};

const nodeSlice = createSlice({
  name: 'k8sNode',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setNode: (state, action) => {state.node = action.payload;},
    setNodes: (state, action) => {state.nodes = action.payload;},
    setNodeDetailVisible: (state, action) => {state.nodeDetailVisible = action.payload;},
    setNodeYamlVisible: (state, action) => {state.nodeYamlVisible = action.payload;},
    setNodeTableLoading: (state, action) => {state.nodeTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sNode.context;
const getNode = (state) => state.k8sNode.node;
const getNodes = (state) => state.k8sNode.nodes;
const getNodeDetailVisible = (state) => state.k8sNode.nodeDetailVisible;
const getNodeYamlVisible = (state) => state.k8sNode.nodeYamlVisible;
const getNodeTableLoading = (state) => state.k8sNode.nodeTableLoading;

const {setContext} = nodeSlice.actions;
const {setNode} = nodeSlice.actions;
const {setNodes} = nodeSlice.actions;
const {setNodeDetailVisible} = nodeSlice.actions;
const {setNodeYamlVisible} = nodeSlice.actions;
const {setNodeTableLoading} = nodeSlice.actions;

const store = {
  nodeSlice,
  getContext,
  getNode,
  getNodes,
  getNodeDetailVisible,
  getNodeYamlVisible,
  getNodeTableLoading,
  setContext,
  setNode,
  setNodes,
  setNodeDetailVisible,
  setNodeYamlVisible,
  setNodeTableLoading,
};

export default store;
