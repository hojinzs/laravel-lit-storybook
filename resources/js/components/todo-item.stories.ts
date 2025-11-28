import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './todo-item';

const sampleTodo = {
    id: 1,
    title: '샘플 할 일',
    completed: false,
    created_at: '',
    updated_at: '',
};

type Args = {
    completed: boolean;
    title: string;
};

const meta: Meta<Args> = {
    title: 'Todo/Todo Item',
    component: 'todo-item',
    args: {
        completed: false,
        title: sampleTodo.title,
    },
    render: (args) =>
        html`<todo-item .todo=${{...sampleTodo, completed: args.completed, title: args.title}}></todo-item>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
export const Completed: Story = {args: {completed: true}};
