'use strict';

let express = require('express');
let fs = require('fs');
let spawn = require('child_process').spawn;
let uuid = require('node-uuid');

let app = express();
let arrs = [];

app.use(express.static('public'));

app.get('/list', (req, res) => {
    let n_arr = arrs.map(item => {
        return {
            time : item.time,
            token : item.token
        };
    });
    res.end(JSON.stringify(n_arr));
});

app.get('/qrcode', (req, res) => {
    fs.readdir('./public/tokens', 'utf-8', (err, arr) => {
        if (err)
            res.end('[]');
        arr = arr.filter(item => {return (item.substring(item.length - 7) != '.pickle')});
        res.end(JSON.stringify(arr));
    });
});

app.get('/history', (req, res) => {
    fs.readdir('./public/tokens', 'utf-8', (err, arr) => {
        if (err)
            res.end('[]');
        arr = arr.filter(item => {return (item.substring(item.length - 7) == '.pickle')});
        arr = arr.map(item => {
            return (/QQBot\-v1.5\-(.*).pickle/.exec(item)[1]);
        })
        res.end(JSON.stringify(arr));
    });
});

app.get('/new', (req, res) => {
    try {
        let obj = {
            token : uuid.v1(),
            time : new Date(),
        };
        obj.handler = spawn('python', ['./bot/bot.py']);
        obj.handler.on('exit', code => {
            arrs = arrs.filter(item => item != obj);
        });
        arrs.push(obj);
    } catch (e) {
        console.log(e);
    }
    res.end('[]');
});

app.get('/kill/:token', (req, res) => {
    arrs = arrs.filter(item => {
        if (item.token == req.params.token)
        {
            try {
                item.handler.kill();
            } catch (e) {
                console.log(e);
            }
            return false;
        }
        return true;
    }); 
    res.end('[]');
});

app.get('/killall', (req, res) => {
    arrs = arrs.filter(item => {
        try {
            item.handler.kill();
            return false;
        } catch (e) {
            console.log(e);
            return true;
        }
    }); 
    res.end('[]');
});

app.get('/clean', (req, res) => {
    fs.readdir('./public/tokens', 'utf-8', (err, arr) => {
        arr = arr.filter(item => {return (item.substring(item.length - 7) != '.pickle')});
        if (err)
            res.end('[]');
        try {
            arr.filter(item => fs.unlink(`./public/tokens/${item}`));
        } catch (e) {
            console.log(e);
        } finally {
            res.end('[]');
        }
    });
});

app.listen(3000);