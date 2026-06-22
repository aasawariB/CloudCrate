import API from './axios'

export const getBillingSummary = () => API.get('/billing/summary')