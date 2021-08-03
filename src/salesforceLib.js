'use strict';
const
    jsForce = require('jsforce');

class Salesforce {
    constructor(credentials) {
        if( !credentials
            || !credentials.loginUrl
            || !credentials.username
            || !credentials.password
            || !credentials.securityToken
            || !credentials.query
            || !credentials.sobject
        ) throw new TypeError('Credentials must be defined.');

        this.credentials = credentials;

        this.client = new jsForce.Connection({loginUrl: this.credentials.loginUrl});
    }

    insert(values) {
        return new Promise((resolve, reject) => {
            this
                .client
                .login(this.credentials.username, this.credentials.password + this.credentials.securityToken, async(err, info) => {
                    this.client.sobject(this.credentials.sobject).create(values)
                        .then((result) => {
                            return resolve(result);
                        })
                        .catch(err => {
                            console.error(err);
                            return reject(err);
                        })
                    ;
                })
            ;
        });
    }

    update(values) {
        return new Promise(async(resolve, reject) => {
            let results = [];
            for(let i=0; i < values.length; i++){
                let result = await this.updateOne(values[i]);
                results.push(result[0]);
            }
            return resolve(results);
        });
    }

    updateAll(values) {
        return new Promise((resolve, reject) => {
            this
                .client
                .login(this.credentials.username, this.credentials.password + this.credentials.securityToken, async(err, info) => {
                    this.client.sobject(this.credentials.sobject)
                        .update(values)
                        .then((result) => {
                            return resolve(result);
                        })
                        .catch(err => {
                            console.log(err);
                            return reject(err);
                        })
                    ;
                })
            ;
        });
    }

    updateOne({findKey, values}) {
        return new Promise((resolve, reject) => {
            this
                .client
                .login(this.credentials.username, this.credentials.password + this.credentials.securityToken, async(err, info) => {
                    this.client.sobject(this.credentials.sobject)
                        .find(findKey)
                        .update(values)
                        .then((result) => {
                            return resolve(result);
                        })
                        .catch(err => {
                            console.error(err)
                            return reject(err);
                        })
                    ;
                })
            ;
        });
    }

    async get(values) {
        let query = this.credentials.query;

        return new Promise((resolve, reject) => {

            this
                .client
                .login(this.credentials.username, this.credentials.password + this.credentials.securityToken, async (err, info) => {

                    if (err) { return console.error(err); }


                    this.client.query(query, (err, result) => {
                        if (err) {
                            console.error("Error ", err);
                            return (resolve(false))
                        }
                        return (resolve(result))
                    });
                    return (resolve)
                });
            return (resolve)
        });
    }
}

module.exports = Salesforce;