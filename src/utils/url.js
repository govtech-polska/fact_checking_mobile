import Route from 'route-parser';

export const resolveUrl = (path, params, query) => {
  const route = new Route(path);
  const url = route.reverse(params);
  return `${url}`;
};