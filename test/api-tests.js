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
            return chai.request(app)
                .get('/posts')
                .then(function(res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.forEach(function(posts){
                        posts.should.be.a('object');
                        posts.title.should.be.a('string');
                        posts.content.should.be.a('string');
                        posts.author.should.be.a('string');
                    });
                });
        });
    });

    describe('POST endpoint', function() {
        it ('should create a post and save it to the database', function() {
            const newPost = {
                author: {firstName: 'John', lastName: 'Smith'},
                title: 'test',
                content: 'this is a test'
            };

            return chai.request(app)
                .post('/posts')
                .send(newPost)
                .then(function(res){
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'title', 'content', 'author', 'created');
                    res.body.title.should.equal(newPost.title);
                    res.body.content.should.equal(newPost.content);
                    res.body.author.should.equal(`${newPost.author.firstName} ${newPost.author.lastName}`);
                    res.body.id.should.not.be.null;

                    return BlogPost.findById(res.body.id).exec();
                })
                .then(function(post) {
                    post.title.should.equal(newPost.title);
                    post.content.should.equal(newPost.content);
                    post.author.firstName.should.equal(newPost.author.firstName);
                    post.author.lastName.should.equal(newPost.author.lastName);
                }); 
        });

    });

    describe('PUT endpoint', function() {
        it('should update an existing posts', function() {
            const updatePost = {
                title: 'New title',
                content: 'New content',
                author: {
                    firstName:'New firstName',
                    lastName: 'New lastName'

                }

            };


            return BlogPost
                .findOne()
                .exec()
                .then(function(post){
                    updatePost.id = post.id;

                    return chai.request(app)
                        .put(`/posts/${post.id}`)
                        .send(updatePost)

                })
                .then(function(res){
                    res.should.have.status(201);
                    res.should.be.json;
                    res.should.be.a('object');
                    res.body.title.should.equal(updatePost.title);
                    res.body.content.should.equal(updatePost.content);
                    res.body.author.should.equal(`${updatePost.author.firstName} ${updatePost.author.lastName}`);
                    
                    return BlogPost.findById(res.body.id).exec();

                })
                .then(function(post){
                    post.title.should.equal(updatePost.title);
                    post.content.should.equal(updatePost.content);
                    post.author.firstName.should.equal(updatePost.author.firstName);
                    post.author.lastName.should.equal(updatePost.author.lastName);
                });
        });

    });
});







