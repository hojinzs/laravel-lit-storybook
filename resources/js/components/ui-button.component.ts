import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {uiButtonStyles} from './ui-button.styles';

@customElement('ui-button')
export class UIButton extends LitElement {
    static styles = [uiButtonStyles];
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
