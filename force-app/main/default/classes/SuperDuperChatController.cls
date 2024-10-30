public with sharing class SuperDuperChatController {

    @AuraEnabled(cacheable=true)
    public static TranslateResponse getTranslatedMessage(TranslateRequest translateRequest) {

        // If the request is empty, the execution will be halted
        if (translateRequest == null) throw new AuraException('Request cannot be null');

        // The input text will be cleaned from unwanted characters
        translateRequest.text = cleanup(translateRequest.text);

        // The input text will be sent to the translation API
        HttpResponse res = callTranslateAPI(createRequestBody(translateRequest));

        // The response will be parsed and the translation will be returned
        TranslateResponse translateResponse = parseResponse(res.getBody());
        return translateResponse;
    }

    private static String cleanup(String message) {
        String cleanedMessage = message;
        // remove line breaks (\n) from message as translate API doesn't support them
        cleanedMessage = cleanedMessage.replaceAll('\n', ' '); 
        return cleanedMessage;
    }

    private static String createRequestBody(TranslateRequest translateRequest) {
        return JSON.serialize(translateRequest);
    }

    private static TranslateResponse parseResponse(String responseBody) {
        return (TranslateResponse) JSON.deserialize(responseBody, TranslateResponse.class);
    }

    private static HTTPResponse callTranslateAPI(String requestBody) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:SuperDuperTranslateAPI');
        req.setMethod('POST');
        req.setBody(requestBody);

        Http http = new Http();
        HTTPResponse res = http.send(req);

        return res;
    }

    class TranslateRequest {
        @AuraEnabled public String text {get;set;}
        @AuraEnabled public String sourceLanguageCode {get;set;}
        @AuraEnabled public String targetLanguageCode {get;set;}
    }

    class TranslateResponse {
        @AuraEnabled public String translatedText {get;set;}
        @AuraEnabled public String sourceLanguageCode {get;set;}
        @AuraEnabled public String targetLanguageCode {get;set;}
    }

}