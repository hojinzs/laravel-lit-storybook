import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import './ui-text-input';

type Args = {
    value: string;
    placeholder: string;
    disabled: boolean;
    type: string;
};

const meta: Meta<Args> = {
    title: 'UI/Text Input',
    component: 'ui-text-input',
    args: {
        value: '',
        placeholder: 'Type here...',
        disabled: false,
        type: 'text',
    },
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'password'],
        },
    },
    render: (args) =>
        html`<ui-text-input
            .value=${args.value}
            placeholder=${args.placeholder}
            type=${args.type}
            ?disabled=${args.disabled}
        ></ui-text-input>`,
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};
export const Disabled: Story = {args: {disabled: true, value: 'Disabled'}};
export const Password: Story = {args: {type: 'password', placeholder: '•••••••'}};
