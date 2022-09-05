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
    try{
    for(let i = 0; i < payload.length; i++) {
        oppID = oppID+"'"+payload[i].Id +"',";
    }
    oppID = oppID.slice(0, -1);
    logger.info(`Invoking oppID ----->> ${oppID}`);
    logger.info(`Invoking payload ----->> ${payload[0].Id}`);
    }catch(e){
        logger.info(`exception===>>${e}`);
    }
    const results = await context.org.dataApi.query(`SELECT Opportunity_Name__c ,Id,Name FROM Revenue__c WHERE Opportunity_Name__c IN '(${oppID})'`);

    logger.info(JSON.stringify(results));

    return results;
}
