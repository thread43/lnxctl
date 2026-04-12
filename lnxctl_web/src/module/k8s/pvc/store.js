import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  pvc: {},
  pvcs: [],
  pvcDetailVisible: false,
  pvcYamlVisible: false,
  pvcTableLoading: false,
};

const pvcSlice = createSlice({
  name: 'k8sPvc',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setPvc: (state, action) => {state.pvc = action.payload;},
    setPvcs: (state, action) => {state.pvcs = action.payload;},
    setPvcDetailVisible: (state, action) => {state.pvcDetailVisible = action.payload;},
    setPvcYamlVisible: (state, action) => {state.pvcYamlVisible = action.payload;},
    setPvcTableLoading: (state, action) => {state.pvcTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sPvc.context;
const getPvc = (state) => state.k8sPvc.pvc;
const getPvcs = (state) => state.k8sPvc.pvcs;
const getPvcDetailVisible = (state) => state.k8sPvc.pvcDetailVisible;
const getPvcYamlVisible = (state) => state.k8sPvc.pvcYamlVisible;
const getPvcTableLoading = (state) => state.k8sPvc.pvcTableLoading;

const {setContext} = pvcSlice.actions;
const {setPvc} = pvcSlice.actions;
const {setPvcs} = pvcSlice.actions;
const {setPvcDetailVisible} = pvcSlice.actions;
const {setPvcYamlVisible} = pvcSlice.actions;
const {setPvcTableLoading} = pvcSlice.actions;

const store = {
  pvcSlice,
  getContext,
  getPvc,
  getPvcs,
  getPvcDetailVisible,
  getPvcYamlVisible,
  getPvcTableLoading,
  setContext,
  setPvc,
  setPvcs,
  setPvcDetailVisible,
  setPvcYamlVisible,
  setPvcTableLoading,
};

export default store;
