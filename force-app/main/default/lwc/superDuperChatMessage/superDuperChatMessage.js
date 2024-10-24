import { LightningElement, api, wire } from 'lwc';
import getTranslatedMessage from '@salesforce/apex/SuperDuperChatController.getTranslatedMessage';

export default class SuperDuperChatMessage extends LightningElement {

    @api chatMessage;
    @api chatUser;
    @api chatTime;
    translatedChatMessage;

    connectedCallback() {
        this.invokeGetTranslatedMessage();
    }

    async invokeGetTranslatedMessage() {
        try {
            this.translatedChatMessage = '...';
            this.translatedChatMessage = await getTranslatedMessage({ message: this.chatMessage });
        } catch (error) {
            this.translatedChatMessage = JSON.stringify(error);
        }
    }

}