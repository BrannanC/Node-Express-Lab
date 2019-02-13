const express = require('express');

const posts = require('../data/db');

const router = express.Router();

router.get('/', (req, res) => {
    posts
        .find()
        .then(posts => res.status(200).json({ posts }))
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "The posts information could not be retrieved." })
        })
});

router.get('/:id', (req, res) => {
    const id = req.params.id
    posts
        .findById(id)
        .then(post => {
            post.length > 0 ?
            res.status(200).json({ post })
            : res.status(404).json({ message: "The post with the specified ID does not exist." })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "The posts information could not be retrieved." })
        })
});


router.post('/', (req, res) => {
    const body = req.body;
    if(!body.title || !body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        posts
            .insert(body)
            .then(idObj => {
                posts.findById(idObj.id)
                .then(post => res.status(201).json({ post }))
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    }
});

router.delete('/:id', (req, res) => {
    posts
        .remove(req.params.id)
        .then(isDel => {
            isDel ?
            res.status(204).end()
            : res.status(404).json({ message: "The post with the specified ID does not exist." });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post could not be removed" })
        })
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    if(!changes.title || !changes.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        posts
            .update(req.params.id, changes)
            .then(didUpdate => {
                didUpdate > 0 ?
                posts
                    .findById(req.params.id)
                    .then(post => res.status(200).json({ post }))
                : res.status(404).json({ message: "The post with the specified ID does not exist." })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: "The post information could not be modified." })
            })
    }
});

module.exports = router;