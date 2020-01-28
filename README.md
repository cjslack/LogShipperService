# Log Shipper Service
### Tell a logging 'Story' by creating comprehensive demo logs

This service takes a POST request to it's host and ships the 'Story' defined in the request body.

A 'Story' is an array of 'Chapter' objects, which define the log_type, period of time to ship, the number of logs to ship between that period, and the content of the logs. 

#### Example Chapter
```
{
    log_type: 'test1', 
    from_time: now - 3600*1000, 
    to_time: now, 
    n: 5, 
    fields: [
        {
          field_name: 'status', 
          type: 'key', values: [200, 400, 500], 
          probability: [.8,.15,.05]
        },
        {
          field_name: 'method', 
          type: 'key', 
          values: ['GET', 'POST', 'PUT', 'DELETE'], 
          probability: [.70, .20, .05, .05]
        },
        {
          field_name: 'field2',
          type: 'key',
          values: ["/users","/posts", "/comments"]
        },
        {
          field_name: 'ip',
          type: 'ip'
        },
        {
          field_name: 'UA',
          type: 'ua'
        },
        {
          field_name: 'bytes',
          type: 'normal', 
          mean: 100, 
          sd: 20
        }
    ]
}
```

