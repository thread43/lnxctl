import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  pv: {},
  pvs: [],
  pvDetailVisible: false,
  pvYamlVisible: false,
  pvTableLoading: false,
};

const pvSlice = createSlice({
  name: 'k8sPv',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setPv: (state, action) => {state.pv = action.payload;},
    setPvs: (state, action) => {state.pvs = action.payload;},
    setPvDetailVisible: (state, action) => {state.pvDetailVisible = action.payload;},
    setPvYamlVisible: (state, action) => {state.pvYamlVisible = action.payload;},
    setPvTableLoading: (state, action) => {state.pvTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sPv.context;
const getPv = (state) => state.k8sPv.pv;
const getPvs = (state) => state.k8sPv.pvs;
const getPvDetailVisible = (state) => state.k8sPv.pvDetailVisible;
const getPvYamlVisible = (state) => state.k8sPv.pvYamlVisible;
const getPvTableLoading = (state) => state.k8sPv.pvTableLoading;

const {setContext} = pvSlice.actions;
const {setPv} = pvSlice.actions;
const {setPvs} = pvSlice.actions;
const {setPvDetailVisible} = pvSlice.actions;
const {setPvYamlVisible} = pvSlice.actions;
const {setPvTableLoading} = pvSlice.actions;

const store = {
  pvSlice,
  getContext,
  getPv,
  getPvs,
  getPvDetailVisible,
  getPvYamlVisible,
  getPvTableLoading,
  setContext,
  setPv,
  setPvs,
  setPvDetailVisible,
  setPvYamlVisible,
  setPvTableLoading,
};

export default store;
