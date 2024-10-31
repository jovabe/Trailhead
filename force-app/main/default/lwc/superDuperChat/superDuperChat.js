import { LightningElement, api, track } from 'lwc';

export default class SuperDuperChat extends LightningElement {

    @api recordId;
    @track messages = []; // {type: 'outbound', user: 'Agent', text: 'Bonjour', time: '01/01/2024, 11:59:59'}
    language = 'en';

    connectedCallback() {
        this.populateMessagesId();
    }

    renderedCallback() {
        this.refs.scrollToBottom.scrollIntoView();
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
        this.messages.push({
            type: 'inbound',
            user: event.detail.name,
            text: event.detail.content,
            time: new Date(event.detail.timestamp).toLocaleString()
        });
        event.stopPropagation();
    }

    handleAgentMessage(event) {
        this.messages.push({
            type: 'outbound',
            user: event.detail.name,
            text: event.detail.content,
            time: new Date(event.detail.timestamp).toLocaleString()
        });
        event.stopPropagation();
    }

    handleLanguageChange(event) {
        this.language = event.detail;
        event.stopPropagation();
    }

    handleSendAgentMessage(event) {
        const miaw = this.template.querySelector('c-super-duper-chat-miaw');
        miaw.sendMessage(event.detail);
    }

}