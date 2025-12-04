import { TodoApp } from './todo-app.component';

declare global {
    interface HTMLElementTagNameMap {
        'todo-app': TodoApp;
    }
}