import http from '../../../util/http.js';

function download_container_file(server_id, container_id, file) {
  let url = '/api/docker/container/download_container_file';
  url = url + '?server_id=' + server_id;
  url = url + '&container_id=' + container_id;
  url = url + '&file=' + encodeURIComponent(file);

  // return http.get(url);
  window.open(url, '_blank');
}

function download_container_log(server_id, container_id) {
  let url = '/api/docker/container/download_container_log';
  url = url + '?server_id=' + server_id;
  url = url + '&container_id=' + container_id;

  // return http.get(url);
  window.open(url, '_blank');
}

function get_container_files(server_id, container_id, dir) {
  let url = '/api/docker/container/get_container_files';
  url = url + '?server_id=' + server_id;
  url = url + '&container_id=' + container_id;
  url = url + '&dir=' + dir;

  return http.get(url);
}

function get_container_log(server_id, container_id) {
  let url = '/api/docker/container/get_container_log';
  url = url + '?server_id=' + server_id;
  url = url + '&container_id=' + container_id;

  return http.get(url);
}

function get_containers(server_id) {
  let url = '/api/docker/container/get_containers';
  url = url + '?server_id=' + server_id;

  return http.get(url);
}

function get_servers() {
  return http.get('/api/docker/container/get_servers');
}

function inspect_container(container) {
  const server_id = container.server_id;
  const container_id = container.container_id;

  let url = '/api/docker/container/inspect_container';
  url = url + '?server_id=' + server_id;
  url = url + '&container_id=' + container_id;

  return http.get(url);
}

function restart_container(server_id, container_id) {
  let url = '/api/docker/container/restart_container';
  url = url + '?server_id=' + server_id;
  url = url + '&container_id=' + container_id;

  return http.get(url);
}

const api = {
  download_container_file,
  download_container_log,
  get_container_files,
  get_container_log,
  get_containers,
  get_servers,
  inspect_container,
  restart_container,
};

export default api;
