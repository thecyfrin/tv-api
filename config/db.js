const mongoose = require('mongoose');
const url = "mongodb+srv://viewzytech:Seu3NV8tRDEjZ4CX@tvcluster.klxwl.mongodb.net/viewzytv?retryWrites=true&w=majority&appName=TvCluster";

mongoose.connect(url)
.then(() => {
    console.log("Mongo DB connected");
}) .catch((err) => {
    console.log("Error in mongo: ", err);
})  