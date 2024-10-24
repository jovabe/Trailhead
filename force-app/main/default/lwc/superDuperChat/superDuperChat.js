import { LightningElement, track } from 'lwc';

export default class Chat extends LightningElement {

    @track messages = [];

    // messages = [
    //     {
    //         user: 'Joris',
    //         text: 'Bonjour',
    //         time: '11:20AM',
    //     },
    //     {
    //         user: 'Joris',
    //         text: 'Jai une probleme avec mon produit',
    //         time: '11:21AM',
    //     }
    // ];

    // {user: 'Joris',text: 'Bonjour',time: '11:20AM'}

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
            user: 'Guest',
            text: this.refs.messageInput.value,
            time: new Date().toLocaleString()
        });
        this.refs.messageInput.value = undefined;
    }
}