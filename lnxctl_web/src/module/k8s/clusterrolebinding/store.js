import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  clusterrolebinding: {},
  clusterrolebindings: [],
  clusterrolebindingDetailVisible: false,
  clusterrolebindingYamlVisible: false,
  clusterrolebindingTableLoading: false,
};

const clusterrolebindingSlice = createSlice({
  name: 'k8sClusterrolebinding',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setClusterrolebinding: (state, action) => {state.clusterrolebinding = action.payload;},
    setClusterrolebindings: (state, action) => {state.clusterrolebindings = action.payload;},
    setClusterrolebindingDetailVisible: (state, action) => {state.clusterrolebindingDetailVisible = action.payload;},
    setClusterrolebindingYamlVisible: (state, action) => {state.clusterrolebindingYamlVisible = action.payload;},
    setClusterrolebindingTableLoading: (state, action) => {state.clusterrolebindingTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sClusterrolebinding.context;
const getClusterrolebinding = (state) => state.k8sClusterrolebinding.clusterrolebinding;
const getClusterrolebindings = (state) => state.k8sClusterrolebinding.clusterrolebindings;
const getClusterrolebindingDetailVisible = (state) => state.k8sClusterrolebinding.clusterrolebindingDetailVisible;
const getClusterrolebindingYamlVisible = (state) => state.k8sClusterrolebinding.clusterrolebindingYamlVisible;
const getClusterrolebindingTableLoading = (state) => state.k8sClusterrolebinding.clusterrolebindingTableLoading;

const {setContext} = clusterrolebindingSlice.actions;
const {setClusterrolebinding} = clusterrolebindingSlice.actions;
const {setClusterrolebindings} = clusterrolebindingSlice.actions;
const {setClusterrolebindingDetailVisible} = clusterrolebindingSlice.actions;
const {setClusterrolebindingYamlVisible} = clusterrolebindingSlice.actions;
const {setClusterrolebindingTableLoading} = clusterrolebindingSlice.actions;

const store = {
  clusterrolebindingSlice,
  getContext,
  getClusterrolebinding,
  getClusterrolebindings,
  getClusterrolebindingDetailVisible,
  getClusterrolebindingYamlVisible,
  getClusterrolebindingTableLoading,
  setContext,
  setClusterrolebinding,
  setClusterrolebindings,
  setClusterrolebindingDetailVisible,
  setClusterrolebindingYamlVisible,
  setClusterrolebindingTableLoading,
};

export default store;
