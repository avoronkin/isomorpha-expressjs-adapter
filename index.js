var _ = require('lodash');

module.exports = function (routeTable, app) {
    if (!routeTable) {
        throw new Error('express adapter: routeTable required!');
    }
    if (!app) {
        throw new Error('express adapter: express.js instance required!');
    }
    if (!_.isArray(routeTable)) {
        throw new Error('express adapter: routeTable must be array!');
    }
    _.each(routeTable, function(route){
        addRoute(route, app);
    });
};

function addRoute(route, app, parentPattern) {
    if (_.isUndefined(route.method)) route.method = 'get';
    parentPattern = parentPattern || '';

    if (!route.pattern) {
        throw new Error('express adapter addRoute(): route.pattern required!', route);
    }
    if (!route.handlers) {
        throw new Error('express adapter addRoute(): route.handler required!', route);
    }

    if (_.isFunction(route.handlers)) {
        route.handlers = [route.handlers];
    }

    route.pattern = parentPattern + route.pattern;
    app[route.method].apply(app,[route.pattern].concat(route.handlers));
    parentPattern = route.pattern;

    if (_.isArray(route.routes)) {
        _.each(route.routes, function (route) {
            addRoute(route, app, parentPattern);
        });
    }
}


