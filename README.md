# Log Shipper Service
## Tell a logging 'Story' by creating comprehensive demo logs

This service takes a POST request to it's host and ships the 'Story' defined in the request body.

The request body should contain:

- `token`: Account shipping token
- `region`: Account region ('au', 'ca', 'eu', 'nl', 'wa', exclude if US-East)
- `story`

A `story` is an array of objects we will call 'chapters', which define the log_type, period of time to ship, the number of logs to ship between that period, and the content of the logs. 

Each 'chapter' object in the `story` array contains:

- `log_type`: the 'type' field added to each log line
- `from_time`: time to start shipping (ISO 8601 format)
- `to_time`: time to stop shipping (ISO 8601 format)
- `n`: number of logs to ship between the defined time period spread at even intervals (plus or minus a small number)
- `fields`: an array of objects that define the remaining fields and the possible values they can take

The objects in the `fields` array must contain:

- `field_name`: name of the field to be shipped
- `type`: one of 'key', 'normal', 'ip', or 'ua'
    - `type: 'key'` will randomly select a field from an array of `values`, using a `probability` array if supplied
    - `type: 'normal'` will generate a random number from an normal distribution, using `mean` and `sd` (standard deviation)
    - `type: 'ua'` will generate a random user-agent string
    - `type: 'ip'` will generate a random ip address

#### Example Request
This example request will create some basic logs over a 3 hour period with a 1 hour spike in the midddle of excess requests to the '/users' resource returning many 500 errors

```
{
    'token': '<LOGZIO_SHIPPING_TOKEN>',
    'story':[
        {
            log_type: 'story-demo', 
            from_time: '2020-01-28T20:00:00.000Z', 
            to_time: '2020-01-28T23:00:00.000Z', 
            n: 200, 
            fields: [
                {
                  field_name: 'status', 
                  type: 'key', 
                  values: [200, 400, 500], 
                  probability: [.80,.15,.05]
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
        },
        {
            log_type: 'story-demo', 
            from_time: '2020-01-28T221:00:00.000Z', 
            to_time: '2020-01-28T22:00:00.000Z', 
            n: 100, 
            fields: [
                {
                  field_name: 'status', 
                  type: 'key', 
                  values: [200, 400, 500], 
                  probability: [.20,.05,.75]
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
                  values: ["/users"]
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
    ]
}
```

