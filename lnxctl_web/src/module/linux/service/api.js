import http from '../../../util/http.js';

function add_service(service) {
  const {name, term_cmd, remark} = service;

  const formData = new FormData();
  formData.append('name', name);
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

function update_service(service) {
  const {id, name, term_cmd, remark} = service;

  const formData = new FormData();
  formData.append('id', id);
  formData.append('name', name);
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
  update_service,
};

export default api;
