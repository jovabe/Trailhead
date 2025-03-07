import { LightningElement, api } from 'lwc';
import getTranslatedMessage from '@salesforce/apex/SuperDuperChatController.getTranslatedMessage';

export default class SuperDuperChatInput extends LightningElement {

    @api language;
    message;
    translatedMessage;

    async handleSendAgentMessage(event) {
        this.message = this.refs.messageInput.value;
        await this.invokeGetTranslatedMessage();
        if (this.translatedMessage) {
            let sendAgentMessageEvent = new CustomEvent('sendagentmessage', {
                detail: this.translatedMessage
            });
            this.dispatchEvent(sendAgentMessageEvent);
        }
        this.cleanup();
    }

    handleClearAgentMessage(event) {
        this.cleanup();
    }

    async invokeGetTranslatedMessage() {
        try {
            // Temporary message until the translated message is received from the server
            this.translatedMessage = undefined;

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
                this.translatedMessage = translateResponse.translatedText;
            } else {
                this.cleanup();
            }

        } catch (error) {
            this.translatedMessage = undefined;
            console.log(`error: ${JSON.stringify(error)}`);
        }
    }

    cleanup() {
        this.refs.messageInput.value = undefined;
        this.translatedMessage = undefined;
        this.message = undefined;
    }

}