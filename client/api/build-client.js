import axios from 'axios';

export default function build({ req }) {
  if (typeof window === 'undefined') {
    // We are on the server

    return axios.create({
      baseURL: 'http://buyitdowmains.com',
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: '/',
    });
  }
}
