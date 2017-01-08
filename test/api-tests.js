const chai = require('chai');
const chai-http = require('chai-http');
const mongoose = require('mongoose');


const should = chai.should();

const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('../server');
const TEST_DATABASE_URL = 'mongodb://localhost/blog-app-tests';

chai.use(chai-http);

function generateBlogPosts {
    return [
		{
		    author: {firstName: 'John', lastName: 'Smith'},

		    title: 'Hello World!',
		    content: 'This is my first post',
		    created: Date.now
		},
		
		{
		    author: {firstName: 'Smith', lastName: 'John'},

		    title: 'Goodbye World!',
		    content: 'This is my second post',
		    created: Date.now
		},
		
		{
		    author: {firstName: 'Fizz', lastName: 'Buzz'},

		    title: 'Bizz Bang!!',
		    content: 'Did you expect this?',
		    created: Date.now
		},

		{
		    author: {firstName: 'Scooby', lastName: 'Doo'},

		    title: 'Woof!',
		    content: 'Wooof woof woof woof!',
		    created: Date.now
		},

    ]	    
}

function seedBlogPosts() {

    var seedData = generateBlogPosts();

    return BlogPost.insertMany(seedData);
}

function deleteDatabase() {
    console.log('Deleting database');
    return mongoose.connection.dropDatabase();
}

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

    describe('GET /posts, to return all posts', function() {
	let res;
	return chai.request(app)
	    .get('/posts')
	    .then(function(_res) {
		res = _res;
		res.should.have.status(200);
		res.body.should.have.length.of.at.least(1);

		return BlogPosts.count();
	    })
	    .then(function(count){
		res.body.BlogPosts.should.have.length(count);
		    
	    });
    });

    describe('POST /posts, to create a post inside the database', function() {



    });
});












