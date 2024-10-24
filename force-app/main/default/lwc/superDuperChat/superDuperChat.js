import { LightningElement, api, track, wire } from 'lwc';

import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';

import ConversationEndUserChannel from '@salesforce/messageChannel/lightning__conversationEndUserMessage';

export default class SuperDuperChat extends LightningElement {

    // Properties

    @track messages = []; // {type: 'outbound', user: 'Agent', text: 'Bonjour', time: '01/01/2024, 11:59:59'}

    // Lifecycle

    connectedCallback() {
        this.populateMessagesId();
    }

    // Handlers

    populateMessagesId() {
        let counter = 1;
        this.messages.forEach((message) => {
            if (!message.id) {
                message.id = `msg${counter}`;
                counter++;
            }
        });
    }

    handleEndUserMessage(event) {
        this.messages.push({
            type: 'inbound',
            user: event.detail.name,
            text: event.detail.content,
            time: new Date(event.detail.timestamp).toLocaleString()
        });
        event.stopPropagation();
    }

    handleSendAgentMessage(event) {
        this.messages.push({
            type: 'outbound',
            user: 'Agent',
            text: this.refs.messageInput.value,
            time: new Date().toLocaleString()
        });
        this.refs.messageInput.value = undefined;
    }
}