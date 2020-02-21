const express = require('express');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const uuid = require('uuid/v4');
const logger = require('../logger');
const bookmarks= require('../store');



bookmarkRouter
  .route('/bookmarks')
  .get(bodyParser, (req, res)=>{
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) =>{
    const { title, url, description, rating } = req.body;
    if(!title){
      logger.error('Title is required');
      return res.status(400).send('Invalid data of title')
    }
        
    if(!url){
      logger.error('url is required');
      return res.status(400).send('Invalid data of url')
    }
    if(!description){
      logger.error('description is required');
      return res.status(400).send('Invalid data of description')
    }
    if(!rating){
      logger.error('rating is required');
      return res.status(400).send('Invalid data of rating')
    }
    
    const id =uuid();
    
    const bookmark ={
      id,
      title,
      url,
      description,
      rating
    };
    
    bookmarks.push(bookmark);
    
    logger.info(`Bookmark with id ${id} created`);
    
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  });

bookmarkRouter
  .route('/bookmarks/:id')
  .get(bodyParser, (req, res)=>{
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id === id);
        
    if(!bookmark){
      logger.error(`Bookmark with id ${id} not found`);
      return res.status(404).send('Bookmark Not Found');
    }
    res.json(bookmark);
  })
  .delete(bodyParser, (req, res) => {
    const {id} = req.params;
    const index = bookmarks.findIndex(u => u.id === id);
      
    if(index === -1){
      logger.error(`Bookmark with id ${id} not found`)
      return res
        .status(404)
        .send('Id not found');
    }
    bookmarks.splice(index, 1);
      
    logger.info(`Bookmark with id ${id} deleted`);
    res.status(204).end();
  });

module.exports=bookmarkRouter;