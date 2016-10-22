$((function (undefined) {
    
    let tb = $('tbody');
    let img = $('#img');
    let history = $('#history');

    this.kill = token => {
        $.get(`/kill/${token}`)
            .then(json => console.log(json))
            .catch(err => console.log(err));
    };

    this.create= token => {
        $.get('/new')
            .then(json => console.log(json))
            .catch(err => console.log(err));
    };

    this.killall = token => {
        $.get('/killall')
            .then(json => console.log(json))
            .catch(err => console.log(err));
    };

    this.clean = token => {
        $.get('/clean')
            .then(json => console.log(json))
            .catch(err => console.log(err));
    };

    let timer = () => {

        $.get('/qrcode')
            .then(json => {
                json = JSON.parse(json);
                let dom = json.map(item => `<img src='/tokens/${item}' />`);
                img.html(dom);
            })
            .catch(err => console.log(err));

        $.get('/history')
            .then(json => {
                json = JSON.parse(json);
                let dom = json.map(item => `<a href='#'>${item}</a>`);
                history.html(dom);
            })
            .catch(err => console.log(err));

        $.get('/list')
            .then(json => {
                json = JSON.parse(json);
                let dom = json.map(item => `<tr><td>${(new Date(item.time)).toString()}</td><td><a href='#' onclick='kill("${item.token}")'>Kill</a></td></tr>`);
                tb.html(dom);
            })
            .catch(err => console.log(err));

    }

    timer();

    setInterval(timer, 1000);

}).bind(window));;
