import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  network: {},
  networks: [],
  networkDetailVisible: false,
  networkJsonVisible: false,
  networkTableLoading: false,
};

const networkSlice = createSlice({
  name: 'dockerNetwork',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setNetwork: (state, action) => {state.network = action.payload;},
    setNetworks: (state, action) => {state.networks = action.payload;},
    setNetworkDetailVisible: (state, action) => {state.networkDetailVisible = action.payload;},
    setNetworkJsonVisible: (state, action) => {state.networkJsonVisible = action.payload;},
    setNetworkTableLoading: (state, action) => {state.networkTableLoading = action.payload;},
  },
});

const getContext = (state) => state.dockerNetwork.context;
const getNetwork = (state) => state.dockerNetwork.network;
const getNetworks = (state) => state.dockerNetwork.networks;
const getNetworkDetailVisible = (state) => state.dockerNetwork.networkDetailVisible;
const getNetworkJsonVisible = (state) => state.dockerNetwork.networkJsonVisible;
const getNetworkTableLoading = (state) => state.dockerNetwork.networkTableLoading;

const {setContext} = networkSlice.actions;
const {setNetwork} = networkSlice.actions;
const {setNetworks} = networkSlice.actions;
const {setNetworkDetailVisible} = networkSlice.actions;
const {setNetworkJsonVisible} = networkSlice.actions;
const {setNetworkTableLoading} = networkSlice.actions;

const store = {
  networkSlice,
  getContext,
  getNetwork,
  getNetworks,
  getNetworkDetailVisible,
  getNetworkJsonVisible,
  getNetworkTableLoading,
  setContext,
  setNetwork,
  setNetworks,
  setNetworkDetailVisible,
  setNetworkJsonVisible,
  setNetworkTableLoading,
};

export default store;
