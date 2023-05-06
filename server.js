console.log('May Node be with you')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://workwithraymond01:5UiC9y0ZfqaAlnJT@cluster1.rretfrg.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
.then(client => {
      console.log('Connected to Database')
      const db = client.db('star-wars-quotes')
      const quotesCollection = db.collection('quotes')
      app.set('view engine', 'ejs')
      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(express.static('public'))
      app.use(bodyParser.json())  

      
      app.get('/', (req, res) => {
        quotesCollection.find().toArray()
        .then(results => {
            //console.log(results)
            res.render('index.ejs', {quotes: results})
        })
        .catch(error => console.log.error(error))
            
    })
    
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)
            .then(result => {
               // console.log(result)
                res.redirect('/')
            })
            .catch(error => console.error(error))
    })

    app.put('/quotes', (req,res) => {
        quotesCollection.findOneAndUpdate(
            { name: 'Yoda' },
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert: true
            }
        )
        .then(result => {
            console.log(result)
            res.json('Success')
        })
        .catch(error => console.log.error(error))
    })

    app.delete('/quotes', (req, res) => {
        quotesCollection.deleteOne (
        { name: 'Darth Vader' }
        )
        .then(result => {
            if(result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            res.json("Deleted Darth Vader quotes")
        })
        .catch(error => console.error(error))
    })


    app.listen(3000, function() {
        console.log('listen on 3000')
    })

    })

    .catch(error => console.error(error))





