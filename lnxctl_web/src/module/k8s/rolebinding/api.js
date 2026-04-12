import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/rolebinding/get_clusters');
}

function get_rolebinding_yaml(rolebinding) {
  const cluster_id = rolebinding.cluster_id;
  const namespace = rolebinding.namespace;
  const name = rolebinding.name;

  let url = '/api/k8s/rolebinding/get_rolebinding_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_rolebindings(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/rolebinding/get_rolebindings?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/rolebinding/get_rolebindings?cluster_id=' + cluster_id);
  }
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/rolebinding/get_namespaces?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_rolebinding_yaml,
  get_rolebindings,
  get_namespaces,
};

export default api;
