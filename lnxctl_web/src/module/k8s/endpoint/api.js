import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/endpoint/get_clusters');
}

function get_endpoint_yaml(endpoint) {
  const cluster_id = endpoint.cluster_id;
  const namespace = endpoint.namespace;
  const name = endpoint.name;

  let url = '/api/k8s/endpoint/get_endpoint_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_endpoints(cluster_id, namespace) {
  let url = '/api/k8s/endpoint/get_endpoints';
  if (namespace !== '') {
    url = url + '?cluster_id=' + cluster_id;
    url = url + '&namespace=' + namespace;
    return http.get(url);
  } else {
    url = url + '?cluster_id=' + cluster_id;
    return http.get(url);
  }
}

function get_namespaces(cluster_id) {
  let url = '/api/k8s/endpoint/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;

  return http.get(url);
}

const api = {
  get_clusters,
  get_endpoint_yaml,
  get_endpoints,
  get_namespaces,
};

export default api;
