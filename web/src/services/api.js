import request from '../utils/request';

export function sms({ mobile }) {
  return request('/sms', {
    method: 'POST',
    json: { mobile },
  });
}

export function auth({ mobile, code }) {
  return request('/sms/auth', {
    method: 'POST',
    json: { mobile, code },
  }).then(data => {
    window.localStorage.setItem('access_token', data.access_token);
    return Promise.resolve(data);
  });
}

export function unauth() {
  return request('/sms/auth', {
    method: 'DELETE'
  });
}

export function me() {
  return request('/me')
    .then(data => ({ data }))
    .catch(err => ({ err }));
}

export function register({ name }) {
  return request('/me', {
    method: 'POST',
    json: { name },
  });
}

export function my_coins() {
  return request('/states');
}

export function my_values() {
  return request('/states/history');
}

export function coin({ id }) {
  return request(`/coins/${id}`);
}