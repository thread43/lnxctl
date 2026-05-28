import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/role/get_clusters');
}

function get_namespaces(cluster_id) {
  let url = '/api/k8s/role/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;

  return http.get(url);
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
  let url = '/api/k8s/role/get_roles';

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
  get_role_yaml,
  get_roles,
};

export default api;
