import axios from 'axios'

const axiosLocalInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_BASE_URL
})

export const requestServer = async (method, url, token = null, data = null) => {
  try {
    const res = await axiosLocalInstance({
      method,
      url,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      ...(data && { data })
    });

    return res.data.data;
  } catch (error) {
    console.error('SERVER REQUEST ERROR:', error.code, error.message);
    throw error;
  }
};
