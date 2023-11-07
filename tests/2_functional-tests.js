const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let id;
  
  suite('Create', function() {
    test('all fields', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/test')
        .send({
          "issue_title": "Test",
          "issue_text": "Functional Test - Every field filled in",
          "created_by": "fCC",
          "assigned_to": "Chai and Mocha",
          "status_text": "test",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.project, "test");
          assert.strictEqual(res.body.issue_title, "Test");
          assert.strictEqual(res.body.issue_text, "Functional Test - Every field filled in");
          assert.strictEqual(res.body.created_by, "fCC");
          assert.strictEqual(res.body.assigned_to, "Chai and Mocha");
          assert.strictEqual(res.body.status_text, "test");
          assert.strictEqual(res.body.open, true);
          assert.strictEqual(res.body.created_on, res.body.updated_on);

          done();
        });
    });

    test('required fields', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/test')
        .send({
          "issue_title": "Test",
          "issue_text": "Functional Test - Required Fields Only",
          "created_by": "fCC",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.project, "test");
          assert.strictEqual(res.body.issue_title, "Test");
          assert.strictEqual(res.body.issue_text, "Functional Test - Required Fields Only");
          assert.strictEqual(res.body.created_by, "fCC");
          assert.strictEqual(res.body.assigned_to, "");
          assert.strictEqual(res.body.status_text, "");
          assert.strictEqual(res.body.open, true);
          assert.strictEqual(res.body.created_on, res.body.updated_on);

          done();
        });
    });

    test('missing required fields', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/test')
        .send({
          "issue_title": "Test",
          "created_by": "fCC",
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, "required field(s) missing");

          done();
        });
    });
  });

  suite('Read', function() {
    test('all issues', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/test')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);

          const firstIssue = res.body[0];
          id = firstIssue._id;

          assert.containsAllKeys(firstIssue, [
            '_id', 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open', 'project', 'created_on', 'updated_on'
          ]);
          assert.isString(firstIssue._id);
          assert.isString(firstIssue.issue_title);
          assert.isString(firstIssue.issue_text);
          assert.isString(firstIssue.created_by);
          assert.isString(firstIssue.assigned_to);
          assert.isString(firstIssue.status_text);
          assert.isBoolean(firstIssue.open);
          assert.isString(firstIssue.project);
          assert.isString(firstIssue.created_on);
          assert.isString(firstIssue.updated_on);
          done();
        });
    });

    test('all issues, 1 filter', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/test?assigned_to=Chai and Mocha')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);

          const firstIssue = res.body[0];

          assert.containsAllKeys(firstIssue, [
            '_id', 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open', 'project', 'created_on', 'updated_on'
          ]);
          assert.isString(firstIssue._id);
          assert.isString(firstIssue.issue_title);
          assert.isString(firstIssue.issue_text);
          assert.isString(firstIssue.created_by);
          assert.isString(firstIssue.assigned_to);
          assert.isString(firstIssue.status_text);
          assert.isBoolean(firstIssue.open);
          assert.isString(firstIssue.project);
          assert.isString(firstIssue.created_on);
          assert.isString(firstIssue.updated_on);
          done();
        });
    });

    test('all issues, multiple filters', function(done) {
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/test?issue_title=Test&status_text=test')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);

          const firstIssue = res.body[0];

          assert.containsAllKeys(firstIssue, [
            '_id', 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open', 'project', 'created_on', 'updated_on'
          ]);
          assert.isString(firstIssue._id);
          assert.isString(firstIssue.issue_title);
          assert.isString(firstIssue.issue_text);
          assert.isString(firstIssue.created_by);
          assert.isString(firstIssue.assigned_to);
          assert.isString(firstIssue.status_text);
          assert.isBoolean(firstIssue.open);
          assert.isString(firstIssue.project);
          assert.isString(firstIssue.created_on);
          assert.isString(firstIssue.updated_on);
          done();
        });
    });
  });

  suite('Update', function() {
    test('1 field', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/test')
        .send({
          _id: id,
          issue_title: 'Updated title'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.result, "successfully updated");
          assert.strictEqual(res.body._id, id);

          done();
        });
    });

    test('multiple fields', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/test')
        .send({
          _id: id,
          issue_title: 'Updated title 2',
          issue_text: 'Updated text',
          created_by: 'Updated user',
          assigned_to: 'Updated assigned_to',
          status_text: 'Updated status_text',
          open: false
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.result, "successfully updated");
          assert.strictEqual(res.body._id, id);

          done();
        });
    });

    test('missing id', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/test')
        .send({
          issue_title: 'Updated title 3',
          open: false
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, "missing _id");
  
          done();
        });
    });

    test('no fields to update', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/test')
        .send({
          _id: id
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, "no update field(s) sent");
          assert.strictEqual(res.body._id, id);
  
          done();
        });
    });

    test('invalid id', function(done) {
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/test')
        .send({
          _id: '111111111111111',
          issue_title: 'Test title X',
          open: false
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, "could not update");
          assert.strictEqual(res.body._id, '111111111111111');

          done();
        });
    });
  });

  suite('Delete', function() {
    test('valid', function(done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/test')
        .send({ _id: id })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.result, "successfully deleted");
          assert.strictEqual(res.body._id, id);

          done();
        });
    });

    test('invalid id', function(done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/test')
        .send({ _id: '222222222222' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, "could not delete");
          assert.strictEqual(res.body._id, '222222222222');

          done();
        });
    });
    
    test('missing id', function(done) {
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/test')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.strictEqual(res.body.error, "missing _id");

          done();
        });
    });
  });
});
