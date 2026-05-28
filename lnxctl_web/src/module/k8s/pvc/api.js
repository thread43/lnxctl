import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/pvc/get_clusters');
}

function get_namespaces(cluster_id) {
  let url = '/api/k8s/pvc/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;

  return http.get(url);
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
  let url = '/api/k8s/pvc/get_pvcs';
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
  get_pvc_yaml,
  get_pvcs,
};

export default api;
