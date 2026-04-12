import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/ingress/get_clusters');
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/ingress/get_namespaces?cluster_id=' + cluster_id);
}

function get_ingress_yaml(ingress) {
  const cluster_id = ingress.cluster_id;
  const namespace = ingress.namespace;
  const name = ingress.name;

  let url = '/api/k8s/ingress/get_ingress_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_ingresses(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/ingress/get_ingresses?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/ingress/get_ingresses?cluster_id=' + cluster_id);
  }
}

const api = {
  get_clusters,
  get_namespaces,
  get_ingress_yaml,
  get_ingresses,
};

export default api;
