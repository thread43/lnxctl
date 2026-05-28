import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/cronjob/get_clusters');
}

function get_cronjob_yaml(cronjob) {
  const cluster_id = cronjob.cluster_id;
  const namespace = cronjob.namespace;
  const name = cronjob.name;

  let url = '/api/k8s/cronjob/get_cronjob_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_cronjobs(cluster_id, namespace) {
  let url = '/api/k8s/cronjob/get_cronjobs';
  if (namespace !== '') {
    url = url + '?cluster_id=' + cluster_id;
    url = url + '&namespace=' + namespace;
    return http.get(url);
  } else {
    url = url + '?cluster_id=' + cluster_id;
    return http.get(url);
  }
}

function get_namespaces(cluster_id) {
  let url = '/api/k8s/cronjob/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;

  return http.get(url);
}

const api = {
  get_clusters,
  get_cronjob_yaml,
  get_cronjobs,
  get_namespaces,
};

export default api;
