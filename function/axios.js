const axios = require('axios');

exports.post = async (url, body) => {
  try {
    const res = await axios.post(url, body);
    return res.data;
  } catch (error) {
    console.error(error?.response?.status || error.message);
    return error?.response?.status || 'err';
  }
};

exports.get = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error(error?.response?.status || error.message);
    return error?.response?.status || 'err';
  }
};
