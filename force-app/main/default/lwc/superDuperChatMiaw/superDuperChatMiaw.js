import { LightningElement, api, track, wire } from 'lwc';

import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';

import ConversationEndUserChannel from '@salesforce/messageChannel/lightning__conversationEndUserMessage';

export default class superDuperChatMiaw extends LightningElement {

    // ### LWC Events for Enhanced Messaging ###
    // https://developer.salesforce.com/docs/component-library/bundle/lightning-conversation-toolkit-api/documentation
    // https://developer.salesforce.com/docs/atlas.en-us.api_console.meta/api_console/sforce_api_console_events_messaging_lwc_conversationendusermessage.htm

    // Holds active subscription
    subscription = null;

    // To pass scope, you must get a message context.
    @wire(MessageContext)
    messageContext;

    // Standard lifecycle hook used to subscribe to the message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

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
        let endUserMessageEvent = new CustomEvent('endusermessage', {
            detail: message
        });
        this.dispatchEvent(endUserMessageEvent);
    }
    
}