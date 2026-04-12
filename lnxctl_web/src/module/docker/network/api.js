import http from '../../../util/http.js';

function get_servers() {
  return http.get('/api/docker/network/get_servers');
}

function get_networks(server_id) {
  return http.get('/api/docker/network/get_networks?server_id=' + server_id);
}

function inspect_network(network) {
  const server_id = network.server_id;
  const network_id = network.network_id;

  let url = '/api/docker/network/inspect_network';
  url = url + '?server_id=' + server_id;
  url = url + '&network_id=' + network_id;

  return http.get(url);
}

const api = {
  get_servers,
  get_networks,
  inspect_network,
};

export default api;
