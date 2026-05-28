import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/secret/get_clusters');
}

function get_namespaces(cluster_id) {
  let url = '/api/k8s/secret/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;

  return http.get(url);
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
  let url = '/api/k8s/secret/get_secrets';
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
  get_secret_yaml,
  get_secrets,
};

export default api;
