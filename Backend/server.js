const app = require("./app");
const env = require("dotenv")
const mongoose= require("mongoose");
env.config();
mongoose.connect(process.env.MONGO_URL).then(()=>{ console.log("Connect Mongo")}).catch(err=> console.log(err))
app.listen(process.env.PORT,()=>{
    console.log(`Server Run at port ${process.env.PORT}`);
})