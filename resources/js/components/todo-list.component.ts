import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {todoListStyles} from './todo-list.styles';
import type {Todo} from './api';
import './todo-item';

@customElement('todo-list')
export class TodoList extends LitElement {
    static styles = [todoListStyles];

    @property({type: Array})
    declare todos: Todo[];

    constructor() {
        super();
        this.todos = [];
    }

    render() {
        return this.todos.length
            ? html`
                  <ul class="list">
                      ${this.todos.map(
                          (todo) =>
                              html`<todo-item
                                  .todo=${todo}
                                  @todo-toggle=${(e: CustomEvent) => this.forward(e, 'todo-toggle')}
                                  @todo-delete=${(e: CustomEvent) => this.forward(e, 'todo-delete')}
                              ></todo-item>`,
                      )}
                  </ul>
              `
            : html`<p class="empty">할 일이 없습니다. 새로 추가해 보세요.</p>`;
    }

    private forward(event: CustomEvent, eventName: string) {
        event.stopPropagation();
        this.dispatchEvent(
            new CustomEvent(eventName, {
                detail: event.detail,
                bubbles: true,
                composed: true,
            }),
        );
    }
}
