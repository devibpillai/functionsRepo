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
    const evtData = JSON.stringify(event.data);
    logger.info(`Invoking stringify below-------->>`);
    const oppList =  JSON.parse(evtData);
    logger.info(`Invoking parse below-------->>`);
    const opp = JSON.parse(oppList);
    logger.info(`Invoking parse below-------->>${opp[0].Id}`);
    logger.info(`Invoking oppList ----->> ${oppList}`);
    logger.info(`Invoking opp ----->> ${opp}`);
    const results = await context.org.dataApi.query('select Opportunity_Name__c ,Id,Name from Revenue__c where Opportunity_Name__c = '+opp[0].Id);

    logger.info(JSON.stringify(results));

    return results;
}
