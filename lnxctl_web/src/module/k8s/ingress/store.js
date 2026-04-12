import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  ingress: {},
  ingresses: [],
  ingressDetailVisible: false,
  ingressYamlVisible: false,
  ingressTableLoading: false,
};

const ingressSlice = createSlice({
  name: 'k8sIngress',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setIngress: (state, action) => {state.ingress = action.payload;},
    setIngresses: (state, action) => {state.ingresses = action.payload;},
    setIngressDetailVisible: (state, action) => {state.ingressDetailVisible = action.payload;},
    setIngressYamlVisible: (state, action) => {state.ingressYamlVisible = action.payload;},
    setIngressTableLoading: (state, action) => {state.ingressTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sIngress.context;
const getIngress = (state) => state.k8sIngress.ingress;
const getIngresses = (state) => state.k8sIngress.ingresses;
const getIngressDetailVisible = (state) => state.k8sIngress.ingressDetailVisible;
const getIngressYamlVisible = (state) => state.k8sIngress.ingressYamlVisible;
const getIngressTableLoading = (state) => state.k8sIngress.ingressTableLoading;

const {setContext} = ingressSlice.actions;
const {setIngress} = ingressSlice.actions;
const {setIngresses} = ingressSlice.actions;
const {setIngressDetailVisible} = ingressSlice.actions;
const {setIngressYamlVisible} = ingressSlice.actions;
const {setIngressTableLoading} = ingressSlice.actions;

const store = {
  ingressSlice,
  getContext,
  getIngress,
  getIngresses,
  getIngressDetailVisible,
  getIngressYamlVisible,
  getIngressTableLoading,
  setContext,
  setIngress,
  setIngresses,
  setIngressDetailVisible,
  setIngressYamlVisible,
  setIngressTableLoading,
};

export default store;
