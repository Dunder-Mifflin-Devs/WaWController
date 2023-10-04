const createError= require('http-errors')

// Reviews Controller for fetching and posting to database
module.exports = {
    postRating: async (req, res) => {
        //logic to post a rating goes here
        const dbCallBody= {
            rating: req.params.rating,
            id: req.params.id
        }
        verifyDbResponseSendStatus(req, res, dbCallBody)
    }, 

    postReview: async (req, res) => {
        //logic to post a review goes here
        const dbCallBody = {
            id: req.params.id,
            review: req.body.review,
        }

        verifyDbResponseSendStatus(req, res, dbCallBody)
    },
}

//TODO: not 100% sure this will work
const verifyDbResponseSendStatus = async(req, res, body) => {
    const responseFromDB= await makeDBCall(body);

    return responseFromDB ? res.sendStatus(204) : res.sendStatus(500, "DB error")
}