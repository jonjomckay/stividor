var webpack = require('webpack');

require('dotenv').config();

var REACT_APP = /^REACT_APP_/i;

function getEnvironment() {
    const processEnv = Object.keys(process.env)
        .filter(key => REACT_APP.test(key))
        .reduce((env, key) => {
            env[key] = JSON.stringify(process.env[key]);
            return env;
        }, {
            // Useful for determining whether we’re running in production mode.
            // Most importantly, it switches React into the correct mode.
            'NODE_ENV': JSON.stringify(
                process.env.NODE_ENV || 'development'
            )
        });

    return {'process.env': processEnv};
}

module.exports = {
    type: 'react-app',
    babel: {
        cherryPick: ['semantic-ui-react']
    },
    webpack: {
        uglify: false,
        extra: {
            node: {
                fs: 'empty',
                net: 'empty',
                tls: 'empty'
            },
            plugins: [
                new webpack.IgnorePlugin(/vertx/),
                new webpack.DefinePlugin(getEnvironment()),
            ]
        }
    }
};