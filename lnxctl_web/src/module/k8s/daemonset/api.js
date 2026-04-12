import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/daemonset/get_clusters');
}

function get_daemonset_yaml(daemonset) {
  const cluster_id = daemonset.cluster_id;
  const namespace = daemonset.namespace;
  const name = daemonset.name;

  let url = '/api/k8s/daemonset/get_daemonset_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_daemonsets(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/daemonset/get_daemonsets?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/daemonset/get_daemonsets?cluster_id=' + cluster_id);
  }
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/daemonset/get_namespaces?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_daemonset_yaml,
  get_daemonsets,
  get_namespaces,
};

export default api;
