const mongoose = require('mongoose')

export const connect =  (url)=>{
    return mongoose.connect(url)
};