import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/replicaset/get_clusters');
}

function get_namespaces(cluster_id) {
  let url = '/api/k8s/replicaset/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;
  return http.get(url);
}

function get_replicaset_yaml(replicaset) {
  const cluster_id = replicaset.cluster_id;
  const namespace = replicaset.namespace;
  const name = replicaset.name;

  let url = '/api/k8s/replicaset/get_replicaset_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_replicasets(cluster_id, namespace) {
  let url = '/api/k8s/replicaset/get_replicasets';
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
  get_replicaset_yaml,
  get_replicasets,
};

export default api;
