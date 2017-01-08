const chai = require('chai');
const chai-http = require('chai-http');
const mongoose = require('mongoose');


const should = chai.should();

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const TEST_DATABASE_URL = 'mongodb://localhost/blog-app-tests';

chai.use(chai-http);




