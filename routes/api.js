
const { Issue } = require('../mongoose.js');

module.exports = function(app) {

  app.route('/api/issues/:project')

    .get(function(req, res) {
      let project = req.params.project;
      let query = req.query;

      Issue
        .find({ project: project, ...query })
        .then(issues => res.json(issues))
        .catch(error => console.error(error));
    })

    .post(async function(req, res) {
      let project = req.params.project;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let assigned_to = req.body.assigned_to;
      let status_text = req.body.status_text;

      let issue = new Issue({
        project,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open: true,
        created_on: new Date(),
        updated_on: new Date(),
      });

      try {
        const savedIssue = await issue.save();
        res.json(savedIssue);
      } catch (error) {
        console.error(error);
        res.json({ error: 'required field(s) missing' });
      }
    })

    .put(function(req, res) {
      let project = req.params.project;
      let id = req.body._id;
      if (!id) return res.json({ error: 'missing _id' });

      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.body;

      const updateFields = {};
      if (issue_title) updateFields.issue_title = issue_title;
      if (issue_text) updateFields.issue_text = issue_text;
      if (created_by) updateFields.created_by = created_by;
      if (assigned_to) updateFields.assigned_to = assigned_to;
      if (status_text) updateFields.status_text = status_text;
      if (typeof open === 'boolean') updateFields.open = open;
      updateFields.updated_on = new Date();

      if (Object.keys(updateFields).length === 1)
        return res.json({
          error: 'no update field(s) sent',
          _id: id
        });

      Issue.findByIdAndUpdate(id, updateFields, { new: true })
        .then(updatedIssue => {
          if (!updatedIssue) {
            return res.json({
              error: 'could not update',
              _id: id
            });
          }

          res.json({
            result: 'successfully updated',
            _id: updatedIssue._id
          });
        })
        .catch(error => {
          console.log(error);
          res.json({
            error: 'could not update',
            _id: id
          });
        });
    })

    .delete(function(req, res) {
      let project = req.params.project;
      let id = req.body._id;
      if (!id) return res.json({ error: 'missing _id' });

      Issue
        .deleteOne({ _id: id })
        .then(result => {
          if (result.deletedCount === 0)
            return res.json({
              error: 'could not delete',
              _id: id
            });

          res.json({
            result: 'successfully deleted',
            _id: id
          });
        })
        .catch(error => {
          console.error(error)
          res.json({
            error: 'could not delete',
            _id: id
          });
        });
    });

};
