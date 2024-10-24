import { LightningElement, track } from 'lwc';

export default class Chat extends LightningElement {

    @track messages = []; // {type: 'outbound', user: 'Agent', text: 'Bonjour', time: '01/01/2024, 11:59:59'}

    connectedCallback() {
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