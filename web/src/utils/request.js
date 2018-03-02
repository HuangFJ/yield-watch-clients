import fetch from 'dva/fetch';
import { URL } from 'whatwg-url';
import { API_BASE_URL } from '../constants';
import { AppError, Unauthorized, BadRequest, UserNotFound } from './error';

async function parseJSON(response) {
  return response.json();
}

async function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  let error;
  if (response.status === 400) {
    const data = await response.json();
    if (
      data.err === 9
      || data.err === 10
      || data.err === 11
    ) {
      error = new Unauthorized(data.msg);
    } else if (data.err === 12) {
      error = new UserNotFound(data.msg);
    } else {
      error = new BadRequest(data.msg);
    }
  }

  if (!error) {
    error = new AppError(`${response.status} ${response.statusText}`);
    error.response = response;
  }

  throw error;
}

export default function request(url, options = {}) {
  const accessToken = window.localStorage.getItem('access_token') || null;
  const urlObj = new URL(API_BASE_URL ? API_BASE_URL + url : url);
  accessToken && urlObj.searchParams.set('access_token', accessToken);

  const { json, headers = {}, ...opts } = options;
  if (json) {
    opts['body'] = JSON.stringify(json);
    headers['Content-Type'] = 'application/json';
  }
  return fetch(urlObj.toString(), { ...opts, headers })
    .then(checkStatus)
    .then(parseJSON);
}
