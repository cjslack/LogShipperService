const express = require('express');
const app = express();
const port = 3000;

const writeStory = require('./writeStory.js');

app.use(express.json());
app.use(express.static('public'));

app.post('/', async (req, res) => {
    const {token, region, story} = req.body;
    try {
        let logger = require('logzio-nodejs').createLogger({token, host: `listener${region ? '-' + region: ''}.logz.io`});
        let logs = await writeStory(story);
        logs.forEach(line => {
            logger.log(line);
        });
        res.status(200).send('Succesfully shipped story');
    } catch (e) {
        res.status(500).send(e.message);
    }
})

app.listen(port, () => console.log(`app listening on port ${port}`))