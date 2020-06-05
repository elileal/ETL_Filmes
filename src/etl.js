const assert = require('assert');
const chalk = require("chalk");


const extractTransform = function (db, dbETL) {
    const movies = db.collection('movies');
    const tags = db.collection('tags');
    movies.find({}).forEach(movie => {
        if (movie.genres !== "(no genres listed)") {
            movie.genres = movie.genres.split('|')
        } else {
            movie = {
                _id: movie._id,
                title: movie.title
            }
        }
        db.collection('links').findOne({ _id: movie._id }, (err, link) => {
            assert.equal(null, err);
            if (link) {
                movie.links = {
                    imdbId: link.imdbId,
                    tmdbId: link.tmdbId
                }
            }
            movie.ratings = []
            db.collection('ratings').find({ movieId: movie._id }).forEach((rating) => {
                movie.ratings.push({
                    rating: rating.rating,
                    timestamp: rating.timestamp,
                    userId: rating.userId
                })

            }, (err) => {
                assert.equal(null, err);
                dbETL.collection('movies').findOneAndUpdate(
                    { _id: movie._id },
                    { $set: movie },
                    {
                        upsert: true,
                        returnNewDocument: true,
                        returnOriginal: false
                    },
                    (err, doc) => {
                        assert.equal(null, err);

                    }
                );
            })

        })
    }, (err) => {
        assert.equal(null, err);
        dbETL.collection('movies').createIndex(
            { "ratings.userId": 1 },
            { background: true },
            (err, result) => {
                assert.equal(null, err);
            }
        )
        console.log(chalk.green('Movies extract, transform and load complete!'));
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - ");
        tags.aggregate([
            {
                $group: {
                    _id: "$movieId",
                    data: {
                        $push: "$tag"
                    }
                }
            }
        ]).forEach(tag => {
            tag.data.forEach((t, i, arr) => {
                if (typeof t === 'string') {
                    arr[i] = t.toLowerCase()
                }
            })

            const result = tag.data.filter((value, i, arr) => {
                return arr.indexOf(value) === i;
            })
            tag.data = result
            dbETL.collection('movies').findOneAndUpdate(
                { _id: tag._id },
                { $set: { tags: tag.data } },
                { upsert: true, returnNewDocument: true },
                (err, doc) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );

        }, (err) => {
            assert.equal(null, err);
            console.log(chalk.green('Movies insert tags complete!'));
            console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - ");
            return false;
        })
    });
    tags.aggregate([
        {
            $group: {
                _id: "$tag",
                data: {
                    $push: "$$ROOT"
                }
            }
        },
        { $project: { "data._id": 0, "data.tag": 0 } }
    ], {
        allowDiskUse: true
    }).forEach(tag => {
        dbETL.collection('tags').findOneAndUpdate(
            { _id: tag._id },
            { $set: tag },
            { upsert: true, returnNewDocument: true },
            (err, doc) => {
                assert.equal(null, err);
            }
        );
    }, (err) => {
        assert.equal(null, err);
        dbETL.collection('tags').createIndex(
            { "data.userId": 1 },
            { background: true },
            (err, result) => {
                assert.equal(null, err);
            });
        console.log(chalk.green('Tags extract, transform and load complete!'));
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - ");
    })
}

module.exports = { extractTransform }