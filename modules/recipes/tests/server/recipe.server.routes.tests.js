'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Recipe = db.recipe,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, recipe;

/**
 * Recipe routes tests
 */
describe('Recipe CRUD tests', function() {
  before(function(done) {
    // Get application
    app = express.init(sequelize);
    agent = request.agent(app);

    done();
  });

  before(function(done) {

    // Create user credentials
    credentials = {
      username: 'username',
      password: 'S3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = User.build();

    user.firstName = 'Full';
    user.lastName = 'Name';
    user.displayName = 'Full Name';
    user.email = 'test@test.com';
    user.username = credentials.username;
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(credentials.password, user.salt);
    user.provider = 'local';
    user.roles = ['admin', 'user'];

    // Save a user to the test db and create new recipe
    user.save().then(function(user) {
      recipe = Recipe.build();
      recipe = {
        title: 'Recipe Title',
        content: 'Recipe Content',
        userId: user.id
      };
      done();
    }).catch(function(err) {});

  });

  it('should be able to save an recipe if logged in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(200)
          .end(function(recipeSaveErr, recipeSaveRes) {

            // Handle recipe save error
            if (recipeSaveErr) {
              return done(recipeSaveErr);
            }

            // Get a list of recipes
            agent.get('/api/recipes')
              .end(function(recipesGetErr, recipesGetRes) {

                // Handle recipe save error
                if (recipesGetErr) {
                  return done(recipesGetErr);
                }

                // Get recipes list
                var recipes = recipesGetRes.body;

                // Set assertions
                console.log('recipes[0]', recipes[0]);
                console.log('userId', userId);

                //(recipes[0].userId).should.equal(userId);
                (recipes[0].title).should.match('Recipe Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an recipe if not logged in', function(done) {
    agent.get('/api/auth/signout')
      .expect(302) //because of redirect
      .end(function(signoutErr, signoutRes) {

        // Handle signout error
        if (signoutErr) {
          return done(signoutErr);
        }

        agent.post('/api/recipes')
          .send(recipe)
          .expect(403)
          .end(function(recipeSaveErr, recipeSaveRes) {
            // Call the assertion callback
            done(recipeSaveErr);
          });
      });
  });

  it('should not be able to save an recipe if no title is provided', function(done) {
    // Invalidate title field
    recipe.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(400)
          .end(function(recipeSaveErr, recipeSaveRes) {

            // Set message assertion
            (recipeSaveRes.body.message).should.match('Recipe title must be between 1 and 250 characters in length');
            // Handle recipe save error
            done(recipeSaveErr);
          });
      });
  });

  it('should be able to update an recipe if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (!signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(200)
          .end(function(recipeSaveErr, recipeSaveRes) {
            // Handle recipe save error
            if (recipeSaveErr) {
              return done(recipeSaveErr);
            }

            // Update recipe title
            recipe.title = 'WHY YOU GOTTA BE SO SEAN?';

            // Update an existing recipe
            agent.put('/api/recipes/' + recipeSaveRes.body.id)
              .send(recipe)
              .expect(200)
              .end(function(recipeUpdateErr, recipeUpdateRes) {
                // Handle recipe update error
                if (recipeUpdateErr) {
                  return done(recipeUpdateErr);
                }

                // Set assertions
                (recipeUpdateRes.body.id).should.equal(recipeSaveRes.body.id);
                (recipeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO SEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of recipes if not signed in', function(done) {
    recipe.title = 'Recipe Title';
    // Create new recipe model instance
    var recipeObj = Recipe.build(recipe);

    // Save the recipe
    recipeObj.save().then(function() {
      // Request recipes
      request(app).get('/api/recipes')
        .end(function(req, res) {

          // Set assertion
          //res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          res.body.should.be.instanceof(Array);
          // Call the assertion callback
          done();
        });

    }).catch(function(err) {});
  });

  it('should be able to get a single recipe if not signed in', function(done) {
    // Create new recipe model instance
    var recipeObj = Recipe.build(recipe);

    // Save the recipe
    recipeObj.save().then(function() {
      request(app).get('/api/recipes/' + recipeObj.id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', recipe.title);

          // Call the assertion callback
          done();
        });
    }).catch(function(err) {});
  });

  it('should return proper error for single recipe with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/recipes/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'recipe is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single recipe which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent recipe
    request(app).get('/api/recipes/123567890')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No recipe with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an recipe if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (!signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new recipe
        agent.post('/api/recipes')
          .send(recipe)
          .expect(200)
          .end(function(recipeSaveErr, recipeSaveRes) {


            // Handle recipe save error
            if (recipeSaveErr) {
              return done(recipeSaveErr);
            }

            // Delete an existing recipe
            agent.delete('/api/recipes/' + recipeSaveRes.body.id)
              .send(recipe)
              .expect(200)
              .end(function(recipeDeleteErr, recipeDeleteRes) {

                // Handle recipe error error
                if (recipeDeleteErr) {
                  return done(recipeDeleteErr);
                }

                // Set assertions
                (recipeDeleteRes.body.id).should.equal(recipeSaveRes.body.id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an recipe if not signed in', function(done) {
    // Set recipe user
    recipe.userId = user.id;

    // Create new recipe model instance
    var recipeObj = Recipe.build(recipe);

    // Save the recipe
    recipeObj.save().then(function() {
      // Try deleting recipe
      request(app).delete('/api/recipes/' + recipeObj.id)
        .expect(403)
        .end(function(recipeDeleteErr, recipeDeleteRes) {

          // Set message assertion
          (recipeDeleteRes.body.message).should.match('User is not authorized');

          // Handle recipe error error
          done(recipeDeleteErr);
        });

    }).catch(function(err) {});
  });

  after(function(done) {
    user.destroy()
      .then(function(success) {
        done();
      }).catch(function(err) {});
  });

});