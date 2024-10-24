public with sharing class SuperDuperChatController {

    @AuraEnabled(cacheable=true)
    public static string getTranslatedMessage(String message) {

        if (message == null) {
            return '';
        }

        System.debug('### getTranslatedMessage called with message=' + message);

        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:SuperDuperTranslateAPI');
        req.setMethod('POST');

        String body = '{"text": "' + message + '","sourceLanguage":"auto","targetLanguage":"en"}';

        req.setBody(body);

        Http http = new Http();
        HTTPResponse res = http.send(req);
        System.debug('### getTranslatedMessage response=\n' + res.getBody() + '\n');

        String translatedText = '';
        Map<String, Object> responseMap = (Map<String, Object>)JSON.deserializeUntyped(res.getBody());
        translatedText = (String)responseMap.get('TranslatedText');
        
        return translatedText;
    }

}