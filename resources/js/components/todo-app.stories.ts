import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './todo-app';

type Args = Record<string, unknown>;

const meta: Meta<Args> = {
    title: 'Todo/App',
    component: 'todo-app',
    render: () => html`<todo-app></todo-app>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
