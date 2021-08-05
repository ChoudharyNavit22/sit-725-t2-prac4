var express = require("express")
var app = express()
const MongoClient = require('mongodb').MongoClient;
let projectCollection;

// Database Connection

const uri = 'mongodb+srv://sit-725-2021:navc011337@sit-725-2021-week4.ydxie.mongodb.net/sit-725-2021-week4?retryWrites=true&w=majority'
const client = new MongoClient(uri,{ useNewUrlParser: true })

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const createColllection = (collectionName) => {
    client.connect((err,db) => {
        projectCollection = client.db().collection(collectionName);
        if(!err) {
            console.log('MongoDB Connected')
        }
        else {
            console.log("DB Error: ", err);
            process.exit(1);
        }
    })
}

const cardList = [
    {
        title: "Kitten 2",
        image: "images/kitten-2.jpg",
        link: "About Kitten 2",
        description: "Demo desciption about kitten 2"
    },
    {
        title: "Kitten 3",
        image: "images/kitten-3.jpg",
        link: "About Kitten 3",
        description: "Demo desciption about kitten 3"
    }
]

const insertProjects = (project,callback) => {
    projectCollection.insert(project,callback);
}

const getProjects = (callback) => {
    projectCollection.find({}).toArray(callback);
}

app.get('/api/projects',(req,res) => {
    getProjects((err,result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Success", data: result})
        }
    })
    //res.json({statusCode: 200, data: cardList, message:"Success"})
})

app.post('/api/projects',(req,res) => {
    console.log("New Project added", req.body)
    var newProject = req.body;
    //cardList.push(newProject);
    insertProjects(newProject,(err,result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Project Successfully added", data: result})
        }
    })
})

var port = process.env.port || 3000;

app.listen(port,()=>{
    console.log("App listening to: "+port);
    createColllection("projects")
})