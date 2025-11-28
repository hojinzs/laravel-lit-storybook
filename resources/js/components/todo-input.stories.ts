import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './todo-input';

type Args = {
    loading: boolean;
};

const meta: Meta<Args> = {
    title: 'Todo/Todo Input',
    component: 'todo-input',
    args: {
        loading: false,
    },
    render: (args) => html`<todo-input .loading=${args.loading}></todo-input>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
export const Loading: Story = {args: {loading: true}};
