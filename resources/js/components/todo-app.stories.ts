import {html} from 'lit';
import type {Meta, StoryObj} from '@storybook/web-components';
import { TodoAppComponent } from './todo-app.component.ts';
import type { Todo } from './api';
import { expect } from 'storybook/test';
import { within } from "shadow-dom-testing-library"

type Args = Record<string, unknown>;

const mockApi = (() => {
    let todos: Todo[] = [
        {
            id: 1,
            title: '샘플 할일 1',
            completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: 2,
            title: '샘플 할일 2',
            completed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: 3,
            title: 'Storybook에서 테스트 중',
            completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];
    let nextId = 4;

    const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

    return {
        async me() {
            await delay();
            return { user: { id: 1, name: 'Test User', email: 'test@example.com' } };
        },

        async login(email: string, _password: string) {
            await delay();
            return { user: { id: 1, name: 'Test User', email } };
        },

        async logout() {
            await delay();
            return { message: 'Logged out successfully' };
        },

        async listTodos() {
            await delay();
            return { todos: [...todos] };
        },

        async createTodo(title: string) {
            await delay();
            const todo: Todo = {
                id: nextId++,
                title,
                completed: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            todos = [todo, ...todos];
            return { todo };
        },

        async toggleTodo(id: number, completed: boolean) {
            await delay();
            const index = todos.findIndex(t => t.id === id);
            if (index === -1) {
                throw new Error('Todo not found');
            }
            todos[index] = {
                ...todos[index],
                completed,
                updated_at: new Date().toISOString(),
            };
            return { todo: todos[index] };
        },

        async deleteTodo(id: number) {
            await delay();
            todos = todos.filter(t => t.id !== id);
            return { message: 'Todo deleted successfully' };
        },

        reset() {
            todos = [
                {
                    id: 1,
                    title: '샘플 할일 1',
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: 2,
                    title: '샘플 할일 2',
                    completed: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: 3,
                    title: 'Storybook에서 테스트 중',
                    completed: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ];
            nextId = 4;
        },
    };
})()

// Storybook용 커스텀 컴포넌트 등록
customElements.define('todo-app-story', class extends TodoAppComponent {
    constructor() {
        super(mockApi);
    }
});


const meta: Meta<Args> = {
    title: 'Todo/App',
    component: 'todo-app-story',
    render: () => html`<todo-app-story></todo-app-story>`
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

// 할 일 생성 테스트
export const CreateTodo: Story = {
    play: async ({ canvasElement, userEvent }) => {
        // 초기 상태로 리셋
        mockApi.reset();

        // 랜더링 대기 (mockApi의 500ms 지연)
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = within(canvasElement)

        // 입력 필드 찾기
        const inputs = canvas.getAllByShadowPlaceholderText('무엇을 할까요?')
        const input = inputs.find(el => el.tagName.toLowerCase() === 'input') as HTMLInputElement
        await expect(input).toBeDefined()

        // 할 일 입력
        await userEvent.type(input , 'Storybook에서 추가한 할 일');

        // Enter 키로 제출
        await userEvent.keyboard('{Enter}');

        // 잠시 대기 (mockApi의 300ms 지연)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 새 할 일이 목록에 추가되었는지 확인
        await expect(canvas.getByShadowText('Storybook에서 추가한 할 일')).toBeInTheDocument();
    },
};

// 할 일 토글 테스트
export const ToggleTodo: Story = {
    play: async ({ canvasElement, userEvent }) => {
        // 초기 상태로 리셋
        mockApi.reset();

        // 랜더링 대기
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = within(canvasElement);

        // 첫 번째 체크박스 찾기 (샘플 할일 1)
        const checkboxes = canvas.getAllByShadowRole('checkbox');
        const firstCheckbox = checkboxes[0];

        // 초기 상태 확인 (unchecked)
        await expect(firstCheckbox).not.toBeChecked();

        // 체크박스 클릭
        await userEvent.click(firstCheckbox);

        // 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 500));

        // 체크된 상태 확인
        await expect(firstCheckbox).toBeChecked();
    },
};

// 할 일 삭제 테스트
export const DeleteTodo: Story = {
    play: async ({ canvasElement, userEvent }) => {
        // 초기 상태로 리셋
        mockApi.reset();

        // 랜더링 대기
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = within(canvasElement);

        // 삭제할 할 일이 존재하는지 확인
        const todoText = '샘플 할일 1';
        const todoElement = canvas.getByShadowText(todoText);
        await expect(todoElement).toBeInTheDocument();

        // confirm 모킹 (자동으로 OK 클릭)
        const originalConfirm = window.confirm;
        window.confirm = () => true;

        // 삭제 버튼 찾기 (텍스트로 찾기)
        const deleteButtons = canvas.getAllByShadowText('삭제');
        const deleteButton = deleteButtons[0];

        // 삭제 버튼 클릭
        await userEvent.click(deleteButton);

        // 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 500));

        // 할 일이 삭제되었는지 확인
        await expect(canvas.queryByShadowText(todoText)).not.toBeInTheDocument();

        // confirm 복원
        window.confirm = originalConfirm;
    },
};

// 전체 시나리오 테스트
export const FullScenario: Story = {
    play: async ({ canvasElement, userEvent }) => {
        // 초기 상태로 리셋
        mockApi.reset();

        // 랜더링 대기
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = within(canvasElement);

        // 1. 새 할 일 추가
        const inputs = canvas.getAllByShadowPlaceholderText('무엇을 할까요?');
        const input = inputs.find(el => el.tagName.toLowerCase() === 'input') as HTMLInputElement;

        await userEvent.type(input, '테스트 할 일');

        await userEvent.keyboard('{Enter}');
        await new Promise(resolve => setTimeout(resolve, 500));

        // 추가된 할 일 확인
        await expect(canvas.getByShadowText('테스트 할 일')).toBeInTheDocument();

        // 2. 할 일 완료로 표시
        const checkboxes = canvas.getAllByShadowRole('checkbox');
        const newTodoCheckbox = checkboxes[0]; // 가장 최근 추가된 항목

        await expect(newTodoCheckbox).not.toBeChecked();

        await userEvent.click(newTodoCheckbox);
        await new Promise(resolve => setTimeout(resolve, 500));

        await expect(newTodoCheckbox).toBeChecked();

        // 3. 다시 미완료로 표시
        await userEvent.click(newTodoCheckbox);
        await new Promise(resolve => setTimeout(resolve, 500));

        await expect(newTodoCheckbox).not.toBeChecked();
    },
};
