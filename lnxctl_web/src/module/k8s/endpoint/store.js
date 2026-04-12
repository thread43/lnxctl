import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  endpoint: {},
  endpoints: [],
  endpointDetailVisible: false,
  endpointYamlVisible: false,
  endpointTableLoading: false,
};

const endpointSlice = createSlice({
  name: 'k8sEndpoint',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setEndpoint: (state, action) => {state.endpoint = action.payload;},
    setEndpoints: (state, action) => {state.endpoints = action.payload;},
    setEndpointDetailVisible: (state, action) => {state.endpointDetailVisible = action.payload;},
    setEndpointYamlVisible: (state, action) => {state.endpointYamlVisible = action.payload;},
    setEndpointTableLoading: (state, action) => {state.endpointTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sEndpoint.context;
const getEndpoint = (state) => state.k8sEndpoint.endpoint;
const getEndpoints = (state) => state.k8sEndpoint.endpoints;
const getEndpointDetailVisible = (state) => state.k8sEndpoint.endpointDetailVisible;
const getEndpointYamlVisible = (state) => state.k8sEndpoint.endpointYamlVisible;
const getEndpointTableLoading = (state) => state.k8sEndpoint.endpointTableLoading;

const {setContext} = endpointSlice.actions;
const {setEndpoint} = endpointSlice.actions;
const {setEndpoints} = endpointSlice.actions;
const {setEndpointDetailVisible} = endpointSlice.actions;
const {setEndpointYamlVisible} = endpointSlice.actions;
const {setEndpointTableLoading} = endpointSlice.actions;

const store = {
  endpointSlice,
  getContext,
  getEndpoint,
  getEndpoints,
  getEndpointDetailVisible,
  getEndpointYamlVisible,
  getEndpointTableLoading,
  setContext,
  setEndpoint,
  setEndpoints,
  setEndpointDetailVisible,
  setEndpointYamlVisible,
  setEndpointTableLoading,
};

export default store;
