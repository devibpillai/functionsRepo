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
 
export default async function (event, context, logger) {
    logger.info(`Invoking Myfunction with payload `);
    logger.info(`Invoking Myfunction with payload ${JSON.stringify(event.data || {})}`);
    logger.info(`Invoking parse below-------->>`);
    const payload = event.data;
    var oppID = '' ;
    
    for(let i = 0; i < payload.length; i++) {
        oppID = oppID+"'"+payload[i].Id +"',";
    }
    oppID = "("+oppID.slice(0, -1)+")";
    logger.info(`Invoking oppID ----->> ${oppID}`);
    logger.info(`Invoking payload ----->> ${payload[0].Id}`);
   
    const results = await context.org.dataApi.query(`SELECT Opportunity_Name__c ,Id,Name FROM Revenue__c WHERE Opportunity_Name__c IN ${oppID}`);

    logger.info(JSON.stringify(results));
    try {
    var revDelete = []; 
    const uow = context.org.dataApi.newUnitOfWork();
    for(let i = 0; i < results.records.length; i++){
      logger.info(`revDelete ----->> ${results.records[i].Id}`);
        const revDML = uow.registerDelete({
        type: "Revenue__c",
        id:results.records[i].Id
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
        
        return response;
      } catch (err) {
        const errorMessage = `Failed to insert record. Root Cause : ${err.message}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }
    //var retResponse = "Deleted revenue record";

    

    return oliOptyMap;
}
