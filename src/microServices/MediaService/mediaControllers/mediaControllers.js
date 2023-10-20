/* This will be where you put your controller for media
You will probably want to organize these based on what the method is doing (POST, PUT, DELETE, GET)*/
module.exports= {
    getShowById: async (req, res) => {
        const showId= req.params.id;
        const data= await ''//make API call(s)
        data ? res.send(data) : res.sendStatus(404);
    }
}