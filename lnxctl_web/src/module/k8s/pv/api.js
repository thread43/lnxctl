import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/pv/get_clusters');
}

function get_pv_yaml(pv) {
  const cluster_id = pv.cluster_id;
  const name = pv.name;

  let url = '/api/k8s/pv/get_pv_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_pvs(cluster_id) {
  return http.get('/api/k8s/pv/get_pvs?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_pv_yaml,
  get_pvs,
};

export default api;
