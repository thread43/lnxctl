import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/clusterrolebinding/get_clusters');
}

function get_clusterrolebinding_yaml(clusterrolebinding) {
  const cluster_id = clusterrolebinding.cluster_id;
  const name = clusterrolebinding.name;

  let url = '/api/k8s/clusterrolebinding/get_clusterrolebinding_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_clusterrolebindings(cluster_id) {
  return http.get('/api/k8s/clusterrolebinding/get_clusterrolebindings?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_clusterrolebinding_yaml,
  get_clusterrolebindings,
};

export default api;
