import http from '../../../util/http.js';

function get_clusters() {
  return http.get('/api/k8s/job/get_clusters');
}

function get_job_yaml(job) {
  const cluster_id = job.cluster_id;
  const namespace = job.namespace;
  const name = job.name;

  let url = '/api/k8s/job/get_job_yaml';
  url = url + '?cluster_id=' + cluster_id;
  url = url + '&namespace=' + namespace;
  url = url + '&name=' + name;

  return http.get(url);
}

function get_jobs(cluster_id, namespace) {
  let url = '/api/k8s/job/get_jobs';
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
  let url = '/api/k8s/job/get_namespaces';
  url = url + '?cluster_id=' + cluster_id;

  return http.get(url);
}

const api = {
  get_clusters,
  get_job_yaml,
  get_jobs,
  get_namespaces,
};

export default api;
