module.exports = function (app, query) {
    app.post('/event', async (req, res) => {

        let sql = async function () {
            try {
                var data = `
            INSERT INTO event (video_id, type, payload, timestamp) 
            VALUES (${req.body.video_id}, '${req.body.type}', '${req.body.payload}', '${req.body.timestamp}')
            `
                await query(data)
            } finally { }
        }

        sql().then(() => {
            res.status(201).json({ msg: "Birtate change created" })
        })
    })
}