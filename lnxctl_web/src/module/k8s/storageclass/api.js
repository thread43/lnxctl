import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/storageclass/get_clusters');
}

function get_namespaces(cluster_id) {
  let url = '/api/k8s/storageclass/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;

  return http.get(url);
}

function get_storageclass_yaml(storageclass) {
  const cluster_id = storageclass.cluster_id;
  const namespace = storageclass.namespace;
  const name = storageclass.name;

  let url = '/api/k8s/storageclass/get_storageclass_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_storageclasses(cluster_id, namespace) {
  let url = '/api/k8s/storageclass/get_storageclasses';
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
  get_storageclass_yaml,
  get_storageclasses,
};

export default api;
