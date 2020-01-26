// writeStory.js
// Conor Slack
// Logz.io Hackathon 2020 - Log Shipper UI

// Load Test Data
// const {program, story} = require('./testData');

const randomUseragent = require('random-useragent');
console.log(randomUseragent.getRandom())

// Get random item from array
const randomItem = (items) => {
    return items[Math.floor(Math.random()*items.length)];
}

// Generate random IP address
const randomIp = () => {
    const arr = new Array(4).fill(0);
    return arr.map(() => Math.floor(Math.random()*255)).join('.')
}

// Standard Normal variate using Box-Muller transform.
const randn_bm = () => {
    var u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

// Generate timestamps
const timestampList = (from_time, to_time, n) => {
    from_time = new Date(from_time);
    to_time = new Date(to_time);
    const int = Math.floor((from_time - to_time)/n);
    let timestamps = new Array(+n).fill(+from_time);
    return timestamps.map((t,i )=> {
        let unix = t + i*int + randn_bm()*(int/2); // even intervals plus noise
        let timestamp = new Date(unix);
        return timestamp.toISOString();
    });
}

// Generate random object from template
const randomValues = (fields) => {
    let obj = {};
    fields.forEach(field => {
        if (field.type === 'key') {
            obj[field.field_name] = randomItem(field.values)
        } else if (field.type === 'ip') {
            obj[field.field_name] = randomIp()
        } else if (field.type === 'ua') {
            obj[field.field_name] = randomUseragent.getRandom()
        } else if (field.type === 'range') {
            obj[field.field_name] = Math.floor(Math.abs(randn_bm())*field.mean)
        }
    })
    return obj
}

// Write an array of logs from a program (one chapter of story)
const generateLogs = (program) => {
    const {log_type, from_time, to_time, n, fields} = program;
    const timestamps = timestampList(from_time, to_time, n);
    let logs = [];
    timestamps.forEach(t => {
        let logLine = randomValues(fields);
        logLine['@timestamp'] = t;
        logLine.type = log_type;
        logs.push(logLine);
    })
    return logs;
}

// Write a "story" array from array of "chapters"
const writeStory = (story) => {
    return new Promise((resolve, reject) => {
        let storyLogs = [];
        story.forEach(chapter => {
            storyLogs = [...storyLogs, ...generateLogs(chapter)]
        })
        resolve(storyLogs)
    })
};

module.exports = writeStory

// writeStory(story).then(console.log)