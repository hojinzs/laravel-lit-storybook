import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {uiTextInputStyles} from './ui-text-input.styles';

@customElement('ui-text-input')
export class UITextInput extends LitElement {
    static styles = [uiTextInputStyles];
    static formAssociated = true

    @property({type: String})
    declare value: string;

    @property({type: String})
    declare type: string;

    @property({type: String})
    declare name: string;

    @property({type: String})
    declare placeholder: string;

    @property({type: String})
    declare autocomplete: string;

    @property({type: Boolean})
    declare disabled: boolean;

    constructor() {
        super();
        this.value = '';
        this.type = 'text';
        this.name = '';
        this.placeholder = '';
        this.autocomplete = 'off';
        this.disabled = false;
    }

    private onInput(event: InputEvent) {
        this.value = (event.target as HTMLInputElement).value;
        this.dispatchEvent(
            new CustomEvent('ui-input', {
                detail: { value: this.value },
                bubbles: true,
                composed: true,
            }),
        );
    }

    render() {
        const hostClass = this.getAttribute('class') ?? '';
        return html`<input
            class=${['field', hostClass].filter(Boolean).join(' ')}
            .value=${this.value}
            type=${this.type}
            name=${this.name}
            placeholder=${this.placeholder}
            autocomplete=${this.autocomplete}
            ?disabled=${this.disabled}
            @input=${this.onInput}
        />`;
    }
}
