import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {todoItemStyles} from './todo-item.styles';
import type {Todo} from './api';
import './ui-button';

@customElement('todo-item')
export class TodoItem extends LitElement {
    static styles = [todoItemStyles];

    @property({type: Object})
    declare todo: Todo;

    private toggle() {
        this.dispatchEvent(
            new CustomEvent('todo-toggle', {
                detail: { id: this.todo.id, completed: ! this.todo.completed },
                bubbles: true,
                composed: true,
            }),
        );
    }

    private delete() {
        this.dispatchEvent(
            new CustomEvent('todo-delete', {
                detail: { id: this.todo.id },
                bubbles: true,
                composed: true,
            }),
        );
    }

    render() {
        return html`
            <li class="item">
                <input type="checkbox" class="checkbox" .checked=${this.todo.completed} @change=${this.toggle} />
                <span class="title ${this.todo.completed ? 'done' : ''}">${this.todo.title}</span>
                <ui-button type="button" size="sm" variant="secondary" @click=${this.delete}>삭제</ui-button>
            </li>
        `;
    }
}
