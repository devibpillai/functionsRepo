/**
 * Describe Myfunction here.
 *
 * The exported method is the entry point for your code when the function is invoked.
 *
 * Following parameters are pre-configured and provided to your function on execution:
 * @param event: represents the data associated with the occurrence of an event, and
 *                 supporting metadata about the source of that occurrence.
 * @param context: represents the connection to Functions and your Salesforce org.
 * @param logger: logging handler used to capture application logs and trace specifically
 *                 to a given execution of a function.
 */
import fetch from "node-fetch";
export default async function (event, context, logger) {
  //-------start-------------
  try {
    var url;
    var client_id;
    var client_secret;
    var grant_type;
    var token_value;
    var api_scope;
    var Username;
    var pwd;
    var refresh_token;
    var endpoint;
    logger.info(`JSON Constructed%%%%%%%%%%%%%%%%%%%%%-------->>`);
    url = "https://fssfed.ge.com/fss/as/token.oauth2";
    grant_type = "client_credentials";
    client_id = "GEHC_CREDIT_PORTAL_DEV_OIDC_Client";
    client_secret =
      "XDhWbbizjsScAEMnMFJfMRtsnYjwh4fWb7a9Z34LpATWYA93DhupMoSpPZdB";
    api_scope = "Heroku_API";
    endpoint =
      "https://dev-gehc-cp.herokuapp.com/services/account/creditrequest";
    Username = "";
    pwd = "";
    var jsonString =
      '[{"updhId":null,"upCommercialId":"U-6TS2F2","taxId":null,"sumAR3Y":0.00,"sfid":"0010c00001yiZAcAAM","request_type":"BIR-Only","pCommercialId":null,"oaUPDuns":null,"oaDuns":null,"highestARbalanceGE":0.00,"GlobalRegion":"AKA","dnbForceFlag":false,"dfhcId":null,"CountryName":"Australia","commercialId":"U-6TS2F2","birReportFlag":false}]';
    logger.info(`JSON Constructed-------->>`);
    //Http http = new Http();
    //HttpRequest req = new HttpRequest();
    //req.setEndpoint(url);
    //req.setMethod('POST');
    //req.setBody('grant_type='+grant_type+'&client_id='+client_id+'&client_secret='+client_secret);
    //HTTPResponse res = http.send(req);
    //var response = '';
    fetch(url, {
      method: "post", // Default is 'get'
      body: JSON.stringify(
        "grant_type=" +
          grant_type +
          "&client_id=" +
          client_id +
          "&client_secret=" +
          client_secret
      ),
      mode: "cors",
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then((response) => response.json())
      .then((json) => console.log("Response", json));
    /*if (json.status == 200) {
   response = JSON.serializePretty(JSON.deserializeUntyped(res.getBody()));
   }*/
    logger.info(`response ---> ${response}`);

    var authorizationHeader = "Bearer " + token_value;
    var endPointURL = endpoint;
    fetch(endPointURL, {
      method: "post", // Default is 'get'
      body: jsonString,
      mode: "cors",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: authorizationHeader
      })
    })
      .then((response) => response.json())
      .then(logger.info(`response ---> ${json}`));

    logger.info(`Invoking Myfunction with payload `);
    logger.info(
      `Invoking Myfunction with payload ${JSON.stringify(event.data || {})}`
    );
    logger.info(`Invoking parse below-------->>`);
    const payload = event.data;
    var oppID = "";

    for (let i = 0; i < payload.length; i++) {
      oppID = oppID + "'" + payload[i].Id + "',";
    }
    oppID = "(" + oppID.slice(0, -1) + ")";
    logger.info(`Invoking oppID ----->> ${oppID}`);
    logger.info(`Invoking payload ----->> ${payload[0].Id}`);

    const results = await context.org.dataApi.query(
      `SELECT Opportunity_Name__c ,Id,Name FROM Revenue__c WHERE Opportunity_Name__c IN ${oppID}`
    );

    logger.info(JSON.stringify(results));

    const resultsAc = await context.org.dataApi.query(
      `SELECT Id,Name FROM Account`
    );
    logger.info(`resultsAc ----->> ${resultsAc}`);
    var revDelete = [];
    const uow = context.org.dataApi.newUnitOfWork();
    for (let i = 0; i < results.records.length; i++) {
      logger.info(
        `revDelete inside forloop ----->> ${results.records[i].fields.Id}`
      );
      const revDML = uow.registerDelete({
        type: "Revenue__c",
        id: results.records[i].fields.Id
      });
      revDelete.push(revDML);
    }
    logger.info(`revDelete ----->> ${revDelete}`);
    /*const oliQuery = await context.org.dataApi.query(`Select opportunityId,Business__c,Modality_Offering__c,PricebookEntryId,PricebookEntry.Product2Id, TotalPrice, UnitPrice,Modality__c,Product_Name__c, ListPrice,Domain_Name__c ,Business_Category__c From OpportunityLineItem where opportunityId IN ${oppID} AND TotalPrice!=0`);
    const oliOptyMap = new Map();
    for(let i = 0; i < oliQuery.length; i++){
        oliOptyMap.set(oliQuery[i].opportunityId,oliQuery[i]);
    }*/
    /*for(let i = 0; i < payload.length; i++){ 
        if(payload[i].Amount!=null && payload[i].Estimated_Sales_Date__c!=null && payload[i].Term_New__c!=null && payload[i].Term_New__c!=0){
            differenceAmount =0;
                            //getting no of days for the first term , it should be always minus from the 5th of next month.its just for the showing purpose 
                            //Amount would be always calculated by considering 30 days in month and every month starts from 1 
                            
                            Decimal dayInt = (date.daysInMonth((ConvertDateToDateTime( payload[i].Estimated_Sales_Date__c).year()),(ConvertDateToDateTime( payload[i].Estimated_Sales_Date__c)).month())-(ConvertDateToDateTime( payload[i].Estimated_Sales_Date__c).day()))+5;
                              system.debug('***** dayInt -:'+dayInt);              
                            //this is for the generating revenue for the first month
                            Decimal dayFirstRecInt =0;
                            dayFirstRecInt=(date.daysInMonth((ConvertDateToDateTime( payload[i].Estimated_Sales_Date__c).year()),(ConvertDateToDateTime( payload[i].Estimated_Sales_Date__c)).month())) - (ConvertDateToDateTime( payload[i].Estimated_Sales_Date__c).day())+1;
                             system.debug('***** dayFirstRecInt -:'+dayFirstRecInt);                
                            //getting total no of days for the opportunity to get the amount for specific month
                            Decimal noDaysInt = 0;
                            
        }
    }*/

    // Commit the Unit of Work with all the previous registered operations
    const response = await context.org.dataApi.commitUnitOfWork(uow);
    const Http = new XMLHttpRequest();
    const url = "https://jsonplaceholder.typicode.com/posts";
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      console.log(Http.responseText);
    };

    return response;
  } catch (err) {
    const errorMessage = `Failed to insert record. Root Cause : ${err.message}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
  //var retResponse = "Deleted revenue record";

  return oliOptyMap;
}
