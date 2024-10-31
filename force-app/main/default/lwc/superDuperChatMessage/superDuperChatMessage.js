import { LightningElement, api } from 'lwc';
import getTranslatedMessage from '@salesforce/apex/SuperDuperChatController.getTranslatedMessage';

export default class SuperDuperChatMessage extends LightningElement {

    @api message;
    @api user;
    @api time;
    @api type;
    @api language;
    isTranslated;
    translatedMeta;
    translatedMessage;

    connectedCallback() {
        this.invokeGetTranslatedMessage();
    }

    async invokeGetTranslatedMessage() {
        try {
            // Temporary message until the translated message is received from the server
            this.isTranslated = true;
            this.translatedMeta = '';
            this.translatedMessage = '...';

            // Create request for the translate API
            let translateRequest = {
                text: this.message,
                sourceLanguageCode: 'auto',
                targetLanguageCode: 'en'
            };
            console.log(`translateRequest: ${JSON.stringify(translateRequest)}`);

            // Call the translate API to translate the message
            let translateResponse = await getTranslatedMessage({ translateRequest: translateRequest });
            console.log(`translateResponse: ${JSON.stringify(translateResponse)}`);

            // Store translated message if the source language was not english
            if (translateResponse && translateResponse.sourceLanguageCode !== 'en') {
                this.isTranslated = true;
                this.translatedMeta = translateResponse.sourceLanguageCode + ' → ' + translateResponse.targetLanguageCode;
                this.translatedMessage = translateResponse.translatedText;
            } else {
                this.isTranslated = false;
                this.translatedMeta = undefined;
                this.translatedMessage = undefined;
            }

            // Store the language of the end user
            if (this.type === 'inbound' && translateResponse && translateResponse.sourceLanguageCode) {
                this.doLanguageChange(translateResponse.sourceLanguageCode);
            }

        } catch (error) {
            this.translatedMessage = '???';
            console.log(`error: ${JSON.stringify(error)}`);
        }
    }

    doLanguageChange(languageCode) {
        console.log(`doLanguageChange: ${JSON.stringify(languageCode)}`);
        let languageChangeEvent = new CustomEvent('languagechange', {
            detail: languageCode
        });
        this.dispatchEvent(languageChangeEvent);
    }

    get listItemCSS() {
        switch (this.type) {
            case 'outbound':
                return 'slds-chat-listitem slds-chat-listitem_outbound';
            default:
                return 'slds-chat-listitem slds-chat-listitem_inbound';
        }
    }

    get messageTextCSS() {
        switch (this.type) {
            case 'outbound':
                return 'slds-chat-message__text slds-chat-message__text_outbound';
            default:
                return 'slds-chat-message__text slds-chat-message__text_inbound';
        }
    }

    get messageTextTranslatedCSS() {
        switch (this.type) {
            case 'outbound':
                return 'slds-chat-message__text slds-chat-message__text_outbound superduper-chat-message-translated';
            default:
                return 'slds-chat-message__text slds-chat-message__text_inbound superduper-chat-message-translated';
        }
    }

}