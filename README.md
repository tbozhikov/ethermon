# Ethereum monitor

## Quick start guide
1. Clone the repo
```
git clone git@github.com:tbozhikov/ethermon.git
```
2. Open the repo folder and install dependencies

```
npm install  
```
3. Start the project using one of the `npm` scripts
```
npm run start-all
```

The above steps will start: 
- An **API Server node**, that serves a REST API used to manage the dynamic config
- A **worker node** that monitors all Ethereum transactions, filters them and stores them into DB according to the dynamic config/filters

4. Upon the first run, the solution detects if there isn't a DB and creates one (sqlite), with the needed tables inside. It will also have an **empty** dynamic config stored in the DB.
5. Create a filter 
    Use the `POST /api/configuration` endpoint and pass the filters as JSON args, like so:

```
curl --location --request POST 'localhost:3000/api/configuration' \
--header 'Content-Type: application/json' \
--data-raw '{
    "transactionFilters": [
        {
            "field": "to",
            "value": "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
            "criteria": "equals",
            "matchCase": false
        },
        {
            "field": "to",
            "value": "0x7875c0Dd92be2d313c597136ABF0148682D39A53",
            "criteria": "equals",
            "matchCase": true
        },
        {
            "field": "gas",
            "value": "850000",
            "criteria": "above"
        }
    ]
}'
```

6. Observe the console output or logs of the **worker** - it should hot-reload the configuration and begin storing transactions satisfied by these filters.
## Prerequisites
- NodeJS v12.16.1

## Features
- Monitor all transactions in the Ethereum blockchain
- Filter the transactions by managing filters through an API
- Store the filters in a DB
- Hot-reload of the filters upon change
- Store filtered transactions in a DB, storing the id of the configuration that triggered it
- Logging solution with file and console outputs

### Filters
The supported filter properties are as follows:
| property | type | description |
| ------ | ------ | ------ |
| field | string | the field, can be any of the [Ethereum transaction fields](https://medium.com/coinmonks/transactions-in-ethereum-e85a73068f74) |
| value | string/number | the field value to match |
| criteria | string | currently supported are "equals", "above" (for numeric values only), "below" (for numeric values only) |
| matchCase | boolean | true or false, applies for string values. Performs case insensitive match if false |

> When multiple filters are provided, logical OR is applied, so if any filter applies successfully, the transaction gets stored.   


## Improvement areas
- Use MoM solution (RabbitMQ, Kafka etc.) for change detection of configuration (instead of current `scheduleChangeDetection` mechanism using timer)
- Run API and Worker nodes in containers
- Bundle the nodes so that they are better suitable for deployment on environments  
- Introduce better/richer filters
- Tests
