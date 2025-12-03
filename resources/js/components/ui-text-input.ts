import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

const styles = css`
    :host {
        display: block;
    }
    .field {
        width: 100%;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-sizing: border-box;
        background: #f8fafc;
        padding: 12px 14px;
        font-size: 14px;
        outline: none;
        transition: border-color 120ms ease, box-shadow 120ms ease;
        color: #0f172a;
    }
    .field:focus {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
    .field:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

@customElement('ui-text-input')
export class UITextInput extends LitElement {
    static styles = [styles];
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
