const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);



const app = express();

// Create a new item in the museum: takes a title and a path to an image.
var db = firebase.firestore();
var itemsRef = db.collection('items');

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
    try {
        let querySnapshot = await itemsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    } catch (err) {
        res.sendStatus(500);
    }
});

app.delete('/api/items/:id', async (req, res) => {
    try {
        let id = req.params.id
        delete itemsRef.doc(id).delete();

        res.send("delete true")
    } catch (error) {
        res.sendStatus(500);
    }
});

app.put('/api/items/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let nTitle = req.body.title;
        let nDescription = req.body.description;
        console.log(nTitle);
        itemsRef.doc(id).update({title: nTitle, description: nDescription});
        res.send("update true");
    } catch (error) {
        res.sendStatus(500);
    }
})

//app.put
//itemsRef.doc(id).update({title:"new title"})
// title is from req.body

app.post('/api/items', async (req, res) => {
    try {
        let querySnapshot = await itemsRef.get();
        let numRecords = querySnapshot.docs.length;
        let item = {
            id: numRecords + 1,
            description: req.body.description,
            title: req.body.title,
            path: req.body.path
        };
        itemsRef.doc(item.id.toString()).set(item);
        res.send(item);
    } catch (error) {
        res.sendStatus(500);
    }
});
exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
