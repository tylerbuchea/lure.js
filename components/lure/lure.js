
/* ------------------------
 *  Lure.js
 *  by tylerbuchea.com
 * ------------------------ */

/* Private Namespace */
function Lure(viewContainer) {

    /* ---------------------------------------------------------------------------
     *  Private API
     * --------------------------------------------------------------------------- */

    /* Globals */    
    var controllers = {}; 
    var routes = {};
    var scope = {};
    var thisRoute;

    /* Init Route */
    var initRoute = function() {

        thisRoute = window.location.hash.split("#")[1];
        var route = routes[thisRoute];

        if(route) {
            scope = {};
            controllers[route.controller](scope);
            updateView(route.templateUrl);
        }

    };   

    /* Run Controllers */
    var runControllers = function() {

        $.each(controllers, function(name, controller) {

            $("[x-"+name+"]").each(function(index, el) {

                var value = $(el).attr("x-"+name);

                controller(scope, el, value, controllers);

            });                

        });

    };

    /* Update View */
    var updateView = function(templateUrl) {

        // Get Template
        $.get(templateUrl, function(html) {

            // Store Model
            var model = scope; 

            // Prepare Template
            var template = Handlebars.compile(html);

            // Create View from Model & Template
            var view = template(model);

            // Update View Container
            $(viewContainer).html(view);

            // Run Controllers
            runControllers();

        });

    };

    /* ---------------------------------------------------------------------------
     *  Public API
     * --------------------------------------------------------------------------- */

    /* Add Controller */
    this.controller = function(name, callback) {    

        controllers[name] = callback;
        return this;

    };

    /* Add Route */
    this.route = function(name, config) {

        routes[name] = config;
        return this;

    };

    /* Http Request */
    this.http = function(config) {   

        config.complete = function() {
            updateView(routes[thisRoute].templateUrl);
        };
        $.ajax(config);

    };

    /* Init */
    this.init = function() {

        if (!window.location.hash)
            window.location.hash = "/";

        window.onpopstate = function (event) {
            initRoute();
        };

    };

}