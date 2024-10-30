import { LightningElement, api } from 'lwc';
import getTranslatedMessage from '@salesforce/apex/SuperDuperChatController.getTranslatedMessage';

export default class SuperDuperChatMessage extends LightningElement {

    @api message;
    @api user;
    @api time;
    @api type;
    @api language;
    translatedMessage;

    connectedCallback() {
        this.invokeGetTranslatedMessage();
    }

    async invokeGetTranslatedMessage() {
        try {
            this.translatedMessage = '...';
            let translateRequest = {
                text: this.message,
                sourceLanguageCode: 'auto',
                targetLanguageCode: 'en'
            };
            if (this.type === 'outbound' && this.language) {
                translateRequest.targetLanguageCode = this.language;
            }
            console.log(`language: ${this.language}`);
            console.log(`translateRequest: ${JSON.stringify(translateRequest)}`);

            let translateResponse = await getTranslatedMessage({ translateRequest: translateRequest });
            console.log(`translateResponse: ${JSON.stringify(translateResponse)}`);

            this.translatedMessage = translateResponse.translatedText;
            if (this.type === 'inbound' && translateResponse && translateResponse.sourceLanguageCode) {
                this.doLanguageChange(translateResponse.sourceLanguageCode);
            }

        } catch (error) {
            this.translatedMessage = 'An error has occurred.';
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
        if (this.type === 'outbound') {
            return 'slds-chat-listitem slds-chat-listitem_outbound';
        } else {
            return 'slds-chat-listitem slds-chat-listitem_inbound';
        }
    }

    get messageTextCSS() {
        if (this.type === 'outbound') {
            return 'slds-chat-message__text slds-chat-message__text_outbound';
        } else {
            return 'slds-chat-message__text slds-chat-message__text_inbound';
        }
    }

    get messageTextTranslatedCSS() {
        if (this.type === 'outbound') {
            return 'slds-chat-message__text slds-chat-message__text_outbound superduper-chat-message-translated';
        } else {
            return 'slds-chat-message__text slds-chat-message__text_inbound superduper-chat-message-translated';
        }
    }

}