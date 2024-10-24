import { LightningElement, api, wire } from 'lwc';
import getTranslatedMessage from '@salesforce/apex/SuperDuperChatController.getTranslatedMessage';

export default class SuperDuperChatMessage extends LightningElement {

    @api chatMessage;
    @api chatUser;
    @api chatTime;
    @api chatMessageType;
    chatMessageTranslated;

    connectedCallback() {
        this.invokeGetTranslatedMessage();
    }

    async invokeGetTranslatedMessage() {
        try {
            this.chatMessageTranslated = '...';
            this.chatMessageTranslated = await getTranslatedMessage({ message: this.chatMessage });
        } catch (error) {
            this.chatMessageTranslated = JSON.stringify(error);
        }
    }

    get chatListItemCSS() {
        if (this.chatMessageType === 'outbound') {
            return 'slds-chat-listitem slds-chat-listitem_outbound';
        } else {
            return 'slds-chat-listitem slds-chat-listitem_inbound';
        }
    }

    get chatMessageTextCSS() {
        if (this.chatMessageType === 'outbound') {
            return 'slds-chat-message__text slds-chat-message__text_outbound-agent';
        } else {
            return 'slds-chat-message__text slds-chat-message__text_inbound';
        }
    }

    get chatMessageTextTranslatedCSS() {
        if (this.chatMessageType === 'outbound') {
            return 'slds-chat-message__text slds-chat-message__text_outbound-agent superduper-chat-message-translated';
        } else {
            return 'slds-chat-message__text slds-chat-message__text_inbound superduper-chat-message-translated';
        }
    }

}