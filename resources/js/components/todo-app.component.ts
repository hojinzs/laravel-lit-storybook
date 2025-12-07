import {html, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';
// import appCss from './todo-app.styles.ts?inline';
import {api as apiImport} from '../libs/api.ts';
import { styles } from "./todo-app.styles.ts"
import type {Todo} from '../libs/api.ts';
import './todo-input';
import './todo-list';
import './ui-button';

@customElement('todo-app')
export class TodoApp extends LitElement {
    static styles = [styles];

    @state()
    declare todos: Todo[];

    @state()
    declare loading: boolean;

    @state()
    declare error: string;

    constructor(private readonly api = apiImport) {
        super();
        this.todos = [];
        this.loading = false;
        this.error = '';
    }

    connectedCallback(): void {
        super.connectedCallback();
        void this.fetchTodos();
    }

    private showError(message: string) {
        this.error = message;
        setTimeout(() => (this.error = ''), 3500);
    }

    private async fetchTodos(): Promise<void> {
        this.loading = true;
        try {
            const { todos } = await this.api.listTodos();
            this.todos = todos;
        } catch (error) {
            console.error(error);
            this.showError('할 일을 불러오지 못했습니다.');
        } finally {
            this.loading = false;
        }
    }

    private async onCreate(e: CustomEvent) {
        const { title } = e.detail;
        this.loading = true;
        try {
            const { todo } = await this.api.createTodo(title);
            this.todos = [todo, ...this.todos];
        } catch (error) {
            console.error(error);
            this.showError('할 일을 추가할 수 없습니다.');
        } finally {
            this.loading = false;
        }
    }

    private async onToggle(e: CustomEvent) {
        const { id, completed } = e.detail;
        try {
            const { todo } = await this.api.toggleTodo(id, completed);
            this.todos = this.todos.map((t) => (t.id === id ? todo : t));
        } catch (error) {
            console.error(error);
            this.showError('상태 변경 실패');
        }
    }

    private async onDelete(e: CustomEvent) {
        const { id } = e.detail;
        const confirmed = confirm('이 항목을 삭제할까요?');
        if (! confirmed) {
            return;
        }
        try {
            await this.api.deleteTodo(id);
            this.todos = this.todos.filter((t) => t.id !== id);
        } catch (error) {
            console.error(error);
            this.showError('삭제 실패');
        }
    }

    render() {
        return html`
            <div class="app">
                <div class="container">
                    <div class="toolbar">
                        <div>
                            <h1 class="title">Lit Todo</h1>
                            <p class="subtitle">웹 컴포넌트로 구성된 간단한 TODO 리스트</p>
                        </div>
                        <span class="badge">로그인됨</span>
                    </div>

                    ${this.error ? html`<div class="error">${this.error}</div>` : null}

                    <div class="actions">
                        <todo-input @todo-create=${this.onCreate} .loading=${this.loading}></todo-input>
                    </div>
                    ${this.loading && ! this.todos.length ? html`<p class="hint">불러오는 중...</p>` : null}
                    <todo-list
                        .todos=${this.todos}
                        @todo-toggle=${this.onToggle}
                        @todo-delete=${this.onDelete}
                    ></todo-list>
                </div>
            </div>
        `;
    }
}
