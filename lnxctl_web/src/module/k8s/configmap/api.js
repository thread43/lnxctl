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
  let url = '/api/k8s/configmap/get_configmaps';
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
  let url = '/api/k8s/configmap/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;

  return http.get(url);
}

const api = {
  get_clusters,
  get_configmap_yaml,
  get_configmaps,
  get_namespaces,
};

export default api;
