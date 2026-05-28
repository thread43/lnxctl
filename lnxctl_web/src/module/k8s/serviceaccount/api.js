import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/serviceaccount/get_clusters');
}

function get_namespaces(cluster_id) {
  let url = '/api/k8s/serviceaccount/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;
  return http.get(url);
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
  let url = '/api/k8s/serviceaccount/get_serviceaccounts';
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
  get_serviceaccount_yaml,
  get_serviceaccounts,
};

export default api;
