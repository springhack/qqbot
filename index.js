'use strict';

let express = require('express');
let fs = require('fs');
let spawn = require('child_process').spawn;
let uuid = require('node-uuid');

let app = express();
let arrs = [];
let Log = (function () {
    let fd = fs.openSync('./python.log', 'a');
    return (token, info) => {
        try {
            let time = (new Date()).toString();
            fs.writeSync(fd, `[${time}]\n[${token}] => ${info}\n`);
        } catch (e) {
            console.log(e);
        }
    };
})();

Log('SpringHack', 'Initial system done ...');

if (!fs.existsSync('./public/tokens'))
{
    try {
        fs.mkdirSync('./public', 0o777);
    } catch (e) {}
    try {
        fs.mkdirSync('./public/tokens', 0o777);
    } catch (e) {}
}



app.use(express.static('public'));

app.get('/list', (req, res) => {
    let n_arr = arrs.map(item => {
        return {
            time : item.time,
            token : item.token
        };
    });
    n_arr = n_arr.sort((a, b) => b.time - a.time);
    res.end(JSON.stringify(n_arr));
});

app.get('/qrcode', (req, res) => {
    fs.readdir('./public/tokens', 'utf-8', (err, arr) => {
        if (err)
        {
            res.end('[]');
            return;
        }
        arr = arr.filter(item => {return (item.substring(item.length - 7) != '.pickle')});
        res.end(JSON.stringify(arr));
    });
});

app.get('/history', (req, res) => {
    fs.readdir('./public/tokens', 'utf-8', (err, arr) => {
        if (err)
        {
            res.end('[]');
            return;
        }
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
            time : (new Date()).getTime(),
        };
        obj.handler = spawn('python', ['./bot/bot.py']);
        obj.handler.on('exit', code => {
            arrs = arrs.filter(item => item != obj);
        });
        obj.handler.on('close', code => {
            arrs = arrs.filter(item => item != obj);
        });
        obj.handler.stdout.on('data', data => Log(obj.token, data));
        obj.handler.stderr.on('data', data => Log(obj.token, data));
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
        if (err)
        {
            res.end('[]');
            return;
        }
        arr = arr.filter(item => {return (item.substring(item.length - 7) != '.pickle')});
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
