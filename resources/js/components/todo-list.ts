import {TodoList} from './todo-list.component';

declare global {
    interface HTMLElementTagNameMap {
        'todo-list': TodoList;
    }
}
