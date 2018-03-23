var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');//extend方法替换老数据
var Movie = require('./models/movie');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/imooc');

app.set('views', './views/pages');
app.set('view engine', 'jade');
// app.use(express.bodyParser());//将表单数据格式化
// app.use(bodyParser);
//表单数据解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('imooc start on port ' + port);

//index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'imooc 首页',
            movies: movies
        })
    });
    // res.render('index', {
    //     title: 'imooc 首页',
    //     movies:[{  //模拟数据
    //         title:"唐人街探案",
    //         _id:1,
    //         poster:"http://pic1.qiyipic.com/image/20180217/c2/87/v_110036966_m_601_m6_180_236.jpg"
    //     },{
    //         title:"唐人街探案",
    //         _id:2,
    //         poster:"http://pic1.qiyipic.com/image/20180217/c2/87/v_110036966_m_601_m6_180_236.jpg"
    //     },{
    //         title:"唐人街探案",
    //         _id:3,
    //         poster:"http://pic1.qiyipic.com/image/20180217/c2/87/v_110036966_m_601_m6_180_236.jpg"
    //     },{
    //         title:"唐人街探案",
    //         _id:4,
    //         poster:"http://pic1.qiyipic.com/image/20180217/c2/87/v_110036966_m_601_m6_180_236.jpg"
    //     }]
    // })
});

//detail page
app.get('/movie/:id', function (req, res) {
    var id = req.params.id;
    console.log('new movie id',id);
    Movie.findOne({'_id':id}, function (err, movie) {
        if (err) {
            console.log(err);
        }
        console.log(movie);
        res.render('detail', {
            title: 'imooc' + movie.title,
            movie: movie
        })
    });
    // res.render('detail', {
    //     title: 'imooc 详情页',
    //     movie:{
    //         title:'唐人街探案',
    //         doctor:'王宝强',
    //         country:'中国',
    //         year:'2016',
    //         language:'中文',
    //         poster:"http://pic1.qiyipic.com/image/20180217/c2/87/v_110036966_m_601_m6_180_236.jpg",
    //         flash:'http://player.youku.com/player.php/sid/XNjAINjcoNTuy/v.swf',
    //         summary:'天赋异禀的结巴少年秦风警校落榜，被姥姥遣送泰国找远房表舅'
    //     }
    // })
});

//admin page
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            language: '',
            poster: '',
            flash: '',
            summary: ''
        }
    })
});

//admin update movie
app.get('/admin/update/movie/:id', function (req, res) {
    var id = req.params.id;
    // console.log('update:',id,Movie);
    if (id) {
        Movie.findOne({'_id':id}, function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        })
    }
})

//admin post movie
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    //打印表单数据
    // console.log(movieObj);
    if (id !== 'undefined') {
        Movie.findOne({'_id':id}, function (err, movie) {
            if (err) {
                console.log(err);
            }

            _movie = _.extend(movie, movieObj)
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }

                res.redirect('/movie/' + movie._id)
            })
        })
    }
    else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }

            res.redirect('/movie/' + movie._id)
        })
    }
});

//list page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    });
});

//list delete movie
app.delete('/admin/list', function (req, res) {
    var id = req.query.id;
    console.log('delete:',id);
    if (id) {
        Movie.remove({'_id': id}, function (err, movie) {
            if (err) {
                console.log(err)
            }
            else{
                res.json({success:1})
            }
        })
    }
})