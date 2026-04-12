import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  secret: {},
  secrets: [],
  secretDetailVisible: false,
  secretYamlVisible: false,
  secretTableLoading: false,
};

const secretSlice = createSlice({
  name: 'k8sSecret',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setSecret: (state, action) => {state.secret = action.payload;},
    setSecrets: (state, action) => {state.secrets = action.payload;},
    setSecretDetailVisible: (state, action) => {state.secretDetailVisible = action.payload;},
    setSecretYamlVisible: (state, action) => {state.secretYamlVisible = action.payload;},
    setSecretTableLoading: (state, action) => {state.secretTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sSecret.context;
const getSecret = (state) => state.k8sSecret.secret;
const getSecrets = (state) => state.k8sSecret.secrets;
const getSecretDetailVisible = (state) => state.k8sSecret.secretDetailVisible;
const getSecretYamlVisible = (state) => state.k8sSecret.secretYamlVisible;
const getSecretTableLoading = (state) => state.k8sSecret.secretTableLoading;

const {setContext} = secretSlice.actions;
const {setSecret} = secretSlice.actions;
const {setSecrets} = secretSlice.actions;
const {setSecretDetailVisible} = secretSlice.actions;
const {setSecretYamlVisible} = secretSlice.actions;
const {setSecretTableLoading} = secretSlice.actions;

const store = {
  secretSlice,
  getContext,
  getSecret,
  getSecrets,
  getSecretDetailVisible,
  getSecretYamlVisible,
  getSecretTableLoading,
  setContext,
  setSecret,
  setSecrets,
  setSecretDetailVisible,
  setSecretYamlVisible,
  setSecretTableLoading,
};

export default store;
