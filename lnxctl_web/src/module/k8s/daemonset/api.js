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
  let url = '/api/k8s/daemonset/get_daemonsets';
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
  let url = '/api/k8s/daemonset/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;

  return http.get(url);
}

const api = {
  get_clusters,
  get_daemonset_yaml,
  get_daemonsets,
  get_namespaces,
};

export default api;
