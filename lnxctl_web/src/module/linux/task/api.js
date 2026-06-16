import http from '../../../util/http.js';

function add_task(task) {
  const {name, command, remark} = task;

  const formData = new FormData();
  formData.append('name', name);
  formData.append('command', command);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/linux/task/add_task', formData);
}

function delete_task(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/linux/task/delete_task', formData);
}

function download_task() {
  let url = '/api/linux/task/download_task';

  // return http.get(url);
  window.open(url, '_blank');
}

function get_task(id) {
  return http.get('/api/linux/task/get_task?id=' + id);
}

function get_tasks() {
  return http.get('/api/linux/task/get_tasks');
}

function run_task(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/linux/task/run_task', formData);
}

function update_task(task) {
  const {id, name, command, remark} = task;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  formData.append('command', command);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/linux/task/update_task', formData);
}

const api = {
  add_task,
  delete_task,
  download_task,
  get_task,
  get_tasks,
  run_task,
  update_task,
};

export default api;
