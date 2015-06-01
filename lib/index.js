  // PLUGIN: Hapi Auth Cookie

// Cookie authentication provides a simple cookie-based session management.xxx
// https://github.com/hapijs/hapi-auth-cookie
var Chalk = require("chalk");
var HapiAuthCookie = require('hapi-auth-cookie')

var internals = {};

exports.register = function(server, options, next){

        // 12 * 60 * 60 * 1000 = 12 hours
        internals.cache = server.app.cache = server.cache({ segment: 'sessions',  expiresIn: 12 * 60 * 60 * 1000 });

        internals.validateFunc = function (session, callback) {
    debugger;
            internals.cache.get(session.sid, function (err, cached) {
    debugger;
                if (err) {
                    console.log(Chalk.bgRed("    validateFunc @ hapi-auth-cookie: error to get data from catbox"));
                    return callback(err, false);
                }

                if (!cached) {
                    console.log(Chalk.bgRed("    validateFunc @ hapi-auth-cookie: received cookie but it's invalid. Authentication failed."));
                    return callback(null, false);
                }

                console.log(Chalk.bgGreen("    validateFunc @ hapi-auth-cookie: received valid cookie. Authentication succeeded."));
                return callback(null, true, cached.account)
            })
        };


        server.register(
            {
                register: HapiAuthCookie,
                options: {}
            },
            function (err) {

                if (err){ throw err; }

                server.auth.strategy('session', 'cookie', 'try', {
                    password: 'jfuiewbfuiwebw',
                    cookie: 'sid',
    //              redirectTo: '/xyz',  // if authentication fails, redirect; if not set, will simply return a forbidden message
    //                redirectOnTry: false,
                    isSecure: false,
                    clearInvalid: true,  // if the session is expired, will delete the cookie in the browser (but if the cookie has expired, it will remain)
                    validateFunc: internals.validateFunc,
                });


                server.route({
                    method: "GET",
                    path: "/login",
                    handler: function(request, reply) {
                        //console.log(utils.logHandlerInfo(request));
                        debugger;

                        if (request.auth.isAuthenticated) {
                          //  console.log("loginForm handler: valid cookie, will now redirect to /" + request.params.lang + "/dashboard");
                          //  return reply.redirect("/" + request.params.lang + "/dashboard");
                        }

                        var context = {
                            //texts: request.pre.texts,
                            auth: request.auth,

                            urlParam1: "login",
                            lfr: request.query.lfr || "" // login fail reason
                        }

                        return reply({"login": "aaa"});
                        return reply.view('login', {
                            ctx: context
                        });
                    },
                    config: {
                    }
                });


                server.route({
                    method: "POST",
                    path: "/loginAuthenticate",
                    handler: function(request, reply) {
                        return reply({"loginAuthenticate": "aaa"});
                    },
                    config: {
                    }
                });

                server.route({
                    method: "GET",
                    path: "/logout",
                    handler: function(request, reply) {
                        return reply({"logout": "aaa"});
                    },
                    config: {
                    }
                });


                console.log("plugin registered: clima-auth-cookie");





            }
        );


    return next();
};


exports.register.attributes = {
    name: 'clima-auth-cookie'
};

