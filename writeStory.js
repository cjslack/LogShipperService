// writeStory.js
// Conor Slack
// Logz.io Hackathon 2020 - Log Shipper UI

// Load Test Data
//const {program, story} = require('./testData');

// Generate timestamps
const timestampList = (from_time, to_time, n) => {
    // Convert strings to dates
    from_time = new Date(from_time);
    to_time = new Date(to_time);
    // Calculate interval time bewteen logs
    const int = Math.floor((from_time - to_time)/n);
    // Populate Array and fill with from_time
    let timestamps = new Array(n).fill(+from_time);
    // For each element in timestamps array
    return timestamps.map((t,i )=> {
        // add interval times times counter to current element
        let unix = t + i*int;
        // convert unix time back to date
        let timestamp = new Date(unix);
        // convert timestamp to string and return
        return timestamp.toISOString();
    });
}

// Get random item from array
const randomItem = (items) => {
    // Generate random number from 0 to length of array and get element at that index
    return items[Math.floor(Math.random()*items.length)];
}

// Generate random object from template
const randomValues = (fields) => {
    //  create empty object
    let obj = {};
    // for each field in fields array
    fields.forEach(field => {
        // create key value pair with field name and a random item from values
        obj[field.field_name] = randomItem(field.values)
    })
    return obj
}

// Write an array of logs from a program (one chapter of story)
const generateLogs = (program) => {
    // destructure program into variables
    const {log_type, from_time, to_time, n, fields} = program;
    // generate list of timestamps
    const timestamps = timestampList(from_time, to_time, n);
    // empty logs array
    let logs = [];
    // for each timestamp in timestamps array
    timestamps.forEach(t => {
        // generate log line with fields and random values from array
        let logLine = randomValues(fields);
        // add timestamp to object
        logLine['@timestamp'] = t;
        // add type to object
        logLine.type = log_type;
        // append line to array
        logs.push(logLine);
    })
    return logs;
}

// Write a "story" array from array of "chapters"
const writeStory = (story) => {
    return new Promise((resolve, reject) => {
        // create empty for all logs in story
        let storyLogs = [];
        // for each chapter in story
        story.forEach(chapter => {
            // append storyLogs array with array generated from chapter
            storyLogs = [...storyLogs, ...generateLogs(chapter)]
        })
        resolve(storyLogs)
    })
};

module.exports = writeStory

//writeStory(story).then(console.log)