const  express = require('express')
const mongoose = require('mongoose')
const cities = require('./cities')
const{places,descriptors}= require('./seedHelper')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
const db =  mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
})
const sample = array => array[Math.floor(Math.random()* array.length)];
const seedDB = async()=>{
    await Campground.deleteMany({});
    // const c = new Campground({title:'purple field'});
    // await c.save();
    for (let i=0;i<400;i++){
        const random1000 = Math.floor(Math.random()*1000);
        // const price = Math.floor(Math.random*20)+10
        const camp = new Campground({
            author: '6306a4df523fbd5aee2a1f10',
            title: `${sample(descriptors)} ${sample(places)}`,
            location:`${cities[random1000].city} ${cities[random1000].state}`,
            
            description:' Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem quibusdam enim commodi nobis placeat nam ea? Aliquid voluptatibus laudantium praesentium, ducimus sit placeat cumque rem tempora deserunt assumenda enim voluptate!',
            price: 20,
            geometry: 
            { "type" : "Point", 
            "coordinates" :[ cities[random1000].longitude,
                            cities[random1000].latitude

                            ]},
            images:[

                {
                    url: 'https://res.cloudinary.com/dbvbf467x/image/upload/v1661464493/YelpCamp/fimhubbn9itcsplprafq.jpg',
                    filename: 'YelpCamp/fimhubbn9itcsplprafq',
                    
                  },
                  {
                    url: 'https://res.cloudinary.com/dbvbf467x/image/upload/v1661464492/YelpCamp/aj3tnvxca6j5hbtsyo4i.jpg',
                    filename: 'YelpCamp/aj3tnvxca6j5hbtsyo4i',
                    
                  },
                  {
                    url: 'https://res.cloudinary.com/dbvbf467x/image/upload/v1661464492/YelpCamp/zofg8et0zetezczopr2d.jpg',
                    filename: 'YelpCamp/zofg8et0zetezczopr2d',
                   
                  }
            ],
            

        })
        await camp.save();
    }
    
}
seedDB().then(()=>{
mongoose.connection.close();
});