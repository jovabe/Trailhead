import { LightningElement, api, track, wire } from 'lwc';

import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';

import ConversationEndUserChannel from '@salesforce/messageChannel/lightning__conversationEndUserMessage';

export default class SuperDuperChatMIAWService extends LightningElement {

    // ### Lifecycle Functions ###
    connectedCallback() {
        this.subscribeToMessageChannel(); // Standard lifecycle hook used to subscribe to the message channel
    }

    // ### LWC Events for Enhanced Messaging ###
    // https://developer.salesforce.com/docs/atlas.en-us.api_console.meta/api_console/sforce_api_console_events_messaging_lwc_conversationendusermessage.htm
    subscription = null;

    // To pass scope, you must get a message context.
    @wire(MessageContext)
    messageContext;

    // Pass scope to the subscribe() method.
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                ConversationEndUserChannel,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    // Handler for message received by component
    handleMessage(message) {
        let endUserMessage = {
            type: 'inbound',
            user: 'Customer',
            text: message.content,
            time: new Date().toLocaleString()
        }
        let endUserMessageEvent = new CustomEvent('endusermessage', {
            detail: endUserMessage
        });
        this.dispatchEvent(endUserMessageEvent);
    }
    
}