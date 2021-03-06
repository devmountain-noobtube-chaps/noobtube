module.exports = {
    addComment: (req, res) => {
        const {video_id, user_id, comment} = req.body,
              db = req.app.get('db');

        db.comment.add_comment({video_id, user_id, comment}).then(() => {
            res.sendStatus(200);
        }).catch(err => console.log(err));
    },
    editComment: (req, res) => {
        const commentId = +req.params.id,
              {comment} = req.body,
              db = req.app.get('db');


        db.comment.edit_comment({commentId, comment}).then(() => {
            res.sendStatus(200);
        }).catch(err => console.log(err));
    },
    deleteComment: (req, res) => {
        const commentId = +req.params.id,
              db = req.app.get('db');

        db.comment.delete_comment([commentId]).then(() => {
            res.sendStatus(200);
        }).catch(err => console.log(err));
    },
    getComments: (req, res) => {
        const videoId = +req.params.id,
              db = req.app.get('db');
        console.log(videoId)
        db.comment
                .get_comments(videoId)
                  .then((response) => res.status(200).send(response))
                  .catch((err) => res.status(500).send(err));
    }
}
