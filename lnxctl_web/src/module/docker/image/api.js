import http from '../../../util/http.js';

function get_servers() {
  return http.get('/api/docker/image/get_servers');
}

function get_images(server_id) {
  return http.get('/api/docker/image/get_images?server_id=' + server_id);
}

function inspect_image(image) {
  const server_id = image.server_id;
  const image_id = image.image_id;

  let url = '/api/docker/image/inspect_image';
  url = url + '?server_id=' + server_id;
  url = url + '&image_id=' + image_id;

  return http.get(url);
}

const api = {
  get_servers,
  get_images,
  inspect_image,
};

export default api;
