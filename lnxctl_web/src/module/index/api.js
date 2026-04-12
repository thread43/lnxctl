import http from '../../util/http.js';

function get_statistics() {
  return http.get('/api/index/get_statistics');
}

const api = {
  get_statistics,
};

export default api;
