import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  clusterrole: {},
  clusterroles: [],
  clusterroleDetailVisible: false,
  clusterroleYamlVisible: false,
  clusterroleTableLoading: false,
};

const clusterroleSlice = createSlice({
  name: 'k8sClusterrole',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setClusterrole: (state, action) => {state.clusterrole = action.payload;},
    setClusterroles: (state, action) => {state.clusterroles = action.payload;},
    setClusterroleDetailVisible: (state, action) => {state.clusterroleDetailVisible = action.payload;},
    setClusterroleYamlVisible: (state, action) => {state.clusterroleYamlVisible = action.payload;},
    setClusterroleTableLoading: (state, action) => {state.clusterroleTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sClusterrole.context;
const getClusterrole = (state) => state.k8sClusterrole.clusterrole;
const getClusterroles = (state) => state.k8sClusterrole.clusterroles;
const getClusterroleDetailVisible = (state) => state.k8sClusterrole.clusterroleDetailVisible;
const getClusterroleYamlVisible = (state) => state.k8sClusterrole.clusterroleYamlVisible;
const getClusterroleTableLoading = (state) => state.k8sClusterrole.clusterroleTableLoading;

const {setContext} = clusterroleSlice.actions;
const {setClusterrole} = clusterroleSlice.actions;
const {setClusterroles} = clusterroleSlice.actions;
const {setClusterroleDetailVisible} = clusterroleSlice.actions;
const {setClusterroleYamlVisible} = clusterroleSlice.actions;
const {setClusterroleTableLoading} = clusterroleSlice.actions;

const store = {
  clusterroleSlice,
  getContext,
  getClusterrole,
  getClusterroles,
  getClusterroleDetailVisible,
  getClusterroleYamlVisible,
  getClusterroleTableLoading,
  setContext,
  setClusterrole,
  setClusterroles,
  setClusterroleDetailVisible,
  setClusterroleYamlVisible,
  setClusterroleTableLoading,
};

export default store;
