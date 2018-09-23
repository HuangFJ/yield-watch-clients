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

export function coin({ coin_id, unit }) {
  return request(`/coins/${coin_id}?unit=${unit}`)
    .catch(handleError);
}

export function get_coin_states({ coin_id }) {
  return request(`/states/${coin_id}`)
    .catch(handleError);
}

export function del_coin_state({ id }) {
  return request(`/states`, {
    method: 'DELETE',
    json: { id },
  })
    .catch(handleError);
}

export function set_coin_state({ id, coin_id, amount, created }) {
  return request(`/states`, {
    method: 'PUT',
    json: { id, coin_id, amount, created },
  })
    .catch(handleError);
}

export function del_balance(payload) {
  return request(`/balance`, {
    method: 'DELETE',
    json: { id: payload[2] },
  })
    .catch(handleError);
}

export function set_balance({ id, amount, created }) {
  return request(`/balance`, {
    method: 'PUT',
    json: { id, amount, created },
  })
    .catch(handleError);
}

export function get_triggers() {
  return request(`/triggers`)
    .catch(handleError);
}

export function get_trigger({ coin_id }) {
  return request(`/trigger/${coin_id}`)
    .catch(handleError);
}

export function set_trigger({ coin_id, floor, ceil, status }) {
  return request(`/trigger/${coin_id}`, {
    method: 'PUT',
    json: { floor, ceil, status },
  })
    .catch(handleError);
}

export function del_trigger({ coin_id }) {
  return request(`/trigger/${coin_id}`, {
    method: 'DELETE',
  })
    .catch(handleError);
}
