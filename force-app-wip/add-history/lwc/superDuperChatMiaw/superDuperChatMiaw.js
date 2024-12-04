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

    // Conversation record information
    @api recordId;

    // Holds active subscriptions
    ConversationEndUserChannelSubscription = null;
    ConversationAgentSendChannelSubscription = null;

    // To pass scope, you must get a message context.
    @wire(MessageContext)
    messageContext;

    // Standard lifecycle hook used to (un)subscribe to the message channels
    connectedCallback() {
        this.subscribeToMessageChannels();
    }
    disconnectedCallback() {
        this.unsubscribeToMessageChannels();
    }

    // Pass scope to the subscribe() method.
    subscribeToMessageChannels() {
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
    unsubscribeToMessageChannels() {
        unsubscribe(this.ConversationEndUserChannelSubscription);
        this.ConversationEndUserChannelSubscription = null;
        unsubscribe(this.ConversationAgentSendChannelSubscription);
        this.ConversationAgentSendChannelSubscription = null;
    }

    // Handler for message received by ConversationEndUserChannel
    // https://developer.salesforce.com/docs/atlas.en-us.api_console.meta/api_console/sforce_api_console_events_messaging_lwc_conversationendusermessage.htm
    handleEndUserMessage(message) {
        console.log(`ConvToolkit: handleEndUserMessage: ${JSON.stringify(message)}`);
        this.recordId = message.recordId;
        let endUserMessageEvent = new CustomEvent('endusermessage', {
            detail: message
        });
        this.dispatchEvent(endUserMessageEvent);
    }

    // Handler for message received by ConversationAgentSendChannel
    // https://developer.salesforce.com/docs/atlas.en-us.api_console.meta/api_console/sforce_api_console_events_messaging_lwc_conversationagentsend.htm
    handleAgentMessage(message) {
        console.log(`ConvToolkit: handleAgentMessage: ${JSON.stringify(message)}`);
        this.recordId = message.recordId;
        let agentMessageEvent = new CustomEvent('agentmessage', {
            detail: message
        });
        this.dispatchEvent(agentMessageEvent);
    }

    // Conversation Toolkit API : sendTextMessage
    // Sends a new conversation text message from the agent
    // https://developer.salesforce.com/docs/atlas.en-us.api_console.meta/api_console/sforce_api_console_lightning_sendTextMessage_lwc.htm
    @api 
    async sendTextMessage(message) {
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

    // Conversation Toolkit API : getConversationLog
    // Returns contents of the visible Conversation Log. Only returns Text formatted Static Content Messages.
    // https://developer.salesforce.com/docs/atlas.en-us.api_console.meta/api_console/sforce_api_console_lightning_getConversationLog_lwc.htm
    @api 
    async getConversationLog() {
        console.log(`ConvToolkit: getConversationLog`);
        const ConversationToolkit = this.template.querySelector('lightning-conversation-toolkit-api');
        try {
            const conversationLogResult = await ConversationToolkit.getConversationLog(
                this.recordId
            );
            console.log(`ConvToolkit: getConversationLog: Result: ${JSON.stringify(conversationLogResult)}`);
            return conversationLogResult;
        } catch (error) {
            console.log(`ConvToolkit: getConversationLog: Error: ${JSON.stringify(error)}`);
        }
    }

    // Conversation Toolkit API : endConversation
    // Ends the given conversation record
    // https://developer.salesforce.com/docs/atlas.en-us.api_console.meta/api_console/sforce_api_console_lightning_endConversation_lwc.htm
    @api 
    async endConversation() {
        console.log(`ConvToolkit: endConversation`);
        const ConversationToolkit = this.template.querySelector('lightning-conversation-toolkit-api');
        try {
            const endConversationResult = await ConversationToolkit.endConversation(
                this.recordId
            );
            console.log(`ConvToolkit: endConversation: Result: ${endConversationResult}`);
        } catch (error) {
            console.log(`ConvToolkit: endConversation: Error: ${JSON.stringify(error)}`);
        }
    }
    
}