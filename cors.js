const cors = require('cors');
const { urlWhiteListed } = require('./config/dot-env')

//liste of url accepted on request
const whiteList = [
    urlWhiteListed.public,
    urlWhiteListed.admin
];

//Return true of false according to if the url calling the resources is known
var corsOptionDelegate  = (req, callback) => {
    let corsOptions;

    if(whiteList.indexOf(req.header('Origin')) !== -1){
        corsOptions = { 
            origin: true,
            credentials: true 
        }
    }

    else{
        corsOptions = { origin: false};
    }

    callback(null, corsOptions);
}

exports.whiteList = whiteList;
exports.corsWithOptions = cors(corsOptionDelegate);