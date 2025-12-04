import {html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {todoInputStyles} from './todo-input.styles';
import './ui-text-input';
import './ui-button';


@customElement('todo-input')
export class TodoInput extends LitElement {
    static styles = [todoInputStyles];

    @property({type: Boolean})
    declare loading: boolean;

    @state()
    declare title: string;

    constructor() {
        super();
        this.title = '';
        this.loading = false;
    }

    private submit(e: Event) {
        e.preventDefault();
        const value = this.title.trim();
        if (! value) {
            return;
        }
        this.dispatchEvent(
            new CustomEvent('todo-create', {
                detail: { title: value },
                bubbles: true,
                composed: true,
            }),
        );
        this.title = '';
    }

    private onKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            this.submit(e);
        }
    }

    render() {
        return html`
            <form class="form" @submit=${this.submit} @keydown=${this.onKeydown}>
                <ui-text-input
                    name="title"
                    placeholder="무엇을 할까요?"
                    .value=${this.title}
                    @ui-input=${(e: CustomEvent) => (this.title = e.detail.value)}
                    ?disabled=${this.loading}
                ></ui-text-input>
                <ui-button
                    type="button"
                    .disabled=${this.loading}
                    variant="success"
                    @click=${this.submit}
                >추가</ui-button>
            </form>
        `;
    }
}
