const util = require('util');
const fs = require('fs');
const readdir = util.promisify(fs.readdir);
const multer = require('multer')
const http = require('http')
const html=require("html")
const path = require('path')

const express = require('express')
const { dirname } = require('path')

const app = express()
const httpServer = http.createServer(app)


const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

const handleError = (err, res) => {
    res
        .status(500)
        .contentType('text/plain')
        .end('Oops! Something went wrong!');
}

const upload = multer({
    dest: './uploads'
})

app.post("/",async (req,res)=>{
    const folder = "./uploads/"
    var li ="";
    let files = await readdir(folder);
    files.forEach(file => {
        li = li+`<li><a href="../uploads/${file}">${file}</a></li>`
    });
    res.send({success: true, message:li});
});

app.post(
    '/uploads',
    upload.single('file'),
    (req, res) => {
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, './uploads/' + req.file.originalname);
      
        const ext = path.extname(req.file.originalname).toLowerCase()
        if(ext === ".gif" || ext === ".jpg"){
            fs.rename(tempPath, targetPath, err => {
                if(err) return handleError(err, res);
                res
                    .status(200)
                    .contentType('text/plain')
                    .end('Dosyalar yüklendi!');
            });
        }
    }
)

app.get("/uploads/:image", (req, res) => {
    res.sendFile(path.join(__dirname, `./uploads/${req.params.image}`))
});

app.get("/", (req,res)=>{
    res.sendFile('anasayfa.html', { root: './public' });
});