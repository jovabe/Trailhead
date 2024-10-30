import { LightningElement, api, track } from 'lwc';

export default class SuperDuperChat extends LightningElement {

    @track messages = []; // {type: 'outbound', user: 'Agent', text: 'Bonjour', time: '01/01/2024, 11:59:59'}
    language = 'en';
    recordId = '';

    connectedCallback() {
        this.populateMessagesId();
    }

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
        this.recordId = event.detail.recordId;
        this.messages.push({
            type: 'inbound',
            user: event.detail.name,
            text: event.detail.content,
            time: new Date(event.detail.timestamp).toLocaleString()
        });
        event.stopPropagation();
    }

    handleAgentMessage(event) {
        this.recordId = event.detail.recordId;
        this.messages.push({
            type: 'outbound',
            user: event.detail.name,
            text: event.detail.content,
            time: new Date(event.detail.timestamp).toLocaleString()
        });
        event.stopPropagation();
    }

    handleSendAgentMessage(event) {
        /*
        this.messages.push({
            type: 'outbound',
            user: 'Agent',
            text: this.refs.messageInput.value,
            time: new Date().toLocaleString()
        });
        */
        console.log(`handleSendAgentMessage: ${this.refs.messageInput.value}`);
        const miaw = this.template.querySelector('c-super-duper-chat-miaw');
        miaw.sendMessage(this.refs.messageInput.value);
        this.refs.messageInput.value = undefined;
    }

    handleLanguageChange(event) {
        console.log(`handleLanguageChange: ${JSON.stringify(event.detail)}`);
        this.language = event.detail;
        event.stopPropagation();
    }

}