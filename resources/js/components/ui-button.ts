import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

const styles = css`
    :host {
        display: inline-flex;
    }
    button {
        inline-size: auto;
        font-weight: 600;
        border: none;
        border-radius: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: transform 120ms ease, box-shadow 140ms ease, background 140ms ease;
        cursor: pointer;
        white-space: nowrap;
        text-decoration: none;
        gap: 0.35rem;
        color: var(--btn-color, #fff);
    }
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
    button:hover:not(:disabled) {
        transform: translateY(-1px);
    }
    .size-md {
        padding: 12px 16px;
        font-size: 14px;
    }
    .size-sm {
        padding: 8px 12px;
        font-size: 13px;
    }
    .variant-primary {
        background: #2563eb;
        box-shadow: 0 10px 20px rgba(37, 99, 235, 0.25);
        --btn-color: #ffffff;
    }
    .variant-primary:hover:not(:disabled) {
        background: #1d4ed8;
    }
    .variant-success {
        background: #16a34a;
        box-shadow: 0 10px 20px rgba(22, 163, 74, 0.25);
        --btn-color: #ffffff;
    }
    .variant-success:hover:not(:disabled) {
        background: #15803d;
    }
    .variant-secondary {
        background: #e2e8f0;
        color: #0f172a;
        --btn-color: #0f172a;
    }
    .variant-secondary:hover:not(:disabled) {
        background: #cbd5e1;
    }
    .variant-danger {
        background: #e11d48;
        box-shadow: 0 10px 20px rgba(225, 29, 72, 0.2);
        --btn-color: #ffffff;
    }
    .variant-danger:hover:not(:disabled) {
        background: #be123c;
    }
`;

@customElement('ui-button')
export class UIButton extends LitElement {
    static styles = [styles];
    static formAssociated = true

    @property({type: String})
    declare variant: 'primary' | 'success' | 'secondary' | 'danger';

    @property({type: String})
    declare size: 'sm' | 'md';

    @property({type: Boolean, reflect: true})
    declare disabled: boolean;

    @property({type: String})
    declare type: 'button' | 'submit' | 'reset';

    constructor() {
        super();
        this.variant = 'primary';
        this.size = 'md';
        this.disabled = false;
        this.type = 'button';
    }

    private handleClick(event: Event) {
        if (this.disabled) {
            return;
        }

        if (this.type === 'submit') {
            const form = this.closest('form');
            if (form) {
                event.preventDefault();
                form.requestSubmit();
            }
        }
    }

    render() {
        const variantClass = `variant-${this.variant}`;
        const sizeClass = `size-${this.size}`;
        const hostClass = this.getAttribute('class') ?? '';
        const classes = ['btn', variantClass, sizeClass, hostClass].filter(Boolean).join(' ');

        return html`<button
            type=${this.type}
            class=${classes}
            ?disabled=${this.disabled}
            @click=${this.handleClick}
        >
            <slot></slot>
        </button>`;
    }
}
