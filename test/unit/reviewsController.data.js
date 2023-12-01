let examplePutRatingRequest = {
    params: {
        mediaId: "example"
    },
    body: {
        rating: "example",
        review: "example"
    },
    user: {
        _id: "example"
    }
};

let exampleGetRatingRequest = {
    params: {
        mediaId: "example"
    },
    user: {
        _id: "example"
    }
}

let exampleRating = {
    _id: "example",
    userId: "example",
    mediaId: "example",
    review: "example",
    rating: 5
}

let exampleGetReviewsRequest = {
    params: {
        mediaId: "example",
        page: 1,
    },
    body: {
        pageSize: 20
    }
}

let exampleReviews = [
    {
        _id: "example",
        userId: "example",
        mediaId: "example",
        review: "example",
        rating: 5
    },
    {
        _id: "example",
        userId: "example",
        mediaId: "example",
        review: "example",
        rating: 5
    }
]

let exampleGetAverageRatingRequest = {
    params: {
        mediaId: "example"
    }
}

let exampleAverageRating = 4.3;

let exampleMediaInfo = {
    imdbId: "example",
    totalRatings: 43,
    numberOfRatings: 10
}

let exampleDeleteRatingRequest = {
    params: {
        mediaId: "example"
    },
    body: {
        delete: "both"
    },
    user: {
        _id: "example"
    }
}



module.exports = {
    examplePutRatingRequest,
    exampleGetRatingRequest,
    exampleGetReviewsRequest,
    exampleGetAverageRatingRequest,
    exampleDeleteRatingRequest,
    exampleRating,
    exampleReviews,
    exampleAverageRating,
    exampleMediaInfo
}