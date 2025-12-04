import {TodoItem} from './todo-item.component';

declare global {
    interface HTMLElementTagNameMap {
        'todo-item': TodoItem;
    }
}
