import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  replicaset: {},
  replicasets: [],
  replicasetDetailVisible: false,
  replicasetYamlVisible: false,
  replicasetTableLoading: false,
};

const replicasetSlice = createSlice({
  name: 'k8sReplicaset',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setReplicaset: (state, action) => {state.replicaset = action.payload;},
    setReplicasets: (state, action) => {state.replicasets = action.payload;},
    setReplicasetDetailVisible: (state, action) => {state.replicasetDetailVisible = action.payload;},
    setReplicasetYamlVisible: (state, action) => {state.replicasetYamlVisible = action.payload;},
    setReplicasetTableLoading: (state, action) => {state.replicasetTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sReplicaset.context;
const getReplicaset = (state) => state.k8sReplicaset.replicaset;
const getReplicasets = (state) => state.k8sReplicaset.replicasets;
const getReplicasetDetailVisible = (state) => state.k8sReplicaset.replicasetDetailVisible;
const getReplicasetYamlVisible = (state) => state.k8sReplicaset.replicasetYamlVisible;
const getReplicasetTableLoading = (state) => state.k8sReplicaset.replicasetTableLoading;

const {setContext} = replicasetSlice.actions;
const {setReplicaset} = replicasetSlice.actions;
const {setReplicasets} = replicasetSlice.actions;
const {setReplicasetDetailVisible} = replicasetSlice.actions;
const {setReplicasetYamlVisible} = replicasetSlice.actions;
const {setReplicasetTableLoading} = replicasetSlice.actions;

const store = {
  replicasetSlice,
  getContext,
  getReplicaset,
  getReplicasets,
  getReplicasetDetailVisible,
  getReplicasetYamlVisible,
  getReplicasetTableLoading,
  setContext,
  setReplicaset,
  setReplicasets,
  setReplicasetDetailVisible,
  setReplicasetYamlVisible,
  setReplicasetTableLoading,
};

export default store;
