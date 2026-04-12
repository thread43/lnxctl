import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/role/get_clusters');
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/role/get_namespaces?cluster_id=' + cluster_id);
}

function get_role_yaml(role) {
  const cluster_id = role.cluster_id;
  const namespace = role.namespace;
  const name = role.name;

  let url = '/api/k8s/role/get_role_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_roles(cluster_id, namespace) {
  if (namespace !== '') {
    return http.get('/api/k8s/role/get_roles?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/role/get_roles?cluster_id=' + cluster_id);
  }
}

const api = {
  get_clusters,
  get_namespaces,
  get_role_yaml,
  get_roles,
};

export default api;
