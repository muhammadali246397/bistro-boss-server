const express = require('express')
const app = express();
const port = process.env.PORT || 4000


app.get('/',(req,res) => {
    res.send('this server is runing')
})

app.listen(port, () => {
    console.log(`server running port on ${port}`)
})