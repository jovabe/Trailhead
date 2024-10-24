import { LightningElement, api, track, wire } from 'lwc';

import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';

import ConversationEndUserChannel from '@salesforce/messageChannel/lightning__conversationEndUserMessage';

export default class Chat extends LightningElement {

    // ### Lifecycle Functions ###

    connectedCallback() {
        this.subscribeToMessageChannel(); // Standard lifecycle hook used to subscribe to the message channel
        this.populateMessagesId();
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
        this.messages.push({
            type: 'inbound',
            user: 'Customer',
            text: message.content,
            time: new Date().toLocaleString()
        });
        this.refs.messageInput.value = undefined;
    }

    // ### Array of chat messages ###

    @track messages = []; // {type: 'outbound', user: 'Agent', text: 'Bonjour', time: '01/01/2024, 11:59:59'}

    populateMessagesId() {
        let counter = 1;
        this.messages.forEach((message) => {
            if (!message.id) {
                message.id = `msg${counter}`;
                counter++;
            }
        });
    }

    handleClick(event) {
        this.messages.push({
            type: 'outbound',
            user: 'Agent',
            text: this.refs.messageInput.value,
            time: new Date().toLocaleString()
        });
        this.refs.messageInput.value = undefined;
    }
}