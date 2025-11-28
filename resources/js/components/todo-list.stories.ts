import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './todo-list';

const todos = [
    {id: 1, title: '첫 번째 할 일', completed: false, created_at: '', updated_at: ''},
    {id: 2, title: '두 번째 할 일', completed: true, created_at: '', updated_at: ''},
];

type Args = {
    empty: boolean;
};

const meta: Meta<Args> = {
    title: 'Todo/Todo List',
    component: 'todo-list',
    args: {
        empty: false,
    },
    render: (args) => html`<todo-list .todos=${args.empty ? [] : todos}></todo-list>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
export const Empty: Story = {args: {empty: true}};
