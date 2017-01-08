const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const fs = require('fs');

//Load seed-data.json
const data = JSON.parse(fs.readFileSync('seed-data.json'));

const should = chai.should();

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const TEST_DATABASE_URL = 'mongodb://localhost/blog-app-tests';

chai.use(chaiHttp);
// Seed data using JSON file
function seedBlogPosts() {

    var seedData = data

        return BlogPost.insertMany(seedData);
}

function deleteDatabase() {
    console.log('Deleting database');
    return mongoose.connection.dropDatabase();
}

//Start of tests
//
//
//
//
describe('Blog Posts API resource', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedBlogPosts();    
    });

    afterEach(function() {
        return deleteDatabase();
    });

    after(function() {
        return closeServer();
    });

    describe('GET endpoint', function() {
        it ('should return all posts', function() {

            let res;
            return chai.request(app)
                .get('/posts')
                .then(function(_res) {
                    res = _res;
                    res.should.have.status(200);
                    res.body.should.have.length.of.at.least(1);
                    //needs to be res.body.should.have.length.of(BlogPost.count());
                    res.body.should.have.length.of(11);
                });
        });

        it('should return the right fields', function(){
            let resPosts;
            return chai.request(app)
                .get('/posts')
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.posts.should.be.a('array');

                })  
            
            
        });
    });

    //    describe('POST /posts, to create a post inside the database', function() {

    //    });
});







