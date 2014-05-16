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

function addRoute(route, app) {
    if (_.isUndefined(route.method)) route.method = 'get';

    if (!route.pattern) {
        throw new Error('express adapter addRoute(): route.pattern required!', route);
    }
    if (!route.handlers) {
        throw new Error('express adapter addRoute(): route.handler required!', route);
    }

    var handlers = [];

    if (_.isArray(route.handlers)) {
        handlers = route.handlers;
    }
    if (_.isFunction(route.handlers)) {
        handlers.push(route.handlers);
    }
    var routeArg = [route.pattern].concat(handlers);

    app[route.method].apply(app, routeArg);
}

