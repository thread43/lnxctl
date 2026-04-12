import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/serviceaccount/get_clusters');
}

function get_serviceaccount_yaml(serviceaccount) {
  const cluster_id = serviceaccount.cluster_id;
  const namespace = serviceaccount.namespace;
  const name = serviceaccount.name;

  let url = '/api/k8s/serviceaccount/get_serviceaccount_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_serviceaccounts(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/serviceaccount/get_serviceaccounts?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/serviceaccount/get_serviceaccounts?cluster_id=' + cluster_id);
  }
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/serviceaccount/get_namespaces?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_serviceaccount_yaml,
  get_serviceaccounts,
  get_namespaces,
};

export default api;
