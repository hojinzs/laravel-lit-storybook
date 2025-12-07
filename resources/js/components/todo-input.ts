import { TodoInput } from './todo-input.component';

declare global {
    interface HTMLElementTagNameMap {
        'todo-input': TodoInput;
    }
}

export { TodoInput };