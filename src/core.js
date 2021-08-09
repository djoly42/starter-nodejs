`use strict`

const
    Salesforce =  require('./salesforceLib'),

    { CLIENT_ID, USERNAME, DOMAINMAIL, LOGIN_URL, QUERY } = process.env;

class Core {

    static startProcess = async() => {
        console.log('inside Assync process');

        //get account SF
        let AccountAudits = await this.getAccountAndAuditSF()
        //console.log('AccountAudits ', AccountAudits.length);

    }

    
    static getAccountAndAuditSF = async () => {

        let sf = await new Salesforce({
            "CLIENT_ID" : CLIENT_ID,
            "USERNAME" : USERNAME,
            "DOMAINMAIL": DOMAINMAIL,
            "LOGIN_URL" : LOGIN_URL,
            "QUERY": QUERY,
                });
        if(sf){
            let ret = await sf.auth();
            let accounts = await sf.get();
            console.log('accounts ', accounts);
            //return ret.records;
        }
        else{
            throw new TypeError('Fail client SF');
        }
    }

    static updateAccount = async (accounts) => {
        
        let sf = await new Salesforce({
            "loginUrl" : loginUrl,
            "username" : username + '@' + useraddress,
            "password" : password,
            "securityToken" : securityToken,
            "sobject": sobject,
            "query" : query
        });
        if(sf){
            let ret = await sf.updateAll(accounts);
            return ret;
        }
        else{
            throw new TypeError('Fail client SF');
        }
    }
}

module.exports = {
    Core
}