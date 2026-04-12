import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/pvc/get_clusters');
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/pvc/get_namespaces?cluster_id=' + cluster_id);
}

function get_pvc_yaml(pvc) {
  const cluster_id = pvc.cluster_id;
  const namespace = pvc.namespace;
  const name = pvc.name;

  let url = '/api/k8s/pvc/get_pvc_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_pvcs(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/pvc/get_pvcs?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/pvc/get_pvcs?cluster_id=' + cluster_id);
  }
}

const api = {
  get_clusters,
  get_namespaces,
  get_pvc_yaml,
  get_pvcs,
};

export default api;
