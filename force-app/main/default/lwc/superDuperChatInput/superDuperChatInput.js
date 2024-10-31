import { LightningElement, api } from 'lwc';
import getTranslatedMessage from '@salesforce/apex/SuperDuperChatController.getTranslatedMessage';

export default class SuperDuperChatInput extends LightningElement {

    @api language;
    message;
    isTranslated;
    translatedMeta;
    translatedMessage;

    get isNotTranslated() {
        return !this.isTranslated;
    }

    async invokeGetTranslatedMessage() {
        try {
            // Temporary message until the translated message is received from the server
            this.isTranslated = true;
            this.translatedMeta = '? → ?';
            this.translatedMessage = '...';

            // Create request for the translate API
            let translateRequest = {
                text: this.message,
                sourceLanguageCode: 'auto',
                targetLanguageCode: this.language
            };
            console.log(`translateRequest: ${JSON.stringify(translateRequest)}`);

            // Call the translate API to translate the message
            let translateResponse = await getTranslatedMessage({ translateRequest: translateRequest });
            console.log(`translateResponse: ${JSON.stringify(translateResponse)}`);

            // Store translated message if the source language was not english
            if (translateResponse) {
                this.isTranslated = true;
                this.translatedMeta = translateResponse.sourceLanguageCode + ' → ' + translateResponse.targetLanguageCode;
                this.translatedMessage = translateResponse.translatedText;
            } else {
                this.clearTranslation();
            }

        } catch (error) {
            this.translatedMessage = '???';
            console.log(`error: ${JSON.stringify(error)}`);
        }
    }

    handlePreviewAgentMessage(event) {
        this.message = this.refs.messageInput.value;
        this.invokeGetTranslatedMessage();
    }

    handleSendAgentMessage(event) {
        let sendAgentMessageEvent = new CustomEvent('sendagentmessage', {
            detail: this.translatedMessage
        });
        this.dispatchEvent(sendAgentMessageEvent);
        this.clearTranslation();
        this.clearInput();
    }

    clearTranslation() {
        this.isTranslated = false;
        this.translatedMeta = undefined;
        this.translatedMessage = undefined;
        this.message = undefined;
    }

    clearInput() {
        this.refs.messageInput.value = undefined;
    }

}