import express from 'express';
import bodyParser from 'body-parser';


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static('public'));
app.use(express.json());

let todoList = [
    {
        id: 1,
        content: "Chase flogging pressgang aye overhaul dead men tell no tales mutiny lee Pieces of Eight draught.",    
    },
    {
        id: 2,
        content: "Barque trysail gunwalls yo-ho-ho scurvy gangway Blimey Davy Jones' Locker bounty weigh anchor.",
    },
];
let doneList = [];
var id = 2;
var data = {
    todo: todoList,
    done: doneList,
};




app.get('/', (req, res) => {
    //console.log('GET');
    res.render('index.ejs', data);
});
//GET a specific post by id
app.get('/posts/:id', (req, res) => {
    if(todoList.length>0){
        let pId = parseInt(req.params.id);
        const post = todoList.find(i => i.id === pId);
        if(post){
            res.render('post.ejs', { post: post});
        }else {
            res.send('<h2>Post not found: <a href="/">Torna a Home Page</a></h2>');
        }
    } else {
        res.send('<h2>Array vuoto: <a href="/">Torna a Home Page</a><h2>');
    }
});

app.get('/edit/:id', (req, res) => {
    try {
        let pId = parseInt(req.params.id);
        const post = todoList.find(i => i.id === pId);
        //console.log(`id: ${post.id}, post: ${post.content}`);
        if(!post) res.status(404).json({ message: "Error fetching post." });
        res.render("edit.ejs", {todo: post});
    } catch (error) {
        res.status(500).json({ message: "Error fetching post." });
    }
});
//POST a new post
app.post('/posts', (req, res) => {
    if(req.body.post ){
        const newId = id += 1;
        const newTodo = {
            id: newId,
            content: req.body.post
        };
    //console.log(newTodo)    
    todoList.push(newTodo);
    }
   //res.render('index.ejs', data);
   res.redirect("/");
});

//PATCH a post when you just want to update one parameter
app.post('/posts/:id', (req, res) => {
    console.log("PATCH");
    const pId = parseInt(req.params.id);
    const post = todoList.find((todo) => todo.id === pId);
    if(!post) res.status(404).json({message: 'Item not found'});

    const replacementPost = {
        id: pId,
        content: req.body.content || post.content,
    };    
    const postIndex = todoList.findIndex((todo) => todo.id === pId);
    if (postIndex > -1){
        todoList[postIndex] = replacementPost;
        console.log("Updated: [" + todoList[postIndex].id + "] " + (todoList[postIndex].content).slice(0, 15) + "...");
        res.redirect("/");
    } else {
        res.send("No post content found");
    }
});

app.get ('/move/:id', (req, res) => {
    const pId = parseInt(req.params.id);
    const searchIndex = todoList.findIndex((el) => el.id === pId);
    if (searchIndex > -1) {
        console.log(`Post [${pId}] found! It'll be removed`);
        let moved = (todoList.splice ( searchIndex, 1 ));
        doneList.push(moved[0]);
        console.log(doneList);
        res.redirect("/");
        //res.sendStatus(200);
    } else {
        console.log("ERROR");
        res
            .status(404)
            .json ({ error: `Post with ${id} not found.
            No posts were deleted.`});
    }

});

app.get ('/undo/:id', (req, res) => {
    const pId = parseInt(req.params.id);
    const searchIndex = doneList.findIndex((el) => el.id === pId);
    if (searchIndex > -1) {
        console.log(`Post [${pId}] found! It'll be revert`);
        let moved = (doneList.splice ( searchIndex, 1 ));
        todoList.push(moved[0]);
        console.log(todoList);
        res.redirect("/");
    } else {
        console.log("ERROR");
        res
            .status(404)
            .json ({ error: `Post with ${id} not found.
            No posts were deleted.`});
    }

});

app.get ('/delete/:id', (req, res) => {
    const pId = parseInt(req.params.id);
    const searchIndex = doneList.findIndex((el) => el.id === pId);
    if (searchIndex > -1) {
        console.log(`Post [${pId}] found! It'll be removed`);
        doneList.splice ( searchIndex, 1 );
        res.redirect("/");
        //res.sendStatus(200);
    } else {
        console.log("ERROR");
        res
            .status(404)
            .json ({ error: `Post with ${id} not found.
            No posts were deleted.`});
    }

});

// app.all('*', (req, res) => {
//     res.send("Page not found: <a href='/'>Go to Home Page </a>");
// });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
