var mongoose = require('mongoose');
//模式编写
var MovieSchema = new mongoose.Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    flash:String,
    summary:String,
    poster:String,
    year:Number,
    meta:{
        createAt: {
            type:Date,
            default: Date.now()
        },
        updateAt: {
            type:Date,
            default: Date.now()
        }
    }
});

//每次存储数据之前都会调用此方法
MovieSchema.pre('save',function(next) {
    if(this.isNew){
        this.meta.creatAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now();
    }
    next();
});

MovieSchema.statics = {
    fetch:function (cb) {//取出目前数据库中所有数据
        return this
            .find({})
            .sort('meta.update')
            .exec(cb)
    },
    findById:function (id, cb) {//根据id查询单条数据
        return this
            .findOne({_id: id})
            .sort('meta.update')
    }
}

module.exports = MovieSchema;