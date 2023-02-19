import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios'
import { version } from '../../package.json'
import { getClient } from '../'

export function request(config: AxiosRequestConfig = {}) {
  const client = getClient()
  const currentZooChain = client.currentChain()
  const headers: AxiosRequestHeaders = {
    'Content-Type': 'application/json',
    'x-rkc-version': version,
  }
  if (currentZooChain?.apiKey) {
    headers['x-api-key'] = currentZooChain.apiKey
  }
  return axios.request({ headers: headers, ...config })
}
