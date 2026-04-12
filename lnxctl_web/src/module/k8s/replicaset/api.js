import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/replicaset/get_clusters');
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
  if (namespace !== '') {
    return http.get('/api/k8s/replicaset/get_replicasets?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/replicaset/get_replicasets?cluster_id=' + cluster_id);
  }
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/replicaset/get_namespaces?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_replicaset_yaml,
  get_replicasets,
  get_namespaces,
};

export default api;
