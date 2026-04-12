import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  role: {},
  roles: [],
  roleDetailVisible: false,
  roleYamlVisible: false,
  roleTableLoading: false,
};

const roleSlice = createSlice({
  name: 'k8sRole',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setRole: (state, action) => {state.role = action.payload;},
    setRoles: (state, action) => {state.roles = action.payload;},
    setRoleDetailVisible: (state, action) => {state.roleDetailVisible = action.payload;},
    setRoleYamlVisible: (state, action) => {state.roleYamlVisible = action.payload;},
    setRoleTableLoading: (state, action) => {state.roleTableLoading = action.payload;},
  },
});

const getContext = (state) => state.k8sRole.context;
const getRole = (state) => state.k8sRole.role;
const getRoles = (state) => state.k8sRole.roles;
const getRoleDetailVisible = (state) => state.k8sRole.roleDetailVisible;
const getRoleYamlVisible = (state) => state.k8sRole.roleYamlVisible;
const getRoleTableLoading = (state) => state.k8sRole.roleTableLoading;

const {setContext} = roleSlice.actions;
const {setRole} = roleSlice.actions;
const {setRoles} = roleSlice.actions;
const {setRoleDetailVisible} = roleSlice.actions;
const {setRoleYamlVisible} = roleSlice.actions;
const {setRoleTableLoading} = roleSlice.actions;

const store = {
  roleSlice,
  getContext,
  getRole,
  getRoles,
  getRoleDetailVisible,
  getRoleYamlVisible,
  getRoleTableLoading,
  setContext,
  setRole,
  setRoles,
  setRoleDetailVisible,
  setRoleYamlVisible,
  setRoleTableLoading,
};

export default store;
