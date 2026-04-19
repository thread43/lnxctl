import http from '../../../util/http.js';

function add_target(target) {
  const {name, crontab, type} = target;
  const {ping_host, tcp_host, tcp_port, http_url, http_status_code} = target;
  const {is_active, remark} = target;

  const formData = new FormData();
  formData.append('name', name);
  formData.append('crontab', crontab);
  formData.append('type', type);
  if (ping_host !== undefined) {
    formData.append('ping_host', ping_host);
  }
  if (tcp_host !== undefined) {
    formData.append('tcp_host', tcp_host);
  }
  if (tcp_port !== undefined) {
    formData.append('tcp_port', tcp_port);
  }
  if (http_url !== undefined) {
    formData.append('http_url', http_url);
  }
  if (http_status_code !== undefined) {
    formData.append('http_status_code', http_status_code);
  }
  formData.append('is_active', is_active);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/monitoring/target/add_target', formData);
}

function delete_target(id) {
  const formData = new FormData();
  formData.append('id', id);

  return http.post('/api/monitoring/target/delete_target', formData);
}

function get_target(id) {
  return http.get('/api/monitoring/target/get_target?id=' + id);
}

function get_targets() {
  return http.get('/api/monitoring/target/get_targets');
}

function update_target(target) {
  const {id} = target;
  const {name, crontab, type} = target;
  const {ping_host, tcp_host, tcp_port, http_url, http_status_code} = target;
  const {is_active, remark} = target;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
  formData.append('crontab', crontab);
  formData.append('type', type);
  if (ping_host !== undefined) {
    formData.append('ping_host', ping_host);
  }
  if (tcp_host !== undefined) {
    formData.append('tcp_host', tcp_host);
  }
  if (tcp_port !== undefined) {
    formData.append('tcp_port', tcp_port);
  }
  if (http_url !== undefined) {
    formData.append('http_url', http_url);
  }
  if (http_status_code !== undefined) {
    formData.append('http_status_code', http_status_code);
  }
  formData.append('is_active', is_active);
  if (remark !== undefined) {
    formData.append('remark', remark);
  }

  return http.post('/api/monitoring/target/update_target', formData);
}

const api = {
  add_target,
  delete_target,
  get_target,
  get_targets,
  update_target,
};

export default api;
