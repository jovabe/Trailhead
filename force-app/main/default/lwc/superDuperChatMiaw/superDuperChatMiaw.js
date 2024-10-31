import { LightningElement, api, wire } from 'lwc';

import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';

import ConversationEndUserChannel from '@salesforce/messageChannel/lightning__conversationEndUserMessage';
import ConversationAgentSendChannel from '@salesforce/messageChannel/lightning__conversationAgentSend';

export default class superDuperChatMiaw extends LightningElement {

    // ### LWC Events for Enhanced Messaging ###
    // https://developer.salesforce.com/docs/component-library/bundle/lightning-conversation-toolkit-api/documentation
    // https://developer.salesforce.com/docs/atlas.en-us.api_console.meta/api_console/sforce_api_console_events_messaging_lwc_conversationendusermessage.htm

    // Holds active subscriptions
    ConversationEndUserChannelSubscription = null;
    ConversationAgentSendChannelSubscription = null;

    // Conversation meta
    @api recordId;

    // To pass scope, you must get a message context.
    @wire(MessageContext)
    messageContext;

    // Standard lifecycle hook used to subscribe to the message channels
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    // Pass scope to the subscribe() method.
    subscribeToMessageChannel() {
        if (!this.ConversationEndUserChannelSubscription) {
            this.ConversationEndUserChannelSubscription = subscribe(
                this.messageContext,
                ConversationEndUserChannel,
                (message) => this.handleEndUserMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
        if (!this.ConversationAgentSendChannelSubscription) {
            this.ConversationAgentSendChannelSubscription = subscribe(
                this.messageContext,
                ConversationAgentSendChannel,
                (message) => this.handleAgentMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    // Pass scope to the unsubscribe() method.
    unsubscribeToMessageChannel() {
        unsubscribe(this.ConversationEndUserChannelSubscription);
        this.ConversationEndUserChannelSubscription = null;
        unsubscribe(this.ConversationAgentSendChannelSubscription);
        this.ConversationAgentSendChannelSubscription = null;
    }

    // Handler for message received by component
    handleEndUserMessage(message) {
        console.log(`ConvToolkit: handleEndUserMessage: ${JSON.stringify(message)}`);
        this.recordId = message.recordId;
        let endUserMessageEvent = new CustomEvent('endusermessage', {
            detail: message
        });
        this.dispatchEvent(endUserMessageEvent);
    }

    // Handler for message received by component
    handleAgentMessage(message) {
        console.log(`ConvToolkit: handleAgentMessage: ${JSON.stringify(message)}`);
        this.recordId = message.recordId;
        let agentMessageEvent = new CustomEvent('agentmessage', {
            detail: message
        });
        this.dispatchEvent(agentMessageEvent);
    }

    // Expose agent send message
    @api 
    async sendMessage(message) {
        console.log(`ConvToolkit: sendTextMessage: ${message}`);
        const ConversationToolkit = this.template.querySelector('lightning-conversation-toolkit-api');
        try {
            const sendTextMessageResult = await ConversationToolkit.sendTextMessage(
                this.recordId,
                {text: message}
            );
            console.log(`ConvToolkit: sendTextMessage: Result: ${sendTextMessageResult}`);
        } catch (error) {
            console.log(`ConvToolkit: sendTextMessage: Error: ${JSON.stringify(error)}`);
        }
    }
    
}