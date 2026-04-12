import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/clusterrole/get_clusters');
}

function get_clusterrole_yaml(clusterrole) {
  const cluster_id = clusterrole.cluster_id;
  const name = clusterrole.name;

  let url = '/api/k8s/clusterrole/get_clusterrole_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_clusterroles(cluster_id) {
  return http.get('/api/k8s/clusterrole/get_clusterroles?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_clusterrole_yaml,
  get_clusterroles,
};

export default api;
