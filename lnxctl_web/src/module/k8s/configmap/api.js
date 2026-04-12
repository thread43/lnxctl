import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/configmap/get_clusters');
}

function get_configmap_yaml(configmap) {
  const cluster_id = configmap.cluster_id;
  const namespace = configmap.namespace;
  const name = configmap.name;

  let url = '/api/k8s/configmap/get_configmap_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_configmaps(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/configmap/get_configmaps?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/configmap/get_configmaps?cluster_id=' + cluster_id);
  }
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/configmap/get_namespaces?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_configmap_yaml,
  get_configmaps,
  get_namespaces,
};

export default api;
