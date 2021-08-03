`use strict`

const
    Salesforce =  require('./salesforceLib'),

    { query, loginUrl, username, useraddress, password, securityToken, CRON, sobject, UPDATE_LEAD_LIMIT, CRON_FTP,
        loginUrlEAttest, client_idEAttest, usernameEAttest, passwordEAttest } = process.env;

class Core {

    static startProcess = async() => {
        console.log('inside Assync process');

        //get account SF
        let AccountAudits = await this.getAccountAndAuditSF()
        console.log('AccountAudits ', AccountAudits.length);

    }

    
    static getAccountAndAuditSF = async () => {

        let sf = await new Salesforce({
            "loginUrl" : loginUrl,
            "username" : username + '@' + useraddress,
            "password" : password,
            "securityToken" : securityToken,
            "sobject": sobject,
            "query" : query
        });
        if(sf){
            let ret = await sf.get();
            return ret.records;
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