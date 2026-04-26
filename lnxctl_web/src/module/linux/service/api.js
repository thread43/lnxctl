import http from '../../../util/http.js';

function add_service(service) {
  const {name} = service;
  const {start_cmd, stop_cmd, restart_cmd, reload_cmd, status_cmd} = service;
  const {term_cmd} = service;
  const {remark} = service;

  const formData = new FormData();
  formData.append('name', name);
  if (start_cmd !== undefined) {
    formData.append('start_cmd', start_cmd);
  }
  if (stop_cmd !== undefined) {
    formData.append('stop_cmd', stop_cmd);
  }
  if (restart_cmd !== undefined) {
    formData.append('restart_cmd', restart_cmd);
  }
  if (reload_cmd !== undefined) {
    formData.append('reload_cmd', reload_cmd);
  }
  if (status_cmd !== undefined) {
    formData.append('status_cmd', status_cmd);
  }
  if (term_cmd !== undefined) {
    formData.append('term_cmd', term_cmd);
  }
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/linux/service/add_service', formData);
}

function delete_service(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/linux/service/delete_service', formData);
}

function get_service(id) {
  return http.get('/api/linux/service/get_service?id=' + id);
}

function get_services() {
  return http.get('/api/linux/service/get_services');
}

function reload_service(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/linux/service/reload_service', formData);
}

function restart_service(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/linux/service/restart_service', formData);
}

function start_service(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/linux/service/start_service', formData);
}

function status_service(id) {
  return http.get('/api/linux/service/status_service?id=' + id);
}

function stop_service(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/linux/service/stop_service', formData);
}

function update_service(service) {
  const {id, name} = service;
  const {start_cmd, stop_cmd, restart_cmd, reload_cmd, status_cmd} = service;
  const {term_cmd} = service;
  const {remark} = service;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  if (start_cmd !== undefined) {
    formData.append('start_cmd', start_cmd);
  }
  if (stop_cmd !== undefined) {
    formData.append('stop_cmd', stop_cmd);
  }
  if (restart_cmd !== undefined) {
    formData.append('restart_cmd', restart_cmd);
  }
  if (reload_cmd !== undefined) {
    formData.append('reload_cmd', reload_cmd);
  }
  if (status_cmd !== undefined) {
    formData.append('status_cmd', status_cmd);
  }
  if (term_cmd !== undefined) {
    formData.append('term_cmd', term_cmd);
  }
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/linux/service/update_service', formData);
}

const api = {
  add_service,
  delete_service,
  get_service,
  get_services,
  reload_service,
  restart_service,
  start_service,
  status_service,
  stop_service,
  update_service,
};

export default api;
