import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/service/get_clusters');
}

function get_namespaces(cluster_id) {
  let url = '/api/k8s/service/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;

  return http.get(url);
}

function get_service_yaml(service) {
  const cluster_id = service.cluster_id;
  const namespace = service.namespace;
  const name = service.name;

  let url = '/api/k8s/service/get_service_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_services(cluster_id, namespace) {
  let url = '/api/k8s/service/get_services';

  if (namespace !== '') {
    url = url + '?cluster_id=' + cluster_id;
    url = url + '&namespace=' + namespace;
    return http.get(url);
  } else {
    url = url + '?cluster_id=' + cluster_id;
    return http.get(url);
  }
}

const api = {
  get_clusters,
  get_namespaces,
  get_service_yaml,
  get_services,
};

export default api;
