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
  if (namespace !== '') {
    return http.get('/api/k8s/job/get_jobs?cluster_id=' + cluster_id + '&namespace=' + namespace);
  } else {
    return http.get('/api/k8s/job/get_jobs?cluster_id=' + cluster_id);
  }
}

function get_namespaces(cluster_id) {
  return http.get('/api/k8s/job/get_namespaces?cluster_id=' + cluster_id);
}

const api = {
  get_clusters,
  get_job_yaml,
  get_jobs,
  get_namespaces,
};

export default api;
