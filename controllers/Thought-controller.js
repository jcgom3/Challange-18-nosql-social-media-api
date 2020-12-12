const { Thought, User } = require('../models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
      Thought.find({})
      //allows to remove __v from visuals
          .select('-__v')
          .sort({ _id: -1 })
          .then(dbThoughtsData => res.json(dbThoughtsData))
          .catch(err => {
              console.log(err);
              res.status(400).json(err);
          });
  },
  // Get thought by id
  getThoughtById({ params }, res) {
      Thought.findOne({ _id: params.thoughtId })
          .then(dbThoughtsData => {
              if(!dbThoughtsData) {
                  res.status(404).json({ message: 'No thought found with id.' });
                  return;
              }
              res.json(dbThoughtsData)
          })
          .catch(err => {
              console.log(err);
              res.status(400).json(err);
          });
  },
  // Create a thought
  createThought({ body }, res) {
      Thought.create(body)
          .then(({ _id }) => {
              return User.findOneAndUpdate(
                //create a thought using current user
                  { _id: body.userId },
                  { $push: {thoughts: _id }},
                  { new: true }
              );
          })
          .then(dbUsersData => {
              if(!dbUsersData) {
                  res.status(404).json({ message: 'No user found id.' });
                  return;
              }
              res.json(dbUsersData)
          })
          .catch(err => {
              console.log(err);
              res.status(400).json(err);
          });
  },
  // Update  thought
  updateThought({ params, body }, res) {
      Thought.findOneAndUpdate(
          { _id: params.thoughtId}, body, { new: true, runValidators: true })
          .then(dbThoughtsData => {
              if(!dbThoughtsData) {
                  res.status(404).json({ message: 'No thought found with id.' });
                  return;
              }
              res.json(dbThoughtsData)
          })
          .catch(err => {
              console.log(err);
              res.status(400).json(err);
          });
  },
  // Delete thought
  deleteThought({ params }, res) {
      Thought.findOneAndDelete({ _id: params.thoughtId })
          .then(dbThoughtsData => {
              if(!dbThoughtsData) {
                  return res.status(404).json({ message: 'No thought found this id.' });                 
              }
              return User.findOneAndUpdate(
                  { username: dbThoughtsData.username },
                  { $pull: { thoughts: params.thoughtId } },
                  { new: true }
              )
          })
          .then(dbUsersData => {
              if(!dbUsersData) {
                  res.status(404).json({ message: 'No user found this id.' });
                  return;
              }
              res.json(dbUsersData);
          })
          .catch(err => {
              console.log(err);
              res.status(400).json(err);
          });
  },
  // Create reaction
  createReaction({ params, body }, res) {
      Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $push: { reactions: body } },
          {new: true, runValidators: true }
      )
      .then(dbUsersData => {
          if(!dbUsersData) {
              res.status(404).json({ message: 'No user found with id.' });
              return;
          }
          res.json(dbUsersData)
      })
      .catch(err => {
          console.log(err);
          res.status(400).json(err);
      });
  },
  // Delete a reaction
  deleteReaction({ params }, res) {
      Thought.findOneAndUpdate(
          { _id: params.thoughtId},
          //allows to remove the reaction by id
          { $pull: { reactions: {reactionId: params.reactionId } } },
          { new: true }
      )
      .then(dbUsersData => res.json(dbUsersData))
      .catch(err => {
          console.log(err);
          res.status(400).json(err);
      });
  }
}

// Export controller
module.exports = thoughtController;


