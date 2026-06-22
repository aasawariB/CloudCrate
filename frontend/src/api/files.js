import API from './axios'

export const uploadFile  = (formData) => API.post('/files/upload', formData)
export const getMyFiles  = ()         => API.get('/files/my-files')
export const deleteFile  = (id)       => API.delete(`/files/${id}`)