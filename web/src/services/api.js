import request from '../utils/request';
import { Toast } from 'antd-mobile';

export const handleError = (err) => {
  // pop err message then interrupt
  Toast.fail(err.message);
  throw err;
}

export function sms({ mobile }) {
  return request('/sms', {
    method: 'POST',
    json: { mobile },
  }).catch(handleError);
}

export function auth({ mobile, code }) {
  return request('/sms/auth', {
    method: 'POST',
    json: { mobile, code },
  }).then(data => {
    window.localStorage.setItem('access_token', data.access_token);
    return Promise.resolve(data);
  }).catch(handleError);
}

export function unauth() {
  return request('/sms/auth', {
    method: 'DELETE'
  }).catch(handleError);
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
  }).catch(handleError);
}

export function my_coins() {
  return request('/states')
    .catch(handleError);
}

export function my_values() {
  return request('/states/history')
    .catch(handleError);
}

export function coins() {
  return request('/coins')
    .catch(handleError);
}

export function coin({ id }) {
  return request(`/coins/${id}`)
    .catch(handleError);
}