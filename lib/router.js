function route(routeMap, path, httpMethod) {
  let pathArray;
  if (typeof path === 'string') {
    pathArray = path.split('/').filter(pathPart => pathPart.length > 0);
  } else {
    pathArray = path;
  }

  if (pathArray.length === 0 && typeof routeMap[httpMethod] === 'function') {
    return routeMap[httpMethod];
  } else if (pathArray.length === 0 || !routeMap[`/${pathArray[0]}`]) {
    throw Error('NotFound');
  }

  return route(routeMap[`/${pathArray[0]}`], pathArray.slice(1), httpMethod);
}

module.exports = {};
module.exports.route = route;
