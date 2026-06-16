import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  context: {},
  task: {},
  tasks: [],
  taskDetailVisible: false,
  taskFormAddVisible: false,
  taskFormUpdateVisible: false,
  taskRunVisible: false,
  taskTableLoading: false,
};

const taskSlice = createSlice({
  name: 'linuxTask',
  initialState,
  reducers: {
    setContext: (state, action) => {state.context = action.payload;},
    setTask: (state, action) => {state.task = action.payload;},
    setTasks: (state, action) => {state.tasks = action.payload;},
    setTaskDetailVisible: (state, action) => {state.taskDetailVisible = action.payload;},
    setTaskFormAddVisible: (state, action) => {state.taskFormAddVisible = action.payload;},
    setTaskFormUpdateVisible: (state, action) => {state.taskFormUpdateVisible = action.payload;},
    setTaskRunVisible: (state, action) => {state.taskRunVisible = action.payload;},
    setTaskTableLoading: (state, action) => {state.taskTableLoading = action.payload;},
  },
});

const getContext = (state) => state.linuxTask.context;
const getTask = (state) => state.linuxTask.task;
const getTasks = (state) => state.linuxTask.tasks;
const getTaskDetailVisible = (state) => state.linuxTask.taskDetailVisible;
const getTaskFormAddVisible = (state) => state.linuxTask.taskFormAddVisible;
const getTaskFormUpdateVisible = (state) => state.linuxTask.taskFormUpdateVisible;
const getTaskRunVisible = (state) => state.linuxTask.taskRunVisible;
const getTaskTableLoading = (state) => state.linuxTask.taskTableLoading;

const {setContext} = taskSlice.actions;
const {setTask} = taskSlice.actions;
const {setTasks} = taskSlice.actions;
const {setTaskDetailVisible} = taskSlice.actions;
const {setTaskFormAddVisible} = taskSlice.actions;
const {setTaskFormUpdateVisible} = taskSlice.actions;
const {setTaskRunVisible} = taskSlice.actions;
const {setTaskTableLoading} = taskSlice.actions;

const store = {
  taskSlice,
  getContext,
  getTask,
  getTasks,
  getTaskDetailVisible,
  getTaskFormAddVisible,
  getTaskFormUpdateVisible,
  getTaskRunVisible,
  getTaskTableLoading,
  setContext,
  setTask,
  setTasks,
  setTaskDetailVisible,
  setTaskFormAddVisible,
  setTaskFormUpdateVisible,
  setTaskRunVisible,
  setTaskTableLoading,
};

export default store;
