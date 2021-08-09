'use strict';
const
    fs = require('fs'),
    jsForce = require('jsforce'),
    {getToken} = require('sf-jwt-token'),
    privateKey = fs.readFileSync('server.key').toString('utf8')



class Salesforce {
    constructor(credentials) {
        console.log('cred ' , credentials);
        if( !credentials
            || !credentials.CLIENT_ID
            || !credentials.USERNAME
            || !credentials.LOGIN_URL
        ) throw new TypeError('Credentials must be defined.');

        this.credentials = credentials;

        this.client = new jsForce.Connection();
    }

    async auth() {

        try {
            let jwttokenresponse = await getToken({
                iss: this.credentials.CLIENT_ID,
                sub: '',
                aud: this.credentials.LOGIN_URL,
                privateKey: privateKey
            });
            this.client.initialize({
                instanceUrl: jwttokenresponse.instance_url,
                accessToken: jwttokenresponse.access_token
            });
            
        }
        catch(e){
            console.log(e);
        }
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
        
        return new Promise((resolve, reject) => {
                    let query = this.credentials.QUERY;
                    this.client.query(query, (err, result) => {
                        if (err) {
                            console.error("Error ", err);
                            return (resolve(false))
                        }
                        return (resolve(result))
                    });
                    return (resolve)
        });
    }
}

module.exports = Salesforce;