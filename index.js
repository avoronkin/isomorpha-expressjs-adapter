var _ = require('lodash');

module.exports = function (routeTable, routeManager) {
    if (!routeTable) {
        throw new Error('express-shared-routes adapter: routeTable required!');
    }
    if (!routeManager) {
        throw new Error('express-shared-routes adapter: routeManager instance required!');
    }
    if (!_.isArray(routeTable)) {
        throw new Error('express-shared-routes adapter: routeTable must be array!');
    }
    _.each(routeTable, function (route) {
        addRoute(route, routeManager);
    });
};

function addRoute(route, routeManager, parentName) {
    if (_.isUndefined(route.method)) route.method = 'get';

    if (!route.pattern) {
        throw new Error('express-shared-routes adapter addRoute(): route.pattern required!', route);
    }
    if (!route.handlers) {
        throw new Error('express-shared-routes adapter addRoute(): route.handler required!', route);
    }

    if (_.isFunction(route.handlers)) {
        route.handlers = [route.handlers];
    }

    var routeArguments = [{
            name: route.name,
            re: route.pattern,
            parent: parentName ? routeManager.getRoute(parentName) : null
        },
        route.handlers
    ];

    routeManager[route.method].apply(routeManager, routeArguments);

    if (_.isArray(route.routes)) {
        _.each(route.routes, function (r) {
            addRoute(r, routeManager, route.name);
        });
    }
}

