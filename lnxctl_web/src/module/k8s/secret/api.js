import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/secret/get_clusters');
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/secret/get_namespaces?cluster_id=' + cluster_id);
}

function get_secret_yaml(secret) {
  const cluster_id = secret.cluster_id;
  const namespace = secret.namespace;
  const name = secret.name;

  let url = '/api/k8s/secret/get_secret_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_secrets(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/secret/get_secrets?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/secret/get_secrets?cluster_id=' + cluster_id);
  }
}

const api = {
  get_clusters,
  get_namespaces,
  get_secret_yaml,
  get_secrets,
};

export default api;
