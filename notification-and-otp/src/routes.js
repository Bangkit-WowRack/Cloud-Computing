import { getAllBooksHandler } from "./handler.js";

export const routes = [
    {
      method: 'GET',
      path: '/books',
      handler: getAllBooksHandler
    },
]