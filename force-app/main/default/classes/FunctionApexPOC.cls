public with sharing class FunctionApexPOC {
    public static void test(String inputstring) {
        System.debug('Invoking myfunction');
        System.debug(inputstring);
        functions.Function myFunction = functions.Function.get('MyFunctionProject.myfunction');
        functions.FunctionInvocation invocation = myFunction.invoke(inputstring);
        String jsonResponse = invocation.getResponse();

        System.debug('Response from myfunction ' + jsonResponse);
    }
}
